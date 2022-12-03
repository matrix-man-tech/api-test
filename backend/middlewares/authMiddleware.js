const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = expressAsyncHandler(async(req,res,next) =>{
    let token
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.SECRET)
                const user = await User.findById(decoded?.id).select("-password")
                req.user = user
                next()
            }
        } catch(error){
            throw new Error("Not authourized, token expired, login again")
        }
    } else{
        throw new Error("there is no token attatched to the header")
    }
})

module.exports = {authMiddleware}