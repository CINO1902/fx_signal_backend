const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {createTokens} = require('../jwt/middleware')
const register = require('../model/register')
router.route("/login").post(async (req,res)=>{
  const { email, password } = req.body;
  let emailuse = email.toLowerCase().trim();

  const user = await register.findOne({ email: emailuse});
  console.log(user)

  if (!user) {
     return res.status(500).json({success:'false', msg: "Wrong Username and Password Combination!" })
}else{
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then(async(match) => {
        if (!match) {
          return res
            .status(500)
            .json({success:'false',  msg: "Wrong Username and Password Combination!" });
        } else {
          const userData = {};
          userData.firstname = user.firstname;
          userData.lastname = user.lastname;
          userData.email = user.email;
          userData.imageUrl = user.image_url;
          userData.phoneNumber = user.phone_number;
          userData.tradingExperience = user.trading_experience;
          userData.verified = user.email_verify;
          

          const accessToken = createTokens(emailuse)
         return res.status(200).json({token:accessToken, msg:"Successfully Logged In", success:'true', user:userData});
        }
      }).catch((e)=>{
        console.error(e)
          return res.status(500).json({success:'fail', msg:'Something went wrong'})
      });
}
});


module.exports = router