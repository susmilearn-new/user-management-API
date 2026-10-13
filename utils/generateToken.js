const jwt = require('jsonwebtoken')

const generateToken = (payload) =>{
    return jwt.sign({payload:payload}, process.env.JWT_SECRET, {expiresIn:'15m'})
}

module.exports = generateToken