
import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Extend the Express Request interface to include custom properties.
// These properties will be used to store user-related information.
declare global {
    namespace Express {
        interface Request {
            userId: string;
            auth0Id: string;
        }
    }
}

// Middleware function to check JWT token.
// This function verifies the incoming token against the configured audience, issuer, and signing algorithm.
export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE, // The audience that the token must be intended for
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // The base URL of the token issuer
    tokenSigningAlg: 'RS256' // The algorithm used to sign the token
});


// Middleware function to parse JWT token.
// This function extracts the token from the authorization header, decodes it, and retrieves user information.
export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers; // Extract the authorization header from the request
    
    // If no authorization header is present or it doesn't start with "Bearer ", return 401 Unauthorized.
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    // Extract the token from the authorization header.
    const token = authorization.split(" ")[1];

    try {
        // Decode the token to obtain its payload.
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        const auth0Id = decoded.sub; // Extract the subject (sub) claim, which usually represents the user ID.

        // Find the user in the database using the extracted auth0Id.
        const user = await User.findOne({ auth0Id });

        // If user is not found, return 401 Unauthorized.
        if (!user) {
            return res.sendStatus(401);
        }

        // Attach the extracted user-related information to the request object for later use.
        req.auth0Id = auth0Id as string; // Assign the auth0Id to req.auth0Id
        req.userId = user._id.toString(); // Assign the user's ID to req.userId
        next(); // Proceed to the next middleware or route handler.

    } catch (error) {
        // If an error occurs during token decoding or user retrieval, return 401 Unauthorized.
        return res.sendStatus(401);
    }
}















// import { NextFunction,Request, Response } from "express";
// import { auth } from "express-oauth2-jwt-bearer";
// import jwt from "jsonwebtoken";
// import User from "../models/user";


// declare global{
//     namespace Express{
//         interface Request{
//             userId: string;
//             auth0Id: string;
//         }
//     }
// }
// export const jwtCheck = auth({
//     audience: process.env.AUTH0_AUDIENCE,
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     tokenSigningAlg: 'RS256'
//   });

// export const jwtParse=async(req:Request, res:Response, next:NextFunction)=>{
//     const {authorization} = req.headers;
//     if(!authorization || !authorization.startsWith("Bearer ")){
//         return res.sendStatus(401);
//     }

//     const token=authorization.split(" ")[1];

//     try{
//         const decoded=jwt.decode(token) as jwt.JwtPayload;
//         const auth0Id=decoded.sub;

//         const user = await User.findOne({auth0Id});

//         if(!user){
//             return res.sendStatus(401);
//         }
//         req.auth0Id=auth0Id as string;
//         req.userId=user._id.toString();
//         next();


//     }catch(error){
//         return res.sendStatus(401);
//     }

// }