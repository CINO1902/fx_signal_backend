const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const register = require('../model/register')
const {createTokens, createRefreshToken} = require('../jwt/middleware')


router.route('/createaccount').post(async (req, res) => {
  const { firstname, lastname, email, phone_number, password, country } = req.body;
  const emailuse = email.toLowerCase().trim();
  const date = new Date();

  try {
    // Check if user already exists
    const existingUser = await register.findOne({ email: emailuse });
    if (existingUser) {
      return res.status(400).json({ status: "fail", msg: "User Already Exist" });
    }

    // Hash the password
    const hashpassword = await bcrypt.hash(password, 10);

    // Create the new user with an empty token initially
    const newUser = await register.create({
      firstname: firstname,
      lastname: lastname,
      email: emailuse,
      email_verify: false,
      completed_profile: false,
      image_url: "",
      allownotification: false,
      trading_experience: "Beginner",
      country: country,
      phone_number: phone_number,
      password: hashpassword,
      token: "", // initially empty
      date: date
    });
    let jwtaccesstoken =  typeof newUser._id === 'object' && newUser._id.toHexString
    ? newUser._id.toHexString()
    : newUser._id.toString();

    // Generate access token
    const accessToken = createTokens(emailuse,jwtaccesstoken );
    const refreshToken = createRefreshToken(emailuse);

    // Update the user's token field with the generated access token
    newUser.token = accessToken;
    await newUser.save();

    return res.status(201).json({
      status: "success",
      msg: "Dashboard Created",
      token: accessToken,
      refreshToken:refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "fail", msg: "Something went wrong" });
  }
});


router.route('/deleteAccount').post(async (req,res)=>{
  let userId = req.decoded.userId 
  try {
    let getdocument = await register.findOneById(userId);
    if (!getdocument) {
      return res.status(404).json({status:'fail', message:"Profile does not exist"})
    } else {
      // await register.deleteMany({email:email})
      res.status(200).json({ status: "success", msg: "Successful"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", msg: "Something went wrong" });
  }

})

module.exports = router