import { Router } from 'express';
import passport from '../passport/index.js';
import { generateToken } from '../utils/jwt.js';
import { config } from '../config/config.js';


const router = Router();


// Registro con Passport Local -> crea usuario con hash
router.post('/register', (req, res, next) => {
passport.authenticate('register', { session: false }, (err, user, info) => {
if (err) return next(err);
if (!user) return res.status(400).json({ status: 'error', error: info?.message || 'Registro inválido' });
return res.status(201).json({ status: 'success', payload: user });
})(req, res, next);
});


// Login -> valida con Local y emite JWT
router.post('/login', (req, res, next) => {
passport.authenticate('login', { session: false }, (err, user, info) => {
if (err) return next(err);
if (!user) return res.status(401).json({ status: 'error', error: info?.message || 'Login inválido' });


const token = generateToken(user);
// Cookie httpOnly opcional para clientes web
res.cookie(config.COOKIE_NAME, token, {
httpOnly: true,
sameSite: 'lax',
secure: false, // poner true si usas HTTPS
maxAge: 1000 * 60 * 60, // 1h
});


return res.json({ status: 'success', token, payload: { _id: user._id, email: user.email, role: user.role } });
})(req, res, next);
});


// Estrategia "current" -> usa Passport JWT para extraer el usuario del token
router.get('/current', passport.authenticate('jwt', { session: false, failWithError: true }), (req, res) => {
return res.json({ status: 'success', user: req.user });
});


export default router;