const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoute = require('./api/auth');
const errorHandler = require('./handler/errorHandler');
const { loginRequired } = require('./middleware/auth');

const app = express();

dotenv.config();
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true }, () => {
    console.log('Database connected.');
});

app.use(morgan('dev'));

app.use(express.json());
app.use('/auth', authRoute);

app.get('*', (req, res, next) => {
    let err = new Error('404 Endpoint Not Found');
    next(err);
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started.');
});