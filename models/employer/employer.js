// const db = require('../../config/db'); 

// const createEmployer = async (connection,user_id, otherDetails) => {
//   try {
//     const [result] = await connection.query(

//      'INSERT INTO employers (user_id,state_id,company_name,address,logo,phonenumber,employer_email,aboutCompany) VALUES (?,?,?,?, ?,?,?,?)',
//      [user_id,otherDetails.state_id,otherDetails.company_name,otherDetails.address,otherDetails.logo,otherDetails.phonenumber,otherDetails.employer_email,otherDetails.aboutCompany]
    
//     );
//     return result.insertId; 
//   } catch (error) {
//     console.error('Error creating user:', error);
//     throw new Error('Could not create user');
//   }
// };


// module.exports = {createEmployer};
// models/employer/employer.js

const db = require('../../config/db');

// Get all employers
const getEmployers = async () => {
  const query = 'SELECT * FROM employer';
  const [rows] = await db.execute(query);
  return rows;
};

// Get employer by ID
const getEmployerById = async (id) => {
  const query = 'SELECT * FROM employer WHERE id = ?';
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};


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


// Update employer
const updateEmployer = async (id, company_name, address, logo, phone_number, employer_email, aboutCompany) => {
  const query = `
    UPDATE employer 
    SET company_name = ?, address = ?, logo = ?, phone_number = ?, employer_email = ?, aboutCompany = ? 
    WHERE id = ?
  `;
  const [result] = await db.execute(query, [company_name, address, logo, phone_number, employer_email, aboutCompany, id]);
  return result.affectedRows;
};

// Delete employer
const deleteEmployer = async (id) => {
  const query = 'DELETE FROM employer WHERE id = ?';
  const [result] = await db.execute(query, [id]);
  return result.affectedRows;
};

// Get employer by user_id
// Get employer by user_id, joining with states to get state name
const getEmployerByUserId = async (user_id) => {
  const query = `
   SELECT 
  e.id,
  e.company_name,
  e.address,
  e.logo,
  e.phonenumber,
  e.company_size,
  e.employer_email,
  e.aboutCompany,
  s.region_name,
  e.twitter,
  e.facebook,
  e.linkedin,
  i.industry_name 
FROM employers e
JOIN user_employers ue ON e.id = ue.employer_id
JOIN regions s ON e.state_id = s.id
JOIN industries i ON e.industry_id = i.id 
WHERE ue.user_id = ?;
  `;
  const [rows] = await db.execute(query, [user_id]);
  return rows[0]; // Return the first result if exists, as user can be linked to one employer
}


module.exports = { getEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer,getEmployerByUserId };
