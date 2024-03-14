import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage= multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5*1024*1024,
    },
});

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
    "/",
    jwtCheck,
    jwtParse,
    upload.single("imageFile"),
 MyRestaurantController.createMyRestaurant);


 router.put(
    "/",
    jwtCheck,
    jwtParse,
    upload.single("imageFile"),
 MyRestaurantController.updateMyRestaurant);
 
 export default router;


/*
* express: Express.js is a web application framework for Node.js used for building web applications and APIs.
* multer: Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
* jwtParse might parse the token and attach user information to the request object.
* It expects the file to be sent with the name "imageFile" in the form data. Once the file is uploaded, it will be available in the req.file object in subsequent middleware or route handlers.
*/