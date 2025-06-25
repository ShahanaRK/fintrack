const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/connectDB');
const routes = require('./routes/userRoute');


dotenv.config();
connectDb();
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/v1/users', routes);
app.get('/',(req,res) => {
    res.send("<h1>Welcome to expense tracker app</h1>");
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});





