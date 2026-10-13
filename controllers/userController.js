// const users = require("../data/users")

const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const bcrypt = require('bcrypt')

//Get users
// const getUsers = (req, res)=>{
//     res.status(200).json({
//         success: true,
//         data: users
//     })
// }
const getUsers = async (req, res) => {

    try {
        const user = await User.find()
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

//create User
const createUsers = async (req, res) => {
    const { name, gender, email, password } = req.body;
    const saltRounds = 10
    // const newUser = {
    //     id: users.length>0 ? users[users.length-1].id+1 : 1,
    //     name,
    //     gender:gender.toLowerCase(),
    //     email
    // }
    // users.push(newUser)

    try {
        //hashing
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }

            const newUser = new User({
                name: name,
                email: email,
                gender: gender,
                password: hash
            })
            const savedUser = await newUser.save()

            res.status(201).json({
                success: "User created successfully",
                data: savedUser
            })
        })


    } catch (error) {
        res.status(400).json({ message: error.message })
    }


}
// app/users/:id
const getUserById = async (req, res, next) => {
    // const id = Number(req.params.id);
    // const user = users.find((user)=> user.id === id)
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            const error = new Error("User not found.")
            error.status = 404
            return next(error)
        }
        res.status(200).json({
            success: true,
            data: user
        })


    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

// Update user
const updateUser = async (req, res, next) => {
    // const id = Number(req.params.id);
    // const userIndex = users.findIndex((user)=> user.id === id)

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidator: true
        })
        if (!updatedUser) {
            const error = new Error("User not found.")
            error.status = 404
            return next(error)
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

    // const {name, email, gender} = req.body
    // users[userIndex] ={
    //     ...users[userIndex],
    //     name,
    //     gender:gender.toLowerCase(),
    //     email
    // }

}

// Delete user
const deleteUser = async (req, res) => {
    // const id = Number(req.params.id);
    // const userIndex = users.findIndex((user)=> user.id === id)

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)

        if (!deletedUser) {
            const error = new Error("User not found.")
            error.status = 404
            return next(error)
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
    // const deleteUser = users.splice(userIndex, 1)

}

//login
const login = async (req, res, next) => {
    try {

        if (!req.body) {
            return res.status(404).json({
                error: "Login details cannot be empty"
            })
        }
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                error: "User not one"
            })
        }
        // const isValid = (password === user.password)
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(400).json({
                error: "Incorrect credetnails"
            })
        }

        //For valies user - create Token
        let payload = {
            user: email,
            role: user.role
        }
        const token = generateToken(payload)
        // res.cookie('token', token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Login successfull" })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
const checkUser = async (req, res) => {
    return res.status(200).json({ message: "User validated" })
}

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
}

module.exports = {
    getUsers,
    createUsers,
    getUserById,
    updateUser,
    deleteUser,
    login,
    checkUser,
    logout

}