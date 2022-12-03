const express = require('express')
const dotenv = require('dotenv')
const dbConnect = require('./config/dbConnect')
const { errorHandler,notFound } = require('./middlewares/errorHandler')
const { authMiddleware} = require('./middlewares/authMiddleware')
const userRoutes = require('./routes/userRoutes')


const app = express()
dotenv.config()
dbConnect()

app.use(express.json())

app.use('/api/users',userRoutes)

app.use(notFound)
app.use(errorHandler)
app.use(authMiddleware)


const PORT = process.env.PORT

app.listen(PORT,() => console.log(`Server is connected at port ${PORT}`))