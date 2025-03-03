const admin = require('firebase-admin');
const Register = require('../model/register'); // Your Mongoose model

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
  
  async function sendNotificationToAllUsers(title, body) {
    try {
      // Retrieve all users with a non-empty fcmToken field
      const users = await Register.find({ fcmToken: { $exists: true, $ne: "" } });
      if (!users.length) {
        console.log("No users with FCM tokens found.");
        return;
      }
  
      const tokens = users.map(user => user.fcmToken);
      
      // Create an array of promises for sending notifications individually
      const sendPromises = tokens.map(token => {
        const message = {
          token: token,
          notification: {
            title,
            body,
          }
        };
  
        // Send notification using the normal send function
        return admin.messaging().send(message)
          .then(response => {
            console.log(`Notification sent to ${token}: ${response}`);
            return response;
          })
          .catch(error => {
            console.error(`Error sending notification to ${token}:`, error);
            // You can choose to throw here if you want the Promise.all to reject
          });
      });
  
      // Wait for all notifications to be sent concurrently
      await Promise.all(sendPromises);
      console.log(`Notifications attempted for ${tokens.length} users.`);
    } catch (error) {
      console.error("Error retrieving users or sending notifications:", error);
    }
  }
  
module.exports = sendNotificationToAllUsers
// Example usage:
// sendNotificationToAllUsers('Greetings!', 'This is a broadcast notification.');
