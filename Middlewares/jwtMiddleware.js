const jwt = require('jsonwebtoken')
const jwtMiddleware = (req,res,next)=>{
    console.log("Inside JWTMiddleware");
    //get token
    console.log("Authorization Header:", req.headers.authorization);
    let token = req.headers.authorization.slice(7)
    console.log(token);
    try{
        //token verification
        const tokenVerify = jwt.verify(token,'secretkeyaug2025')
        console.log(tokenVerify);
        req.payload=tokenVerify
         req.user = tokenVerify
        next()

    }catch(err){
        res.status(401).json("Authorization Failed....")
    }
    
}
module.exports=jwtMiddleware