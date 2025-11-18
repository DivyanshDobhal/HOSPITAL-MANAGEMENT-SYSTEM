import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCloudUploadAlt, FaTimes, FaFile, FaSpinner } from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'
import './FileUpload.css'

const FileUpload = ({ relatedTo, relatedId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = async (fileList) => {
    const validFiles = fileList.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`)
        return false
      }
      return true
    })

    setFiles(prev => [...prev, ...validFiles.map(file => ({ file, id: Date.now() + Math.random() }))])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map(({ file }) => {
        const formData = new FormData()
        formData.append('file', file)
        if (relatedTo) formData.append('relatedTo', relatedTo)
        if (relatedId) formData.append('relatedId', relatedId)

        return api.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      })

      await Promise.all(uploadPromises)
      toast.success(`Successfully uploaded ${files.length} file(s)`)
      setFiles([])
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      toast.error('Error uploading files')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx"
        />
        <FaCloudUploadAlt className="upload-icon" />
        <p className="upload-text">
          {isDragging ? 'Drop files here' : 'Drag & drop files here or click to select'}
        </p>
        <p className="upload-hint">Supports: Images, PDF, Word documents (Max 10MB)</p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="file-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4>Selected Files ({files.length})</h4>
            {files.map(({ file, id }) => (
              <motion.div
                key={id}
                className="file-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FaFile className="file-icon" />
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(id)
                  }}
                  disabled={uploading}
                >
                  <FaTimes />
                </button>
              </motion.div>
            ))}
            <button
              className="btn btn-primary upload-btn"
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
            >
              {uploading ? (
                <>
                  <FaSpinner className="spinning" /> Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Upload {files.length} file(s)
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload

