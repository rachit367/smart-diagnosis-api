const mongoose = require('mongoose')

const diagnosisSchema = new mongoose.Schema({
    symptoms: {
        type: String,
        required: true,
        trim: true
    },
    conditions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Condition'
    }]
}, { timestamps: true })

diagnosisSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Diagnosis', diagnosisSchema)
