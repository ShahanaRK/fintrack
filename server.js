const fs = require('fs');
console.log('Current working directory:', process.cwd());
console.log('Files here:', fs.readdirSync(process.cwd()));
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const colors = require('colors');
const connectDb = require('./config/connectDb');
connectDb();
const routes = require('./routes/userRoute');
const transactionRoutes = require('./routes/transactionRoute');
const goalRoutes = require('./routes/goalRoute');
const app = express();
const budgetRoute = require('./routes/budget');
const rateLimit = require('express-rate-limit');
const backupRoute = require('./routes/backupRoute');
const rewardRoute = require('./routes/rewardRoute');

// Define rate limiter for login route: max 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});
// Define rate limit rule: max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/', apiLimiter);
app.use('/api/users/login', loginLimiter);
app.use('/api/v1/users', routes);
app.use('/api/v1/transactions',transactionRoutes);
app.use('/api/v1/goals',goalRoutes);
app.use('/api/budget', budgetRoute);
app.use('/api/v1', backupRoute);
app.use('/api/v1', rewardRoute);
// Add this AFTER all app.use(...) and route definitions
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ Bad JSON received');
    return res.status(400).json({ error: 'Invalid JSON input' });
  }
  next(err);
});

app.get('/',(req,res) => {
    res.send("<h1>Welcome to expense tracker app</h1>");
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
