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
    // Get all users with a valid (non-empty) fcmToken
    const users = await Register.find({ fcmToken: { $exists: true, $ne: "" } });
    if (!users.length) {
      console.log("No users with FCM tokens found.");
      return;
    }

    const tokens = users.map(user => user.fcmToken);
    const tokenChunks = chunkArray(tokens, 500); // Split into batches of 500

    for (const chunk of tokenChunks) {
      const message = {
        tokens: chunk,
        notification: {
          title,
          body,
        }
      };
      
      try {
        const response = await admin.messaging().sendMulticast(message);
        console.log(`Batch sent: ${response.successCount} success, ${response.failureCount} failures`);
        if (response.failureCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.error(`Failed token: ${chunk[idx]}`, resp.error);
            }
          });
        }
      } catch (batchError) {
        console.error("Error sending batch message:", batchError);
      }
    }
    
    console.log(`Notifications attempted for ${tokens.length} users.`);
  } catch (error) {
    console.error("Error retrieving users or sending notifications:", error);
  }
}
module.exports = sendNotificationToAllUsers
// Example usage:
// sendNotificationToAllUsers('Greetings!', 'This is a broadcast notification.');
