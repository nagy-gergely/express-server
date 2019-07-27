const jwt = require('jsonwebtoken');

exports.loginRequired = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(error);
    }
}