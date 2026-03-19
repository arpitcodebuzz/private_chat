// src/config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://bhushancodebuzz_db_user:AOtcW2Tuos1Mpcqn@cluster0.cellqyl.mongodb.net/?appName=Cluster0/private_chat_DB");

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1); // Stop app if DB fails
  }
};

export default connectDB;