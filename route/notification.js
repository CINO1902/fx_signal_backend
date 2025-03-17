const express = require("express");
const router = express.Router();
const notification = require("../model/notification");
const personalNotification = require("../model/personalNotification");

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize the Firebase app with your service account credentials

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

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


router.route('/getNotification').get(async (req, res) => {
  const { userId } = req.query;
  try {
    let notifications = await notification.find();
    let personalNotifications = await personalNotification.find({ user_id: userId });
    
    const combinedNotifications = [...notifications, ...personalNotifications];
    
    if (combinedNotifications.length === 0) {
      return res.status(404).json({ 
        status: "empty", 
        msg: "No notifications found", 
        notifications: [] 
      });
    }
    
    const sortedNotifications = combinedNotifications.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    
    res.status(200).json({ 
      status: "success", 
      msg: "Successful", 
      notifications: sortedNotifications 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: "fail", 
      msg: "Something went wrong" 
    });
  }
});




// module.exports = sendFCMNotification

module.exports = router

// Example usage:
const userDeviceToken = 'YOUR_USER_DEVICE_TOKEN';
// sendFCMNotification(userDeviceToken, 'Hello!', 'This is a test notification');
