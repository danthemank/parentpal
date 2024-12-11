import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tipsRoutes from './routes/tips.js';
import remindersRoutes from './routes/reminders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/reminders', remindersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
