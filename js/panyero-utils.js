/**
 * Panyero Utility Functions
 * A collection of common utility functions for the Panyero app
 */

// Format currency
function formatCurrency(amount, currency = "₱") {
  return `${currency}${Number.parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Format date
function formatDate(date) {
  if (!(date instanceof Date)) {
    if (date && date.toDate) {
      date = date.toDate()
    } else {
      date = new Date(date)
    }
  }

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format time
function formatTime(date) {
  if (!(date instanceof Date)) {
    if (date && date.toDate) {
      date = date.toDate()
    } else {
      date = new Date(date)
    }
  }

  return date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format date and time
function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`
}

// Calculate time ago
function timeAgo(date) {
  if (!(date instanceof Date)) {
    if (date && date.toDate) {
      date = date.toDate()
    } else {
      date = new Date(date)
    }
  }

  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`
  }

  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`
  }

  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`
  }

  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
  }

  return seconds < 10 ? "just now" : `${Math.floor(seconds)} seconds ago`
}

// Show toast notification
function showToast(message, type = "info", duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.style.position = "fixed"
    toastContainer.style.bottom = "20px"
    toastContainer.style.left = "50%"
    toastContainer.style.transform = "translateX(-50%)"
    toastContainer.style.zIndex = "9999"
    toastContainer.style.width = "90%"
    toastContainer.style.maxWidth = "300px"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement("div")
  toast.style.backgroundColor =
    type === "success" ? "#4caf50" : type === "error" ? "#f44336" : type === "warning" ? "#ff9800" : "#2196f3"
  toast.style.color = "white"
  toast.style.padding = "12px 16px"
  toast.style.borderRadius = "4px"
  toast.style.marginBottom = "10px"
  toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)"
  toast.style.opacity = "0"
  toast.style.transition = "opacity 0.3s ease-in-out"
  toast.textContent = message

  // Add toast to container
  toastContainer.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.style.opacity = "1"
  }, 10)

  // Hide and remove toast after duration
  setTimeout(() => {
    toast.style.opacity = "0"
    setTimeout(() => {
      toastContainer.removeChild(toast)
    }, 300)
  }, duration)
}

// Validate email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Validate phone number (Philippine format)
function validatePhoneNumber(phone) {
  const re = /^(09|\+639)\d{9}$/
  return re.test(String(phone))
}

// Generate random ID
function generateId(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Debounce function
function debounce(func, wait = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Throttle function
function throttle(func, limit = 300) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Copied to clipboard!", "success")
      return true
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err)
      showToast("Failed to copy to clipboard", "error")
      return false
    })
}

// Get user data from Firestore
async function getUserData(userId) {
  try {
    // Assuming firebase is available globally or imported elsewhere
    if (typeof firebase === "undefined") {
      console.error("Firebase is not initialized. Ensure Firebase SDK is included in your project.")
      return null
    }
    const userDoc = await firebase.firestore().collection("users").doc(userId).get()
    if (userDoc.exists) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

// Update user data in Firestore
async function updateUserData(userId, data) {
  try {
    // Assuming firebase is available globally or imported elsewhere
    if (typeof firebase === "undefined") {
      console.error("Firebase is not initialized. Ensure Firebase SDK is included in your project.")
      return false
    }
    await firebase.firestore().collection("users").doc(userId).update(data)
    return true
  } catch (error) {
    console.error("Error updating user data:", error)
    return false
  }
}

// Add notification for user
async function addNotification(userId, message, type = "info") {
  try {
    // Assuming firebase is available globally or imported elsewhere
    if (typeof firebase === "undefined") {
      console.error("Firebase is not initialized. Ensure Firebase SDK is included in your project.")
      return false
    }
    await firebase.firestore().collection("users").doc(userId).collection("notifications").add({
      message,
      type,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      isRead: false,
    })
    return true
  } catch (error) {
    console.error("Error adding notification:", error)
    return false
  }
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    timeAgo,
    showToast,
    validateEmail,
    validatePhoneNumber,
    generateId,
    debounce,
    throttle,
    copyToClipboard,
  }
}

