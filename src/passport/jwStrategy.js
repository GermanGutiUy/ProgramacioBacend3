import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.js';
import { config } from '../config/config.js';


function cookieExtractor(req) {
if (req && req.cookies) {
return req.cookies[config.COOKIE_NAME] || null;
}
return null;
}


export const jwtStrategy = new JwtStrategy(
{
jwtFromRequest: ExtractJwt.fromExtractors([
cookieExtractor,
ExtractJwt.fromAuthHeaderAsBearerToken(),
]),
secretOrKey: config.JWT_SECRET,
},
async (jwtPayload, done) => {
try {
const user = await UserModel.findById(jwtPayload.uid).lean();
if (!user) return done(null, false);
return done(null, user);
} catch (err) {
return done(err, false);
}
}
);