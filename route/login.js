const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {createTokens, createRefreshToken} = require('../jwt/middleware')
const Users = require('../model/register')
const admin = require('../firebaseAdmin')
const { verify } = require("jsonwebtoken");
const { refreshToken } = require("firebase-admin/app");


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
            let jwtaccesstoken =  typeof userData.userId === 'object' && userData.userId.toHexString
            ? userData.userId.toHexString()
            : userData.userId.toString();
          const accessToken = createTokens(emailuse, jwtaccesstoken);
          const refreshToken = createRefreshToken(emailuse);
          await Users.findOneAndUpdate(
            { email: emailuse },
            { token: accessToken,refreshToken:refreshToken}
          );
          return res.status(200).json({
            token: accessToken,
            refreshToken: refreshToken,
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


router.route("/refreshToken").post(async (req, res) => {
  const { email, refreshToken } = req.body;
  const emailuse = email.toLowerCase().trim();

  try {
    // Verify the provided refresh token using the refresh secret key
    const payload = verify(refreshToken, process.env.REFRESH_SIGN_KEY);
    
    // Ensure the token belongs to the requesting user
    if (payload.email !== emailuse) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Generate new tokens
    const newAccessToken = createTokens(emailuse, payload.userId);
    const newRefreshToken = createRefreshToken(emailuse);

    // Update the user's document with the new tokens
    await Users.findOneAndUpdate(
      { email: emailuse },
      { token: newAccessToken, refreshToken: newRefreshToken }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      msg: "New tokens generated"
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(401).json({ msg: "Invalid or expired refresh token" });
  }
});



module.exports = router