const db = require('../../config/db'); 

const createEmployer = async ({user_id, otherDetails}) => {
  try {
    const [result] = await db.query(

     'INSERT INTO employers (user_id,state_id,company_name,address,logo,phonenumber) VALUES (?,?, ?, ?,?, ?)',
     [user_id,otherDetails.state_id,otherDetails.company_name,otherDetails.address,otherDetails.logo,otherDetails.phonenumber]
    
    );
    return result.insertId; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
};


module.exports = {createEmployer};
