const { createUser, findUserByUsername } = require('../../models/users/user');
const Candidate = require('../../models/candidate/candidate');
const { createEmployer } = require('../../models/employer/employer');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const jwt = require('jsonwebtoken'); 

const registerUser = async (req, res) => {
    const { username, email, password, userType, ...otherDetails } = req.body;
    const connection = await db.getConnection();
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.beginTransaction();
        const user_id = await createUser(connection, username, hashedPassword, email, userType);
        
        if (userType === 'candidate') {
            await Candidate.create(user_id, otherDetails);
        } else if (userType === 'employer') {
            await createEmployer(connection, user_id, otherDetails);
        }
        
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
    const connection = await db.getConnection();

    try {
        // Find user by username
        const user = await findUserByUsername(connection, username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Adjust the expiration time as needed
        });

        res.status(200).json({ 
            message: 'Login successful', 
            token, // Send the token back to the client
            user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
};
module.exports = { registerUser, loginUser };
