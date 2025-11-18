const File = require('../models/File');
const fs = require('fs-extra');
const path = require('path');

// @desc    Get all files
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res, next) => {
  try {
    const { relatedTo, relatedId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (relatedTo) query.relatedTo = relatedTo;
    if (relatedId) query.relatedId = relatedId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await File.countDocuments(query);

    res.status(200).json({
      success: true,
      count: files.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      relatedTo: req.body.relatedTo || 'general',
      relatedId: req.body.relatedId || null,
      description: req.body.description || '',
    });

    await file.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      data: file,
    });
  } catch (error) {
    // Delete uploaded file if database save fails
    if (req.file) {
      await fs.remove(req.file.path);
    }
    next(error);
  }
};

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
exports.downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check if file exists on disk
    if (!await fs.pathExists(file.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      });
    }

    res.download(file.path, file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Error downloading file',
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Only uploader or admin can delete
    if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file',
      });
    }

    // Delete file from disk
    if (await fs.pathExists(file.path)) {
      await fs.remove(file.path);
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

