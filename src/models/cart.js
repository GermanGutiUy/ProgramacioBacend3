import mongoose from 'mongoose';


const cartCollection = 'carts';


const cartSchema = new mongoose.Schema(
{
products: [
{
product: { type: String },
quantity: { type: Number, default: 1 }
}
]
},
{ timestamps: true }
);


export const CartModel = mongoose.model(cartCollection, cartSchema);