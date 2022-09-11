// sets extra data on the request depending on if we are or not authenticated
const jwt = require("jsonwebtoken")

module.exports = (req,res,next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader){
        req.isAuth = false //will appear on every request
        return next()
    }
    const token = authHeader.split(' ')[1] // [Bearer, tokenValue]
    if(!token || token === ''){
        req.isAuth = false
        return next()
    }
    let decodedToken;
    try{
       decodedToken = jwt.verify(token, 'hashingtoken')
    }
    catch(err){
        req.isAuth = false
        return next()
    }
    if(!decodedToken){
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}