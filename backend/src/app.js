import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/postRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));
app.use(morgan('dev'));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AnonWall API', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
