import mongoose from "mongoose";
import dns from "dns";

// Node's built-in DNS resolver sometimes ignores the OS-level DNS settings
// on Windows (especially with certain antivirus/network setups), which
// breaks the SRV lookup MongoDB Atlas connection strings rely on.
// Forcing it to use Google's DNS directly fixes "querySrv ECONNREFUSED".
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
