// controllers/authController.js
const { createUser, findUserByUsername, getUserById, updateUserPassword } = require('../../models/users/user');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { username, email, password, userType, ...otherDetails } = req.body;
    const connection = await db.getConnection();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.beginTransaction();
        const user_id = await createUser(connection, username, email,hashedPassword,userType);
        // Handle candidate or employer creation if needed
        await connection.commit();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        await connection.rollback();
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        const user = await findUserByUsername(connection, username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Ensure user.password is a string
        if (typeof user.password !== 'string') {
            return res.status(500).json({ message: 'User password is not valid' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Login error:', error); // More descriptive logging
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // User ID from token
    const connection = await db.getConnection();

    try {
        const user = await getUserById(connection, userId);
       
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the current password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // If the password is valid, hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the user's password in the database
        await updateUserPassword(connection, userId, hashedNewPassword);
        
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
};


module.exports = { registerUser, loginUser, changePassword };
