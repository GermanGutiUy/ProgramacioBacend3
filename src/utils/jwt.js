import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';


export function generateToken(user) {
const payload = { uid: user._id, email: user.email, role: user.role };
return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
}