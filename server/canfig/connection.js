import mongoose from "mongoose";


const connection = async ()=> {

    try {

        const connectDb = await mongoose.connect(process.env.MONGO_URL);
        
        console.log("Database Connection Successful Hai", connectDb.connection.host, connectDb.connection.name);
        
    } catch (error) {
        res.status(500).json({messsage: "Database Connection nhi ho pa raha hai",error: error.message ,success:false});
        console.log("Database Connection nhi ho pa raha hai",error.message);
    }
}

export default connection;
