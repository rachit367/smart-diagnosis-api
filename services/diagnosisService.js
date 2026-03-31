const OpenAI = require('openai')
const Diagnosis = require('../models/Diagnosis')
const Condition = require('../models/Condition')

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

async function diagnose(symptoms) {
    const prompt = `You are an experienced medical doctor and clinical diagnostician with over 20 years of practice.

A patient presents with the following symptoms: "${symptoms}"

Provide 2 to 3 differential diagnoses ranked by likelihood.

Respond ONLY with a valid JSON array in this format:
[
  {
    "condition": "Condition Name",
    "probability": "85%",
    "next_steps": ["Test", "Consult Specialist"]
  }
]`;

    const response = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
    });

    const aiText = response.choices[0].message.content.trim();
    let conditions;
    try {
        conditions = JSON.parse(aiText);
    } catch {
        throw new Error("Invalid AI response");
    }

    conditions = conditions.map(c => ({
        condition: c.condition,
        probability: c.probability,
        next_steps: c.next_steps
    }));

    const savedConditions = await Condition.insertMany(conditions);
    const conditionIds = savedConditions.map(c => c._id);
    await Diagnosis.create({ symptoms, conditions: conditionIds });

    return conditions;
}

async function getHistory() {
    const records = await Diagnosis.find()
    .sort({ createdAt: -1 })
    .populate({path:'conditions',select:'condition probability next_steps'})
    .select('_id createdAt symptoms')
    .lean()
    return records
}

module.exports = { diagnose, getHistory }
