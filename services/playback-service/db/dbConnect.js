const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/harmony_stream_users";
        const connection = await mongoose.connect(MONGODB_URI);
        if (connection)
            console.log("✅ MongoDB connected ");
        else console.log("mongodb connection unsuccessful ");
    } catch (error) {
        console.error("error occured:", error);
        process.exit(1);
    }
}

module.exports = { dbConnect }