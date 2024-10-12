
const {createUser}=require('../../models/users/user');

const Candidate = require('../../models/candidate/candidate');
const {createEmployer} = require('../../models/employer/employer');

const bcrypt = require('bcryptjs');
const db = require('../../config/db');

const registerUser = async (req, res) => {
    const { username, email, password, userType, ...otherDetails } = req.body;
    const connection = await db.getConnection();
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // Use the password from req.body
     
      // Create user
       await connection.beginTransaction();
      const user_id = await createUser(connection,username, hashedPassword, email ,userType );
       
  
      if (userType === 'candidate') {
        await Candidate.create(user_id, otherDetails);
      } else if (userType === 'employer') {

        
        await createEmployer(connection,user_id,otherDetails);

      }
  
      res.status(201).json({ message: 'User registered successfully' });
      await connection.commit();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
      await connection.rollback();

    }finally {
        connection.release();
    }
  };

module.exports = { registerUser };
