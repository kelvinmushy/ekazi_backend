// Import the required model functions
const { createApplicantApplication } = require('../../models/applicants/applicantApplication');

// Define the applicantApplication controller function
const applicantApplication = async (req, res) => {
  try {
    // Extract data from the request body
    const { job_id, applicant_id, cover_letter} = req.body;
    const stage_id=1;
    console.log("Check if exit",req.body);
    // Validate required fields
    if (!job_id || !applicant_id ||!cover_letter) {

      return res.status(400).json({ message: "job_id, applicant_id, and letter are required." });
    }

    // Create the applicant application
    const newApplication = await createApplicantApplication({
      job_id:job_id,
      applicant_id:job_id,
      letter:cover_letter,  
      
    });
    
    // Respond with the created application
    res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "An error occurred while submitting the application." });
  }
};

// Export the controller
module.exports = { applicantApplication };
