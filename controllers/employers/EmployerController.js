// controllers/employerController.js

const { getEmployerIdFromUser,getEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer,getEmployerByUserId } = require('../../models/employer/employer');

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
  


module.exports = { getAllEmployers, getEmployer, createNewEmployer, updateOldEmployer, deleteOldEmployer,getEmployerByUser};
