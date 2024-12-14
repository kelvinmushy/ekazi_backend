// controllers/authController.js
const { createUser, UserEmployer,findUserByUsername, getUserById, updateUserPassword,getUserEmployer } = require('../../models/users/user');
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

// const loginUser = async (req, res) => {
//     const { username, password } = req.body;

//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }

//     let connection;
//     try {
//         connection = await db.getConnection();
//         const user = await findUserByUsername(connection, username);

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         // Ensure user.password is a string
//         if (typeof user.password !== 'string') {
//             return res.status(500).json({ message: 'User password is not valid' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
//             expiresIn: '1h',
//         });
        
//         res.status(200).json({ message: 'Login successful', token, user });
//     } catch (error) {
//         console.error('Login error:', error); // More descriptive logging
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// };



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

        // Step 1: Check if the user is an employer
        let employerId = null;
        if (user.userType === 'employer') {
            // Step 2: Fetch the employer_id from the user_employer table
            const userEmployer = await getUserEmployer(user.id);

            if (!userEmployer) {
                return res.status(404).json({ message: 'Employer record not found' });
            }

            employerId = userEmployer.employer_id; // Get the employer_id
        }

        // Step 3: Generate JWT token
        const token = jwt.sign(
            { id: user.id, userType: user.userType, employerId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Step 4: Return response with token and employer_id if applicable
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                userType: user.userType,
                employerId: employerId, // Include employerId in the response
            }
        });
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
