// controllers/employerController.js

const { getEmployerIdFromUser,getEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer,getEmployerByUserId } = require('../../models/employer/employer');
const db = require('../../config/db');
const fs = require('fs');
const path = require('path');
// Get all employers
const getAllEmployers = async (req, res) => {
  try {
    const employers = await getEmployers();
    res.json(employers);
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ error: 'Failed to fetch employers' });
  }
};

// Get employer by ID
const getEmployer = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await getEmployerById(id);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (error) {
    console.error('Error fetching employer:', error);
    res.status(500).json({ error: 'Failed to fetch employer' });
  }
};

// Create a new employer
const createNewEmployer = async (req, res) => {
  const { company_name, address, logo, phone_number, employer_email, aboutCompany, state_id } = req.body;
  console.log(req.body);
  try {
    const employerId = await createEmployer(company_name, address, logo, phone_number, employer_email, aboutCompany, state_id);
    await userEmployer (connection, user_id, employerId) 
    res.status(201).json({ employerId });
  } catch (error) {
    console.error('Error creating employer:', error);
    res.status(500).json({ error: 'Failed to create employer' });
  }
};

// Update employer
const updateOldEmployer = async (req, res) => {
    const { id } = req.params;
  
    const { 
      companyName, 
      address, 
      logo, 
      phonenumber,  // Changed to match the parameter name
      companySize, 
      employerEmail, 
      aboutCompany, 
      region, 
      industry, 
      twitter, 
      facebook, 
      linkedin 
    } = req.body;
  
    try {
      // Validate inputs if needed
      if (!id || !companyName || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
     // Fetch the employer_id from the user_employers table based on the user id
     const employerId = await getEmployerIdFromUser(id);
    
     // If no employer_id found, return an error
     if (!employerId) {
       return res.status(404).json({ error: 'Employer not found for the given user id' });
     }
 
      // Call the updateEmployer function
      const affectedRows = await updateEmployer(
        employerId, 
        companyName, 
        address, 
        logo, 
        phonenumber, 
        companySize, 
        employerEmail, 
        aboutCompany, 
        region, 
        industry, 
        twitter, 
        facebook, 
        linkedin
      );
  
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Employer not found or no changes made' });
      }
  
      // Respond with success
      res.status(200).json({ affectedRows });
  
    } catch (error) {
      console.error('Error updating employer:', error);
      res.status(500).json({ error: 'Failed to update employer' });
    }
  };
  

// Delete employer
const deleteOldEmployer = async (req, res) => {
  const { id } = req.params;
  try {
    const affectedRows = await deleteEmployer(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    console.error('Error deleting employer:', error);
    res.status(500).json({ error: 'Failed to delete employer' });
  }
};

// Get employer by user_id
const getEmployerByUser = async (req, res) => {
    const { user_id } = req.params; // Extract user_id from request params
    try {
      const employer = await getEmployerByUserId(user_id);
      if (!employer) {
        return res.status(404).json({ error: 'Employer not found for this user' });
      }
      res.status(200).json(employer);
    } catch (error) {
      console.error('Error fetching employer by user_id:', error);
      res.status(500).json({ error: 'Failed to fetch employer' });
    }
  };
  


 

  const uploadLogo = async (req, res) => {
    try {
      // Check if the file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Get employerId from request params
      const { employerId } = req.params;
  
      // Generate the new file path for the uploaded logo
      const logoPath = `/uploads/logos/${req.file.filename}`;
  
      // Connect to the database
      const connection = await db.getConnection();
  
      // Check if the employer already has a logo
      const checkQuery = 'SELECT logo FROM employers WHERE id = ?';
      const [existingLogo] = await connection.query(checkQuery, [employerId]);
  
      if (existingLogo.length > 0 && existingLogo[0].logo) {
        // If a logo already exists, delete the old one
        const oldLogoPath = existingLogo[0].logo.replace('/uploads', 'uploads'); // Correct the path for the file system
        const absoluteOldLogoPath = path.join(__dirname, '..', '..', oldLogoPath); // Create an absolute file path
  
        console.log('Trying to delete old logo at path:', absoluteOldLogoPath);
  
        // Check if the old logo exists and delete it
        if (fs.existsSync(absoluteOldLogoPath)) {
          fs.unlinkSync(absoluteOldLogoPath); // Delete the old logo file
          console.log('Old logo deleted:', absoluteOldLogoPath);
        } else {
          console.log('Old logo file does not exist:', absoluteOldLogoPath);
        }
      }
  
      // Update the database with the new logo
      const updateQuery = 'UPDATE employers SET logo = ? WHERE id = ?';
      const [result] = await connection.query(updateQuery, [logoPath, employerId]);
  
      if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: 'Logo updated successfully',
          logoPath,
        });
      } else {
        return res.status(404).json({ message: 'Employer not found' });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  

  // Get Employer Logo by Employer ID
 
  const getLogo = async (req, res) => {
    try {
      const employerId = req.params.employerId; // Get employer ID from the URL parameter
  
      console.log('Employer ID:', employerId); // Log for debugging
  
      // Connect to the database
      const connection = await db.getConnection();
  
      // Query to get the employer's logo path
      const query = 'SELECT logo FROM employers WHERE id = ?';
      const [rows] = await connection.query(query, [employerId]);
  
      // If no rows are returned, it means the employer was not found
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Employer not found' });
      }
  
      // Get the logo path from the result
      const logoPath = rows[0].logo;
  
      // If no logo path is found
      if (!logoPath) {
        return res.status(404).json({ message: 'Logo not found for the employer' });
      }
  
      // Respond with the relative path to the logo
      return res.json({ logo: logoPath });  // Just return the path stored in the database
  
    } catch (error) {
      console.error('Error fetching logo:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
 
  
  
  




module.exports = { getAllEmployers, getEmployer, createNewEmployer, updateOldEmployer, deleteOldEmployer,getEmployerByUser,uploadLogo,getLogo};
