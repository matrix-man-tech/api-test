const express = require('express')
const { userRegisterCtrl,loginUserCtrl, fetchUserCtrl, fetchUserDetailsCtrl, activeUserCtrl, deactiveUserCtrl, verifyUserCtrl, addUserCtrl, updateRoleCtrl } = require('../controllers/userControllers')
const {authMiddleware} = require('../middlewares/authMiddleware')


const userRoutes = express.Router()

userRoutes.post('/register',userRegisterCtrl)
userRoutes.post('/login',loginUserCtrl)
userRoutes.get('/',authMiddleware, fetchUserCtrl)
userRoutes.get('/:id',authMiddleware,fetchUserDetailsCtrl)
userRoutes.put('/add-user',authMiddleware,addUserCtrl)
userRoutes.put('/activate-user/:id',authMiddleware,activeUserCtrl)
userRoutes.put('/deactivate-user/:id',authMiddleware,deactiveUserCtrl)
userRoutes.put('/user-verification/:id',authMiddleware,verifyUserCtrl)
userRoutes.put('/roles/:id',authMiddleware,updateRoleCtrl)

module.exports = userRoutes