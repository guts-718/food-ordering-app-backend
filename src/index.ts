import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute"
mongoose.connect(process.env.MONGODB_CONNECTION_STRING!) // can use as string in place of ( ! )
.then(()=>{
    console.log("connected to database");
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health",async(req:Request, res:Response)=>{
  res.send({ message: "health OK!"});
  
})
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute);
app.use("/api/restaurant",  restaurantRoute);


app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
