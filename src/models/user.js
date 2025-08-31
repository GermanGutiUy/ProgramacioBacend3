import mongoose from 'mongoose';


const userCollection = 'users';


const userSchema = new mongoose.Schema(
{
first_name: { type: String, required: true },
last_name: { type: String, required: true },
email: { type: String, required: true, unique: true, index: true },
age: { type: Number, required: true },
password: { type: String, required: true }, // hashed
cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: null },
role: { type: String, enum: ['user', 'admin'], default: 'user' }
},
{ timestamps: true }
);


userSchema.set('toJSON', {
transform: (_doc, ret) => {
delete ret.password; // nunca exponemos el hash
return ret;
}
});


export const UserModel = mongoose.model(userCollection, userSchema);