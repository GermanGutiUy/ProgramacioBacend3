import passport from '../passport/index.js';


export const requireAuth = passport.authenticate('jwt', { session: false });


export const requireRole = (roles = []) => (req, res, next) => {
if (!Array.isArray(roles)) roles = [roles];
const user = req.user;
if (!user) return res.status(401).json({ status: 'error', error: 'No autenticado' });
if (roles.length && !roles.includes(user.role)) {
return res.status(403).json({ status: 'error', error: 'No autorizado' });
}
next();
};