const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer') 
const otpModel = require('../model/otpModel')
const Message = require('../model/messageSchema')
const Conversation = require('../model/conversationSchema')

const registered = require('../model/register')
const mongoose = require('mongoose');


router.route('/:userId/getConversation').get(async (req, res) => {
  const { userId } = req.params;
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const conversation = await Conversation.findOne({ participants: objectId })
    if(!conversation){
      console.log(conversation)
      let  conversationRes = conversation._id;                     
     res.status(404).json(conversationRes);
    }else{
      console.log(conversation)
      let  conversationRes = conversation._id;                     
     res.json(conversationRes);
    }
   
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route('/:conversationId/messages').get(async (req, res) => {
    const { conversationId } = req.params;
    console.log(conversationId)
    try {
      const objectId = new mongoose.Types.ObjectId(conversationId);
    
      const messages = await Message.find({ conversation: objectId }).sort({ createdAt: 1 });
    
      if (messages.length === 0) {
        return res.status(404).json(messages);
      }
    
      return res.status(200).json(messages);
    
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
    
  });


  router.route('/:userId/conversation').get(async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const conversations = await Conversation.find({ participants: objectId })
        .populate('lastMessage') // Populate last message
        .populate('participants', 'firstname lastname email image_url') // Populate only required fields
        .sort({ updatedAt: -1 });
    
    // Remove "Admin" from participants
    const filteredConversations = conversations.map(conversation => {
        return {
            ...conversation.toObject(), // Convert Mongoose object to plain JS object
            participants: conversation.participants.filter(user => user.firstname !== "Admin")
        };
    });
    
    res.json(filteredConversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint for incremental sync: fetch messages after a given timestamp
  router.route('/conversations/:conversationId/messages').get(async (req, res) => {
    const { conversationId } = req.params;
    const { since } = req.query; // 'since' should be an ISO-formatted timestamp
  
    if (!since) {
      return res.status(400).json({ error: "Missing 'since' query parameter" });
    }
  
    try {
      const sinceDate = new Date(since);
      const messages = await Message.find({
        conversation: conversationId,
        createdAt: { $gt: sinceDate }
      }).sort({ createdAt: 1 });

      console.log(messages)
      res.json(messages);
    } catch (error) {
      console.error("Error fetching incremental messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.route('/conversations/:userId/Conversation').get(async (req, res) => {
    const { userId } = req.params;
    const { since } = req.query; // 'since' should be an ISO-formatted timestamp
  
    if (!since) {
      return res.status(400).json({ error: "Missing 'since' query parameter" });
    }
  
    try {
      const sinceDate = new Date(since);
      const objectId = new mongoose.Types.ObjectId(userId);
      const conversation = await Conversation.find({
        participants: objectId,
        createdAt: { $gt: sinceDate }
      }).populate('lastMessage') // Populate last message
      .populate('participants', 'firstname lastname email image_url').sort({ updatedAt: 1 });

      console.log(conversation)
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching incremental messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.route('/sendMessage').post(async (req,res)=>{
    const{participantIds} = req.body
    try {
        if (participantIds.length !== 2) {
            // throw new Error("A conversation must include exactly two participants.");
            return  res.status(500).json({ status: "fail", msg: "A conversation must include exactly two participants" });
          }
        
          // Check if a conversation between these two already exists.
          // Using $all ensures both IDs are in the participants array.
          // $size enforces that there are exactly two participants.
          const existingConversation = await Conversation.findOne({
            participants: { $all: participantIds, $size: 2 }
          });
        
          if (existingConversation) {
            return existingConversation;
          }
        
          // If no conversation exists, create a new one.
          const newConversation = new Conversation({
            participants: participantIds
          });
        
          return await newConversation.save();
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }

})





module.exports = router