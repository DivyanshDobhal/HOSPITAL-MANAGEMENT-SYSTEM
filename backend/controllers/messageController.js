const Message = require('../models/Message');

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    let query = {};
    if (type === 'sent') {
      query.sender = userId;
    } else if (type === 'received') {
      query.recipient = userId;
    } else {
      query.$or = [{ sender: userId }, { recipient: userId }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(query)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user is sender or recipient
    if (message.sender._id.toString() !== req.user.id && 
        message.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this message',
      });
    }

    // Mark as read if recipient
    if (message.recipient._id.toString() === req.user.id && !message.read) {
      message.read = true;
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create message
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res, next) => {
  try {
    const message = await Message.create({
      ...req.body,
      sender: req.user.id,
    });

    await message.populate('sender', 'name email role');
    await message.populate('recipient', 'name email role');

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender or recipient can delete
    if (message.sender.toString() !== req.user.id && 
        message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

