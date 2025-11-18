const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessage,
  createMessage,
  markAsRead,
  getUnreadCount,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/unread/count', getUnreadCount);
router.route('/')
  .get(getMessages)
  .post(createMessage);

router.route('/:id')
  .get(getMessage)
  .delete(deleteMessage);

router.put('/:id/read', markAsRead);

module.exports = router;

