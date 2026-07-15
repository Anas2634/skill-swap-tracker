const express = require('express');
const router = express.Router();
const {
  getMatches,
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/matches', protect, getMatches);
router.post('/request', protect, sendRequest);
router.get('/requests', protect, getRequests);
router.put('/accept', protect, acceptRequest);
router.put('/reject', protect, rejectRequest);

module.exports = router;