
const {createUser}=require('../../models/users/user');

const Candidate = require('../../models/candidate/candidate');
const {createEmployer} = require('../../models/employer/employer');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
    const { username, email, password, userType, ...otherDetails } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // Use the password from req.body
  
      // Create user
      const user_id = await createUser({ username, hashedPassword, email ,userType });
       
  
      if (userType === 'candidate') {
        await Candidate.create(user_id, otherDetails);
      } else if (userType === 'employer') {

        console.log(otherDetails.logo);
        await createEmployer({user_id, otherDetails});

      }
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { registerUser };
