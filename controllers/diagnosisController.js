const { diagnose, getHistory } = require('../services/diagnosisService')

async function diagnoseController(req, res, next) {
    try {
        const { symptoms } = req.body

        if (!symptoms || symptoms.trim() === '') {
            return res.status(400).json({ success: false, message: 'symptoms field is required' })
        }

        const record = await diagnose(symptoms)

        res.status(200).json({
            success: true,
            data: record
        })
    } catch (err) {
        next(err)
    }
}

async function getHistoryController(req, res, next) {
    try {
        const records = await getHistory()

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { diagnoseController, getHistoryController }
