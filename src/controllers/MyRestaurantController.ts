// function to handle creation of a new restaurant
// database queries and file uploads are asynchronous operations
// The core logic of the function is wrapped inside a try-catch block to handle errors gracefully.


// Importing necessary modules and dependencies
import { Request, Response } from "express"; // Importing Request and Response {types} from Express
import Restaurant from "../models/restaurant"; // Importing the Restaurant model
import cloudinary from "cloudinary"; // Importing Cloudinary for image upload functionality
import mongoose from "mongoose"; // Importing Mongoose for MongoDB interactions


const getMyRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findOne({ user: req.userId });
      if (!restaurant) {
        return res.status(404).json({ message: "restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching restaurant" });
    }
  };

// Defining an asynchronous function to handle creation of a new restaurant
const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        // Checking if there's an existing restaurant associated with the user
        // findOne was necessary as else ek array (empty) return kar skta tha and then if(existingRestaurant) would have failed.. here 1 user ka 1 hi restaurant ho skta hao
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });
        if (existingRestaurant) {
            // If a restaurant exists, return a conflict status with a message -- 409 is for duplicate
            return res.status(409).json({ message: "User restaurant already exists" });
        }

        // Extracting image data from the request
        //const image = req.file; this will throw error due to typescript

        // const image = req.file as Express.Multer.File;
        // // Converting image data to base64 format
        // const base64Image = Buffer.from(image.buffer).toString("base64");
        // // Generating a data URI for the image
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        // // Uploading the image to Cloudinary
        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
        
        const imageUrl=await uploadImage(req.file as Express.Multer.File)
        // Creating a new instance of the Restaurant model with request body
        const restaurant = new Restaurant(req.body);
        // Setting the image URL to the Cloudinary URL
        restaurant.imageUrl = imageUrl;
        // Setting the user ID for the restaurant
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        // Setting the last updated timestamp
        restaurant.lastUpdated = new Date();
        // Saving the restaurant to the database
        await restaurant.save();
        // Sending the created restaurant as a response
        res.status(201).send(restaurant);
    } catch (error) {
        // If an error occurs, log it and send a 500 status with an error message
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findOne({
        user: req.userId,
      });
  
      if (!restaurant) {
        return res.status(404).json({ message: "restaurant not found" });
      }
  
      restaurant.restaurantName = req.body.restaurantName;
      restaurant.city = req.body.city;
      restaurant.country = req.body.country;
      restaurant.deliveryPrice = req.body.deliveryPrice;
      restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
      restaurant.cuisines = req.body.cuisines;
      restaurant.menuItems = req.body.menuItems;
      restaurant.lastUpdated = new Date();
  
      if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        restaurant.imageUrl = imageUrl;
      }
  
      await restaurant.save();
      res.status(200).send(restaurant);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  const uploadImage=async(file: Express.Multer.File)=>{
    const image=file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
  }

// Exporting the createMyRestaurant function
export default {
    createMyRestaurant,
    getMyRestaurant,
    updateMyRestaurant,
};



// const image = req.file as Express.Multer.File;:

// This line extracts the file object from the request (req) object.
// In a typical web application, especially with Express.js and file upload middleware like Multer, when a file is uploaded through a form, it's stored in the req.file property.
// However, TypeScript requires explicit typing sometimes, especially with libraries like Multer where the type of req.file may not be inferred correctly. Hence, as Express.Multer.File explicitly tells TypeScript that req.file is of type Express.Multer.File.
// The Express.Multer.File type represents a file uploaded via Multer middleware in an Express application.
// const base64Image = Buffer.from(image.buffer).toString("base64");:

// This line converts the binary data of the image file to a base64-encoded string.
// Buffer.from() creates a new Buffer object from image.buffer, which contains the binary data of the uploaded image.
// .toString("base64") converts the binary data in the Buffer object to a base64-encoded string.
// const dataURI = data:${image.mimetype};base64,${base64Image};:

// Here, a data URI for the image is generated. A data URI scheme allows data to be included directly in web documents.
// The dataURI is constructed using a template literal.
// It starts with data:, followed by the MIME type of the image (image.mimetype), and then ;base64, indicating that the data is base64 encoded.
// After the comma, the base64-encoded image data (base64Image) is appended.
















// import { Request, Response } from "express";
// import Restaurant from "../models/restaurant";
// import cloudinary from "cloudinary";
// import mongoose from "mongoose";
// const createMyRestaurant = async(req: Request, res: Response)=>{

//     try{
//         const existingRestaurant=await Restaurant.findOne({user: req.userId});
//         if(existingRestaurant){
//             return res.status(409).json({message: "User restaurant already exist"});
//         }
//         const image=req.file as Express.Multer.File;
//         const base64Image=Buffer.from(image.buffer).toString("base64");
//         const dataURI=`data:${image.mimetype};base64,${base64Image}`;
    
//          const uploadResponse=await cloudinary.v2.uploader.upload(dataURI);
//          const restaurant=new Restaurant(req.body);
//          restaurant.imageUrl=uploadResponse.url;
//          restaurant.user=new mongoose.Types.ObjectId(req.userId);
//          restaurant.lastUpdated=new Date();
//          await restaurant.save();
//          res.status(201).send(restaurant);
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "Something went wrong"});
//     }
// };

// export default {
//     createMyRestaurant,
// }