import mongoose from "mongoose";
const connectdb=async()=>{
    try {
        const connectdatabase=await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
        console.log("database connected successfully")
    } catch (error) {
        console.log("database connection error",error)
    }
}
export default connectdb;