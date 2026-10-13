const express = require('express');
const userRouter = require('./routes/userRoutes')
const errorHandler = require("./middlewares/errorHandler")
const connectDB = require('./data/db')
const cookieParser = require("cookie-parser")
const cors = require('cors')

require('dotenv').config()

connectDB()

const app = express()
app.use(express.json())

const frondend_url = process.env.FRONTEND_URL

app.use(cors({
  origin: frondend_url,
  credentials: true
}))
app.use(cookieParser())
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('User management API is running!')
})

// user router
app.use("/api/users", userRouter)

// centralised error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})