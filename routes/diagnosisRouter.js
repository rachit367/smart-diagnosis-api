const express = require('express')
const { diagnoseController, getHistoryController } = require('../controllers/diagnosisController')

const router = express.Router()

router.post('/diagnose', diagnoseController)
router.get('/history', getHistoryController)

module.exports = router