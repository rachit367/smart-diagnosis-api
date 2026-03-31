const mongoose = require('mongoose')

const conditionSchema = new mongoose.Schema({
    condition: {
        type: String,
        required: true
    },
    probability: {
        type: String,
        required: true
    },
    next_steps: [{
        type: String
    }]
}, { timestamps: true })

module.exports = mongoose.model('Condition', conditionSchema)
