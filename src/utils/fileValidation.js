export const validateAudioFile = (file, maxSizeMB = 10) => {
  // Supported audio file types
  const allowedTypes = [
    'audio/mpeg',
    'audio/mp3', 
    'audio/mp4',
    'audio/wav',
    'audio/x-m4a',
    'audio/m4a',
    'audio/webm'
  ]

  // File extensions as fallback for type checking
  const allowedExtensions = ['.mp3', '.mp4', '.wav', '.m4a', '.webm']
  
  // Check file type
  const isValidType = allowedTypes.includes(file.type) || 
    allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  
  if (!isValidType) {
    return {
      valid: false,
      error: 'Unsupported file format. Please use MP3, MP4, WAV, M4A, or WEBM files.'
    }
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size (${fileSizeMB.toFixed(1)}MB) exceeds your plan limit (${maxSizeMB}MB)`
    }
  }
  
  // Check if file is not empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File appears to be empty. Please select a valid audio file.'
    }
  }
  
  return { valid: true }
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}