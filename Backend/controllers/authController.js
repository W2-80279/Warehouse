const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

// User registration

const register = async (req, res) => {
    const { fullName, userName, password, email, phone, roleId } = req.body;
    console.log(userName);

    try {
        // Check if the username already exists
        const userExists = await User.findOne({ where: { userName } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("hi boob");

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash);

        // Create new user
        const user = await User.create({
            fullName,
            userName,
            passwordHash :passwordHash,
            email,
            phone,
            roleId
        });
        console.log(user);

        // Send response with the token
        res.status(201).json({
            message: 'User registered successfully',
            user:user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// User login
const login = async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body);

    try {
        // Check if user exists
        const user = await User.findOne({ where: { userName } });
        const role=await Role.findOne({where:{roleId:user.roleId}})
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { userId: user.UserId };
        console.log(payload);
        console.log(user);
        console.log(user.userId)
        const token = jwt.sign({userId:user.userId}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ userName,role:role.roleName,token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll(); // Adjust if you need to include related models
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { register, login ,getAllUsers};
