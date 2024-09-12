const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware to verify the token and authenticate the user
const auth = async (req, res, next) => {
    const token = req.header('Authorization');
    var actualToken="";
// Check if the token starts with 'Bearer'
if (token && token.startsWith('Bearer ')) {
    // Remove 'Bearer ' from the token string
    actualToken = token.split(' ')[1];
    console.log(actualToken); // This is the token without 'Bearer '
} else {
    console.log('No Bearer token found.');
}
    
    if (!actualToken) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        console.log("Decodes",decoded);
        req.user = await User.findByPk(decoded.userId);
        console.log(req.user);
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token, user not found' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware for role-based access control
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roleId)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { auth, authorize };
