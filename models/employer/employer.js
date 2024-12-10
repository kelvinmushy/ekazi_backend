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
const updateEmployer = async (employerId, companyName, address, logo, phoneNumber, companySize, employerEmail, aboutCompany, region, industry, twitter, facebook, linkedin) => {
  try {
    // Replace undefined with null to prevent SQL errors
    companyName = companyName === undefined ? null : companyName;
    address = address === undefined ? null : address;
    logo = logo === undefined ? null : logo;
    phoneNumber = phoneNumber === undefined ? null : phoneNumber;
    companySize = companySize === undefined ? null : companySize;
    employerEmail = employerEmail === undefined ? null : employerEmail;
    aboutCompany = aboutCompany === undefined ? null : aboutCompany;
    region = region === undefined ? null : region;
    industry = industry === undefined ? null : industry;
    twitter = twitter === undefined ? null : twitter;
    facebook = facebook === undefined ? null : facebook;
    linkedin = linkedin === undefined ? null : linkedin;

    const query = `
      UPDATE employers
      SET 
        company_name = ?, 
        address = ?, 
        logo = ?, 
        phonenumber = ?, 
        company_size = ?, 
        employer_email = ?, 
        aboutCompany = ?, 
        state_id = ?,  -- Assuming region is a state ID
        industry_id = ?,  -- Assuming industry is an industry ID
        twitter = ?, 
        facebook = ?, 
        linkedin = ? 
      WHERE id = ?
    `;

    // Execute the query with parameters
    const [result] = await db.execute(query, [
      companyName, 
      address, 
      logo, 
      phoneNumber, 
      companySize, 
      employerEmail, 
      aboutCompany, 
      region, 
      industry, 
      twitter, 
      facebook, 
      linkedin, 
      employerId  // Use the employer_id to update the correct employer
    ]);

    // Return affected rows count
    return result.affectedRows;
  } catch (error) {
    console.error("Error executing SQL query:", error.message); // Prints the error message
    console.error("SQL Query:", error.sql); // Optionally print the query
    console.error("SQL Params:", error.parameters); // Optionally print the parameters
    throw new Error("Failed to update employer information.");
  }
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
  e.phoneNumber,
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

// Function to get employer_id from user_employers table based on user_id
const getEmployerIdFromUser = async (userId) => {
  const query = `SELECT employer_id FROM user_employers WHERE user_id = ?`;
  const [rows] = await db.execute(query, [userId]);
  
  // Return the employer_id if found, otherwise return null
  return rows.length > 0 ? rows[0].employer_id : null;
};


module.exports = { getEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer,getEmployerByUserId,getEmployerIdFromUser };
