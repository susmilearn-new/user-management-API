const express = require('express')
const { getUsers, createUsers, getUserById, updateUser, deleteUser, login, checkUser, logout } = require('../controllers/userController')
const router = express.Router()
const validateUser = require("../middlewares/validateUser")
const validateToken = require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorize")

//check user is logged in
router.get('/checkUser', validateToken, checkUser)

//get all users
router.get("/", validateToken, authorize("admin"), getUsers)

//create user
router.post("/", validateUser, createUsers)

//logout user
router.post("/logout", logout)

//get single user
router.get('/:id', getUserById)

//update user by id
router.put('/:id', updateUser)

//delete user by id
router.delete('/:id', deleteUser)

//login user
router.post("/login", login)

module.exports = router