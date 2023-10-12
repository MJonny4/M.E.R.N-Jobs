import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/userModel.js";
import Job from "./models/jobModel.js";

try {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const user = await User.findOne({ email: "ion@ion.com" });

    const jsonJobs = JSON.parse(
        await readFile(new URL("./utils/mock.json", import.meta.url))
    );

    const jobs = jsonJobs.map((job) => {
        return { ...job, createdBy: user._id };
    });

    await Job.deleteMany({
        createdBy: user._id,
    });
    await Job.insertMany(jobs);
    console.log("Data imported!");
    process.exit();
} catch (err) {
    console.log(err.message);
    process.exit(1);
}
