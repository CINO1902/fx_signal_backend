const { sign, verify } = require("jsonwebtoken");

const createTokens = (email, userId) => {
  const accessToken = sign(
    { email: email, userId: userId },
    process.env.SIGN_KEY,
    { expiresIn: "24h" }  // Token expires in 24 hours
  );

  return accessToken;
};

const createRefreshToken = (email, userId) => {
  // It's a good practice to use a different secret key for refresh tokens.
  // They typically last longer (e.g., 7 days or 30 days)
  const refreshToken = sign(
    { email: email},
    process.env.REFRESH_SIGN_KEY,
    { expiresIn: "7d" }  // Refresh token expires in 7 days
  );
  return refreshToken;
};


const validateToken = (req, res, next) => {
  let accessToken = req.headers["authorization"];
  accessToken = accessToken.slice(7,accessToken.length);
  console.log(accessToken)
  if(accessToken){
    verify(accessToken, process.env.SIGN_KEY,(err,decoded)=>{
        if(err){
            return res.status(401).json({success:'false', msg:'Invalid Token'})
        }else{
            req.decoded=decoded;
            next();
        }
    })
  }else{
    return  res.status(401).json({success:'false', msg:'Token not provided'})
  }
};

module.exports = { createTokens,createRefreshToken, validateToken};