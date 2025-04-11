const express = require("express");
const router = express.Router();
const contact = require('../model/contact')
const { sendMessageReceivedEmail } = require('../utils/sendmail');

router.route('/contactUs').post(async (req, res) => {
    const { firstname, lastname, email, subject, message } = req.body;
    const now = new Date();
    
    try {
      // Determine the time one hour ago
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
      // Check if a contact message from this email exists in the past hour
      const recentMessage = await contact.findOne({ 
        email: email, 
        date: { $gte: oneHourAgo } 
      });
  
      if (recentMessage) {
        return res.status(429).json({
          status: "fail",
          msg: "Sorry, you can only send one message every hour. Please try again later."
        });
      }
  
      // Create the new contact message
      await contact.create({
        firstname,
        lastname,
        email,
        subject,
        message,
        date: now    
      });
      await sendMessageReceivedEmail(req.body.email, firstname);
      return res.status(201).json({ status: "success", msg: "Message Sent" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }
  });
  
  module.exports = router;
  
