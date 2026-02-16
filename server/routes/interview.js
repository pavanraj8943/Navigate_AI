const express = require('express');
const router = express.Router();
const {
    startSession,
    submitAnswer,
    skipQuestion,
    getSession,
    getSessions
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/start', startSession);
router.post('/:id/answer', submitAnswer);
router.post('/:id/skip', skipQuestion);
router.get('/:id', getSession);
router.get('/', getSessions);

module.exports = router; 