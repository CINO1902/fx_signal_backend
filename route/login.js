const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {createTokens} = require('../jwt/middleware')
const Users = require('../model/register')
const admin = require('../firebaseAdmin')


router.route("/login").post(async (req, res) => {
  const { email, password, fcmtoken } = req.body;
  const emailuse = email.toLowerCase().trim();

  // Populate the 'plan' field if it exists
  let user = await Users.findOne({ email: emailuse }).populate('plan');
  console.log(user);

  if (!user) {
    return res.status(500).json({
      success: 'false',
      msg: "Wrong Username and Password Combination!"
    });
  } else {
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword)
      .then(async (match) => {
        if (!match) {
          return res.status(500).json({
            success: 'false',
            msg: "Wrong Username and Password Combination!"
          });
        } else {
          // Build user data object
          const userData = {
            firstname: user.firstname,
            lastname: user.lastname,
            userId: user._id,
            email: user.email,
            imageUrl: user.image_url,
            phoneNumber: user.phone_number,
            tradingExperience: user.trading_experience,
            verified: user.email_verify,
            completeprofile: user.completed_profile
          };

          // If the user has a plan, add it to the response
          if (user.plan) {
            userData.plan = user.plan;
          }

          // Update fcmToken if provided
          if (fcmtoken) {
            try {
              await Users.findOneAndUpdate(
                { email: emailuse },
                { fcmToken: fcmtoken }
              );
            } catch (updateError) {
              console.error("Error updating fcmToken:", updateError);
            }
          }

          // Subscribe the provided fcmtoken to the "allUsers" topic
          admin.messaging().subscribeToTopic([fcmtoken], "allUsers")
            .then(response => console.log("Successfully subscribed:", response))
            .catch(error => console.error("Subscription error:", error));

          const accessToken = createTokens(emailuse);
          return res.status(200).json({
            token: accessToken,
            msg: "Successfully Logged In",
            success: 'true',
            user: userData
          });
        }
      })
      .catch((e) => {
        console.error(e);
        return res.status(500).json({ success: 'fail', msg: 'Something went wrong' });
      });
  }
});




router.route("/logout").post(async (req, res) => {
  const { email, fcmtoken } = req.body;
  let emailuse = email.toLowerCase().trim();
  
  try {
    const user = await Users.findOne({ email: emailuse });
    console.log(user);

    if (!user) {
      return res.status(500).json({ success: 'false', msg: "Wrong Username and Password Combination!" });
    } else {
      // Unsubscribe from topic
      await admin.messaging().unsubscribeFromTopic([fcmtoken], "allUsers")
        .then(response => console.log("Successfully unsubscribed:", response))
        .catch(error => console.error("Unsubscription error:", error));

      // Remove the fcmToken from the user's record
      await Users.updateOne(
        { email: emailuse },
        { $unset: { fcmToken: 1 } }  // This removes the fcmToken field
      );

      return res.status(200).json({ msg: "Successfully Logged Out", success: 'true' });
    }
  } catch (e) {
    return res.status(500).json({ msg: "Something Went Wrong", success: 'false' });
  }
});



module.exports = router