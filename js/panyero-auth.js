/**
 * Panyero Authentication Module
 * Handles user authentication, registration, and profile management
 */

// Initialize Firebase (if not already initialized)
function initializeFirebase() {
  if (!window.firebase) {
    console.error("Firebase SDK not loaded")
    return false
  }

  if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyDTsjYZNWFfZOESP-2QQfbD7jc5fG9FJdc",
      authDomain: "explore-malaysia-6d28d.firebaseapp.com",
      projectId: "explore-malaysia-6d28d",
      storageBucket: "explore-malaysia-6d28d.appspot.com",
      messagingSenderId: "869053244601",
      appId: "1:869053244601:web:29ad09ff454b43230be768",
      measurementId: "G-5XJK1H7KWX",
    }
    firebase.initializeApp(firebaseConfig)
  }

  return true
}

// Sign in with email and password
async function signIn(email, password) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    const userCredential = await auth.signInWithEmailAndPassword(email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error: error.message }
  }
}

// Sign up with email and password
async function signUp(email, password, userData = {}) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    const db = firebase.firestore()

    // Create user account
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...userData,
      })

    return { success: true, user }
  } catch (error) {
    console.error("Error signing up:", error)
    return { success: false, error: error.message }
  }
}

// Sign out
async function signOut() {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    await auth.signOut()
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: error.message }
  }
}

// Get current user
function getCurrentUser() {
  if (!initializeFirebase()) return null

  const auth = firebase.auth()
  return auth.currentUser
}

// Get user profile data
async function getUserProfile(userId = null) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    const db = firebase.firestore()

    // Use current user if userId not provided
    if (!userId) {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "No user is signed in" }
      }
      userId = currentUser.uid
    }

    // Get user profile from Firestore
    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return { success: false, error: "User profile not found" }
    }

    return { success: true, profile: userDoc.data() }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { success: false, error: error.message }
  }
}

// Update user profile
async function updateUserProfile(profileData, userId = null) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    const db = firebase.firestore()

    // Use current user if userId not provided
    if (!userId) {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "No user is signed in" }
      }
      userId = currentUser.uid
    }

    // Update user profile in Firestore
    await db
      .collection("users")
      .doc(userId)
      .update({
        ...profileData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }
}

// Reset password
async function resetPassword(email) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    await auth.sendPasswordResetEmail(email)
    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: error.message }
  }
}

// Change password
async function changePassword(currentPassword, newPassword) {
  if (!initializeFirebase()) return { success: false, error: "Firebase not initialized" }

  try {
    const auth = firebase.auth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      return { success: false, error: "No user is signed in" }
    }

    // Re-authenticate user
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword)

    await currentUser.reauthenticateWithCredential(credential)

    // Change password
    await currentUser.updatePassword(newPassword)

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: error.message }
  }
}

// Check if user is authenticated
function isAuthenticated() {
  if (!initializeFirebase()) return false

  const auth = firebase.auth()
  return !!auth.currentUser
}

// Listen for authentication state changes
function onAuthStateChanged(callback) {
  if (!initializeFirebase()) return () => {}

  const auth = firebase.auth()
  return auth.onAuthStateChanged(callback)
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    getUserProfile,
    updateUserProfile,
    resetPassword,
    changePassword,
    isAuthenticated,
    onAuthStateChanged,
  }
}

