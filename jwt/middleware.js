const { sign, verify } = require("jsonwebtoken");


const createTokens = (email) => {
  const accessToken = sign(
    { email: email },
    process.env.SIGN_KEY,
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  let accessToken = req.headers["authorization"];
  console.log(accessToken)
  accessToken = accessToken.slice(7,accessToken.length);

  if(accessToken){
    verify(accessToken, process.env.SIGN_KEY,(err,decoded)=>{
        if(err){
            return res.json({success:'false', msg:'Invalid Token'})
        }else{
            req.decoded=decoded;
            next();
        }
    })
  }else{
    return res.json({success:'false', msg:'Token not provided'})
  }
};

module.exports = { createTokens, validateToken};