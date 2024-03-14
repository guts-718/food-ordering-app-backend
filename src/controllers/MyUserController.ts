// Import necessary modules and dependencies
import { Request, Response } from "express"; // Importing Request and Response types from Express
import User from "../models/user"; // Importing the User model

// Function to get the current user
const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // Finding the current user by their user ID
        const currentUser = await User.findOne({ _id: req.userId });
        // If no user is found, send a 404 status with a message
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
        }
        // If the user is found, send back the user object
        res.json(currentUser);
    } catch (error) {
        // If an error occurs, log it and send a 500 status with an error message
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Function to create a new user
const createCurrentUser = async (req: Request, res: Response) => {
    //1. check if user already exists
    //2. create the user if it doesn't exist
    //3. return the user object to the calling client
    
    try {
        // Extracting necessary data from the request body
        const { auth0Id } = req.body;
        // Checking if a user with the provided auth0Id already exists
        const existingUser = await User.findOne({ auth0Id });
        // If the user already exists, return a 200 status
        if (existingUser) {
            return res.status(200).send();
        }
        // If the user doesn't exist, create a new user instance with the request body
        const newUser = new User(req.body);
        // Save the new user to the database
        await newUser.save();
        // Send a 201 status with the newly created user object
        res.status(201).json(newUser.toObject());
    } catch (error) {
        // If an error occurs, log it and send a 500 status with an error message
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

// Function to update the current user's information
const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        // Extracting necessary data from the request body
        const { name, addressLine1, country, city } = req.body;
        // Finding the user by their user ID -- we link different documents like user and restaurant based on mongo user_id so thats why we are using it instead of auth0Id
        // this req.userId has been added during the jwtParse
        const user = await User.findById(req.userId);
        // If no user is found, return a 404 status with a message
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update the user's information
        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;
        // Save the updated user to the database
        await user.save();
        // Send back the updated user object -- we do this because sometimes depending on what the frontend is trying to do it is helpful to full updated user back to them so
        // that they can do whatever they want with the new properties that were saved to the database.it also makes it a bit easier for our testing because we can manually test this API on
        // postman and check the responses to see if all the fields got added successfully 
        res.send(user);
    } catch (error) {
        // If an error occurs, log it and send a 500 status with an error message
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
}

// Exporting the functions to be used elsewhere in the application
export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
}

/*
we don't know the mongodb id of the user we want to update.all we know is that the user is logged in and they have made a request to update the profile. what we do know is that the user is logged in and we will get an access token in the request
so what we can do is we can extract the users auth0 id from the token and this is what we can use to get the user from our database
so we will create a jwtParse in auth.ts
/*
In the provided code, Auth0 is used as an authentication service. It allows users to securely sign up, log in, and authenticate themselves within the application. Let's break down the flow of how Auth0 is used in this context:

User Creation and Authentication with Auth0:

When a new user wants to sign up or log in to the application, they interact with the frontend, which then communicates with the backend.
The frontend typically collects user credentials (such as username and password) or uses OAuth to allow users to sign in with a third-party identity provider (like Google, Facebook, etc.).
When a user signs up or logs in, the frontend sends a request to the backend, including the necessary authentication data.
The backend then forwards this data to Auth0's authentication endpoint, such as /authorize or /token, for authentication and validation.
Auth0 validates the user credentials or OAuth tokens and returns an authentication response to the backend.
Handling Authentication Response:

Upon receiving the authentication response from Auth0, the backend verifies the response's validity.
If the authentication is successful, Auth0 typically returns a JSON Web Token (JWT) containing information about the user, such as their user ID (sub claim), username, email, and other custom claims.
The backend extracts the user information from the JWT and uses it to identify and authorize the user within the application.
Using Auth0 User ID:

In the provided code, Auth0 is used to uniquely identify users by their auth0Id.
When a user interacts with the application, their Auth0 user ID is included in the request payload (e.g., in the req.body) or as part of the request headers.
This auth0Id is used to query the database and check if the user already exists (createCurrentUser function) or to retrieve the user's information (getCurrentUser and updateCurrentUser functions).
Creating New Users and Updating User Information:

When a user signs up for the first time, the backend checks if a user with the provided auth0Id already exists in the database.
If the user does not exist, a new user entry is created in the database (createCurrentUser function).
If the user already exists, no new entry is created, and the existing user's information remains unchanged.
Users can also update their information (such as name, address, etc.) using the updateCurrentUser function. Again, the auth0Id is used to identify the user whose information needs to be updated.
Secure Authentication and Authorization:

Auth0 provides secure authentication and authorization mechanisms, ensuring that only authenticated and authorized users can access protected resources within the application.
The use of JWTs facilitates stateless authentication, as the backend can validate and decode the JWT to verify the user's identity without the need for server-side session management.
Overall, Auth0 simplifies the process of user authentication and authorization, allowing developers to focus on building the application's features without worrying about the complexities of managing user identities and credentials.
*/






















// import {Request,Response} from "express";
// import User from "../models/user";



// const getCurrentUser=async (req:Request,res:Response)=>{
//     try{

//         const currentUser = await User.findOne({_id: req.userId});
//         if(!currentUser){
//             res.status(404).json({message: "user not found"});
//         }
//         res.json(currentUser);
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "something went wrong"});
//     }
// }
// const createCurrentUser = async(req:Request, res:Response)=>{
//     //1. check if user already exists
//     //2. create the user if it doesn't exist
//     //3. return the user object to the calling client
    
//     try{
//         const {auth0Id} =req.body;
//         const existingUser=await User.findOne({auth0Id});
//         if(existingUser){
//             return res.status(200).send();
//         }
//         const newUser=new User(req.body);
//         await newUser.save();

//         res.status(201).json(newUser.toObject());

//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "Error creating user"});
//     }

// };

// const updateCurrentUser=async (req: Request, res: Response)=>{
//     try{
//         const { name, addressLine1, country, city }=req.body;
//         const user=await User.findById(req.userId);

//         if(!user){
//             return res.status(404).json({ message: "User not found"});
//         }
//         user.name=name;
//         user.addressLine1=addressLine1;
//         user.city=city;
//         user.country=country;

//         await user.save();

//         res.send(user);
        
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "Error updating user"});

//     }
// }



// export default{
//     createCurrentUser,
//     updateCurrentUser,
//     getCurrentUser,
// }