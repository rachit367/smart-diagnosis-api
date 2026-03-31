const OpenAI = require('openai')
const Diagnosis = require('../models/Diagnosis')
const Condition = require('../models/Condition')

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

async function diagnose(symptoms) {
    const prompt = `You are an experienced medical doctor and clinical diagnostician with over 20 years of practice across internal medicine, general practice, and emergency care. You approach every case with the thoroughness and precision of a board-certified physician conducting a professional clinical assessment.

A patient presents with the following symptoms: "${symptoms}"

Based on your clinical expertise, provide 2 to 3 differential diagnoses ranked by likelihood. For each condition, assess the probability based on symptom correlation and common clinical presentations.

Respond ONLY with a valid JSON array. No explanation, no markdown. Example format:
[
  {
    "condition": "Condition Name",
    "probability": "85%",
    "next_steps": ["Order a complete blood count (CBC)", "Refer to a gastroenterologist for further evaluation"]
  }
]

Clinical Guidelines:
- probability must be a percentage like "70%" reflecting realistic clinical likelihood
- next_steps must be specific and professional — include precise diagnostic tests (e.g. "MRI scan", "ECG", "HbA1c blood test") and the exact specialist to consult (e.g. "Cardiologist", "Neurologist", "Endocrinologist")
- Use proper medical terminology in condition names
- Prioritize patient safety — always include urgent red-flag warnings in next_steps if symptoms suggest a serious or life-threatening condition`


    const response = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
    })


    const aiText = response.choices[0].message.content.trim()
    const conditions = JSON.parse(aiText)

    const savedConditions = await Condition.insertMany(conditions)
    const conditionIds = savedConditions.map(c => c._id)

    const record = await Diagnosis.create({ symptoms, conditions: conditionIds })
    return await record.populate('conditions')
}

async function getHistory() {
    const records = await Diagnosis.find().sort({ createdAt: -1 }).populate('conditions')
    .lean()
    return records
}

module.exports = { diagnose, getHistory }
