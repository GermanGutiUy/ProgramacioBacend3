import passport from 'passport';
import { jwtStrategy } from './jwtStrategy.js';
import { registerStrategy, loginStrategy } from './localStrategies.js';


export function initPassport() {
passport.use('jwt', jwtStrategy);
passport.use('register', registerStrategy);
passport.use('login', loginStrategy);
}


export default passport;