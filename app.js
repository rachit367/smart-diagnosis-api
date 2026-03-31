const path=require('path')
const dotenv=require('dotenv')
dotenv.config({path:path.join(__dirname,'.env')})

const cors=require('cors')
const express=require('express')
const app=express()

const {connectDB}=require('./config/db')
const errorHandling=require('./middlewares/errorHandling')
const diagnoseRouter=require('./routes/diagnosisRouter')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:'*'
}))

connectDB()

//=======API ROUTES=======
app.use('/api',diagnoseRouter)




app.use(errorHandling)
module.exports={app}