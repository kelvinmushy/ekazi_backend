const { createApplicant, getApplicantById,updateApplicant,getApplicantsWithDetails } = require('../../models/applicants/applicant'); // Importing model functions
const { saveSelectedCvTemplate } = require('../../models/applicants/applicantSelectedCv'); // Importing model functions
const {selectExperiencesByApplicantId}=require('../../models/applicants/applicantExperiences');

const db = require('../../config/db');
const fs = require('fs');
const path = require('path');
// Controller to create a new applicant and their details
const createApplicantController = async (req, res) => {
  try {
    const { user_id, otherDetails } = req.body; // Get user_id and otherDetails from the request body
    
    if (!user_id || !otherDetails) {
      return res.status(400).json({ message: 'user_id and otherDetails are required' });
    }

    const applicant_id = await createApplicant(user_id, otherDetails);
    
    // If you successfully created the applicant, return the applicant_id
    return res.status(201).json({ message: 'Applicant created successfully', applicant_id });
    
  } catch (error) {
    console.error('Error creating applicant:', error);
    return res.status(500).json({ message: 'Error creating applicant', error: error.message });
  }
};

// Controller to get a specific applicant by their ID
const getApplicantByIdController = async (req, res) => {
  
  try {
    const { applicantId } = req.params; // Extract the applicant_id from the URL parameters
    
    if (!applicantId) {
      return res.status(400).json({ message: 'Applicant ID is required' });
    }

    // Call the model function to get the applicant by ID
    const applicant = await getApplicantById(applicantId);

    if (applicant.length === 0) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    return res.status(200).json(applicant);
    
  } catch (error) {
    console.error('Error fetching applicant:', error);
    return res.status(500).json({ message: 'Error fetching applicant', error: error.message });
  }
};



const getApplicantsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default to 10 items per page if not provided

    // Extract filters from query string
    const { 
      country_id, 
      region_id, 
      gender_id, 
      experience_id, 
      category_id, 
      first_name, 
      last_name, 
      email,
      marital_id
    } = req.query;

    // Log the filters to verify that they are being passed correctly
    console.log('Received filters:', { country_id, region_id,marital_id, gender_id, experience_id, category_id, first_name, last_name, email });

    // Prepare filter conditions for the SQL query
    const filters = {};

    if (marital_id) filters.marital_id = marital_id;
    if (country_id) filters.country_id = country_id;
    if (region_id) filters.region_id = region_id;
    if (gender_id) filters.gender_id = gender_id;
    if (experience_id) filters.experience_id = experience_id;
    if (category_id) filters.category_id = category_id;

    // Only apply first_name filter if it's not empty
    if (first_name && first_name.trim() !== '') {
      filters.first_name = first_name.trim();
    }
    // Apply last_name filter if it's not empty
    if (last_name && last_name.trim() !== '') {
      filters.last_name = last_name.trim();
    }
    // Apply email filter if it's not empty
    if (email && email.trim() !== '') {
      filters.email = email.trim();
    }

    // Call the function to get applicants with the filters
    const applicants = await getApplicantsWithDetails(page, pageSize, filters);

    // Check if there is a next page
    const nextPage = applicants.length === pageSize ? page + 1 : null;

    // Return the response with the filtered data
    res.status(200).json({
      success: true,
      data: applicants,
      pagination: {
        page,
        pageSize,
        nextPage,
      },
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch applicants',
    });
  }
};


// Controller to update an applicant and their details
const updateApplicantController = async (req, res) => {
   
  try {
    const applicantId = req.body.applicantId; // Extract the applicant ID from the URL parameters
   
    const updatedDetails = req.body; // Get updated details from the request body

    if (!applicantId || !updatedDetails) {
      return res.status(400).json({ message: 'Applicant ID and updated details are required' });
    }

    //console.log(updatedDetails);
    const result = await updateApplicant(applicantId, updatedDetails);

    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error updating applicant:', error);
    return res.status(500).json({ message: 'Error updating applicant', error: error.message });
  }
};
//uploadLogo,getLogo
  const uploadLogo = async (req, res) => {
    try {
      // Check if the file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Get applicantId from request params
      const { applicantId } = req.params;
  
      // Generate the new file path for the uploaded logo
      const logoPath = `/uploads/logos/${req.file.filename}`;
  
      // Connect to the database
      const connection = await db.getConnection();
  
      // Check if the Applicant already has a logo
      const checkQuery = 'SELECT logo FROM applicants WHERE id = ?';
      const [existingLogo] = await connection.query(checkQuery, [applicantId]);
  
      if (existingLogo.length > 0 && existingLogo[0].logo) {
        // If a logo already exists, delete the old one
        const oldLogoPath = existingLogo[0].logo.replace('/uploads', 'uploads'); // Correct the path for the file system
        const absoluteOldLogoPath = path.join(__dirname, '..', '..', oldLogoPath); // Create an absolute file path
  
       // console.log('Trying to delete old logo at path:', absoluteOldLogoPath);
  
        // Check if the old logo exists and delete it
        if (fs.existsSync(absoluteOldLogoPath)) {
          fs.unlinkSync(absoluteOldLogoPath); // Delete the old logo file
          //console.log('Old logo deleted:', absoluteOldLogoPath);
        } else {
          //console.log('Old logo file does not exist:', absoluteOldLogoPath);
        }
      }
  
      // Update the database with the new logo
      const updateQuery = 'UPDATE applicants SET logo = ? WHERE id = ?';
      const [result] = await connection.query(updateQuery, [logoPath, applicantId]);
  
      if (result.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          message: 'Logo updated successfully',
          logoPath,
        });
      } else {
        return res.status(404).json({ message: 'Applicant not found' });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  

  // Get Applicant Logo by Applicant ID
 
  const getLogo = async (req, res) => {
    try {
      const applicantId = req.params.applicantId; // Get Applicant ID from the URL parameter
  
     // console.log('Applicant ID:', applicantId); // Log for debugging
  
      // Connect to the database
      const connection = await db.getConnection();
  
      // Query to get the Applicant's logo path
      const query = 'SELECT logo FROM applicants WHERE id = ?';
      const [rows] = await connection.query(query, [applicantId]);
  
      // If no rows are returned, it means the Applicant was not found
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Applicant not found' });
      }
  
      // Get the logo path from the result
      const logoPath = rows[0].logo;
  
      // If no logo path is found
      if (!logoPath) {
        return res.status(404).json({ message: 'Logo not found for the Applicant' });
      }
  
      // Respond with the relative path to the logo
      return res.json({ logo: logoPath });  // Just return the path stored in the database
  
    } catch (error) {
      console.error('Error fetching logo:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller to save the selected CV template for an applicant
const applicanSelectCv = async (req, res) => {

  

  try {
    const { applicantId } = req.params;
    const {templateId } = req.body; // Extract applicantId and templateId from the request body

    // Validate the input data
    if (!applicantId || !templateId) {
      return res.status(400).json({ message: "Applicant ID and Template ID are required." });
    }

    // Save the selected CV template
    const result = await saveSelectedCvTemplate(applicantId, templateId);

    // Respond with success
    return res.status(200).json({
      message: "CV template selected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error saving selected CV template:", error);
    return res.status(500).json({
      message: "An error occurred while saving the CV template.",
      error: error.message,
    });
  }
};


module.exports = {
  createApplicantController,
  getApplicantByIdController,
  getApplicantsController,
  updateApplicantController,
  uploadLogo,getLogo,
  applicanSelectCv,
  
};
