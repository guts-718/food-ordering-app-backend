import mongoose, { InferSchemaType } from "mongoose";
// InferSchemaType is a utility type provided by Mongoose to infer TypeScript types from Mongoose schemas.
// if we want to use a mongoose schema as a type in typescript then we use InferSchemaType 

// menuItemSchema defines the schema for menu items
// _id is an ObjectId field, which is automatically generated if not provided, ensuring uniqueness for each menu item
const menuItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
        // if nothing is provided then default
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

const restaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    estimatedDeliveryTime: { type: Number, required: true },
    cuisines: [{ type: String, required: true }],
    menuItems: [menuItemSchema],
    imageUrl: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;


