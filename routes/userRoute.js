const express = require('express')
const { loginController, registerController } = require('../controllers/userController')

const router = express.Router()
//login
router.post('/login',loginController)
//register
router.post('/register',registerController)