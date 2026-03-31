const mongoose=require('mongoose')

async function connectDB() {
    try{
        const uri=process.env.MONGO_URI
        await mongoose.connect(uri)
        console.log('MongoDB connected')
    }catch(err){
        console.error(err.message)
        process.exit(1)
    }
    
}

module.exports={connectDB}