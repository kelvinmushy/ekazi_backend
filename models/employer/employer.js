const db = require('../../config/db'); 

const createEmployer = async (connection,user_id, otherDetails) => {
  try {
    const [result] = await connection.query(

     'INSERT INTO employers (user_id,state_id,company_name,address,logo,phonenumber,employer_email,aboutCompany) VALUES (?,?,?,?, ?,?,?,?)',
     [user_id,otherDetails.state_id,otherDetails.company_name,otherDetails.address,otherDetails.logo,otherDetails.phonenumber,otherDetails.employer_email,otherDetails.aboutCompany]
    
    );
    return result.insertId; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
};


module.exports = {createEmployer};
