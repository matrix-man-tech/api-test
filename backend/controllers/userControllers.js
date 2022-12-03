const expressAsyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')
const User = require('../models/User')
const validateMongodbId = require('../utils/validateMongodbId')

const userRegisterCtrl = expressAsyncHandler(async(req,res) =>{
    const { firstName,lastName,email,password} = req.body
    console.log(req.body)
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    try {
        const user = await User.create({
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            password: req?.body?.password,
            $set:{
                isAdmin: false,
                isSuperAdmin: false
            }
        })
        res.json(user)
    } catch (error) {
        res.json(error)
    }
})

const loginUserCtrl = expressAsyncHandler(async (req,res) =>{
    const { firstName,lastName,email,password} = req.body
    const userFound = await User.findOne({email})
    if(userFound && (await userFound.isPasswordMatched(password))){
        res.json({
            id:userFound?._id,
            firstName:userFound?.firstName,
            lastName:userFound?.lastName,
            email:userFound?.email,
            isAdmin:userFound?.isAdmin,
            isSuperAdmin:userFound?.isSuperAdmin,
            token:generateToken(userFound?._id)
            
        })
    }
    else{
        res.status(401)
        throw new Error("Invalid credentials")
    }
})

const addUserCtrl = expressAsyncHandler(async(req,res) =>{
    const {isAdmin,isSuperAdmin} = req.user
    const { firstName,lastName,email,password} = req.body
    console.log(req.body)
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    if(isAdmin){
        try {
            const user = await User.create({
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                password: req?.body?.password,
                isAdmin:false
            })
            res.json(user)
        } catch (error) {
            res.json(error)
        }
    }
    else if(isSuperAdmin){
        try {
            const user = await User.create({
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                password: req?.body?.password,
                isAdmin:req?.body?.isAdmin,
                
            })
            res.json(user)
        } catch (error) {
            res.json(error)
        }
    }
    else{
        throw new Error("You are not authorized")
    }
    
   
})

const fetchUserCtrl = expressAsyncHandler(async (req,res)=>{
    const {isAdmin,isSuperAdmin} = req.user
    if(!isAdmin || isSuperAdmin){
        try{
            const users = await User.find({})
            res.json(users)
        }catch (error){
            res.json(error)
        }
    }
    else{
        throw new Error('You are not authorized')
    }
})

const fetchUserDetailsCtrl = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params
    const {isAdmin,isSuperAdmin} = req.user
    console.log(req.user)
    validateMongodbId(id)

    if(isAdmin || isSuperAdmin || (req.params.id === req.user.id)){
    try {
        const user = await User.findById(id)
        res.json(user)
    } catch (error) {
        res.json(error)
    }
}
else{
    throw new Error('You are not authorized')
}
})

const activeUserCtrl = expressAsyncHandler(async(req,res)=>{
    const { id } = req.params
    const {isAdmin,isSuperAdmin} = req.user
    validateMongodbId(id)
    if(isAdmin || isSuperAdmin || id === req.user.id){
        const user = await User.findByIdAndUpdate(
            id, 
            {
               isAccountActivated: true
            },
            {
            new: true
            })
            res.json(user)
    }
    
 })

 const deactiveUserCtrl = expressAsyncHandler(async(req,res)=>{
    const { id } = req.params
    const {isAdmin,isSuperAdmin} = req.user
    validateMongodbId(id)
    if(isAdmin || isSuperAdmin){
        const user = await User.findByIdAndUpdate(
            id, 
            {
               isAccountActivated: false
            },
            {
            new: true
            })
            res.json(user)
    }
 })

 const verifyUserCtrl = expressAsyncHandler(async(req,res)=>{
    const { id } = req.params
    const {isSuperAdmin} = req.user
    validateMongodbId(id)
    if(isSuperAdmin){
        const user = await User.findByIdAndUpdate(
            id, 
            {
                isAccountVerified: true
            },
            {
            new: true
            })
            res.json(user)
    }
 })

 const updateRoleCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
   const { isSuperAdmin } = req.user
    
    validateMongodbId(id);

    if(isSuperAdmin){
        const user = await User.findByIdAndUpdate(
            _id,
            {
                isAdmin: req?.body?.isAdmin,
                isSuperAdmin: req?.body?.isSuperAdmin
            },
            {
              new: true,
              runValidators: true,
            }
          );
          res.json(user);
    }
    
  });

module.exports = { loginUserCtrl,userRegisterCtrl,fetchUserCtrl,fetchUserDetailsCtrl,activeUserCtrl,deactiveUserCtrl,verifyUserCtrl,addUserCtrl,updateRoleCtrl}
