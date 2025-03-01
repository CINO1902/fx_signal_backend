const admin = require('firebase-admin');
require('dotenv').config();

// Initialize the Firebase app with your service account credentials

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/**
 * Sends an FCM notification to a given device token.
 * @param {string} deviceToken - The recipient device's FCM token.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body text of the notification.
 */
async function sendFCMNotification(deviceToken, title, body) {
  const message = {
    token: deviceToken,
    notification: {
      title: title,
      body: body,
    },
    // Optional: add additional data payload
    // data: {
    //   key1: 'value1',
    //   key2: 'value2'
    // }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}





module.exports = sendFCMNotification

// Example usage:
const userDeviceToken = 'YOUR_USER_DEVICE_TOKEN';
// sendFCMNotification(userDeviceToken, 'Hello!', 'This is a test notification');
