import express from 'express';


import { connectMongo } from './db/mongo.js';
import { config } from './config/config.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import { initPassport } from './passport/index.js';
import passport from './passport/index.js';


const app = express();


// Middlewares base
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Passport
initPassport();
app.use(passport.initialize());


// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);


// Healthcheck
app.get('/ping', (_req, res) => res.json({ status: 'ok' }));


// Manejo de errores consistente
app.use((err, _req, res, _next) => {
console.error('Unhandled error:', err);
const status = err.status || 500;
res.status(status).json({ status: 'error', error: err.message || 'Internal Server Error' });
});


// Inicio
await connectMongo();
app.listen(config.PORT, () => {
console.log(`🚀 Server escuchando en http://localhost:${config.PORT}`);
});