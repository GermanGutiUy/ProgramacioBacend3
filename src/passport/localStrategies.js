import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../models/user.js';
import { createHash, isValidPassword } from '../utils/hash.js';


export const registerStrategy = new LocalStrategy(
{ usernameField: 'email', passReqToCallback: true, session: false },
async (req, email, password, done) => {
try {
const exists = await UserModel.findOne({ email });
if (exists) return done(null, false, { message: 'Email ya registrado' });


const { first_name, last_name, age } = req.body;
if (!first_name || !last_name || !age || !password)
return done(null, false, { message: 'Campos incompletos' });


const user = await UserModel.create({
first_name,
last_name,
email,
age,
password: createHash(password),
role: 'user'
});
return done(null, user);
} catch (err) {
return done(err);
}
}
);


export const loginStrategy = new LocalStrategy(
{ usernameField: 'email', session: false },
async (email, password, done) => {
try {
const user = await UserModel.findOne({ email });
if (!user) return done(null, false, { message: 'Credenciales inválidas' });
if (!isValidPassword(password, user.password))
return done(null, false, { message: 'Credenciales inválidas' });
return done(null, user);
} catch (err) {
return done(err);
}
}
);