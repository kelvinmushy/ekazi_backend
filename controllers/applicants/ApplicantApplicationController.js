// Import the required model functions
const { createApplicantApplication,deleteApplicantApplication,selectApplicationsByApplicantId,editApplicantApplication } = require('../../models/applicants/applicantApplication');






const selectApplicantById = async (req, res) => {
  try {
    // Extract applicant_id from request parameters
    const { applicant_id } = req.params;

    // Validate applicant_id
    if (!applicant_id) {
      return res.status(400).json({ message: "Applicant ID is required." });
    }

    // Fetch applications by applicant ID
    const applications = await selectApplicationsByApplicantId(applicant_id);

    // Check if applications exist
    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this applicant." });
    }

    // Respond with the applications
    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applicant applications:", error);
    res.status(500).json({ message: "An error occurred while retrieving applications." });
  }
};


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
      applicant_id:applicant_id,
      letter:cover_letter,  
      
    });
    
    // Respond with the created application
    res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "An error occurred while submitting the application." });
  }
};

const updateApplication = async (req, res) => {

  try {
    const { applicationId } = req.params; // Get application ID from request parameters
    const { letter } = req.body; // Extract updated cover letter from request body

    if (!letter) {
      return res.status(400).json({ message: "Cover letter is required" });
    }

    const updatedApplication = await editApplicantApplication(applicationId, { letter });

    if (updatedApplication.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found or no changes made" });
    }

    res.status(200).json({ message: "Application updated successfully" });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete an Applicant's Application
const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params; // Get application ID from request parameters

    const deletedApplication = await deleteApplicantApplication(applicationId);

    if (deletedApplication.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Export the controller
module.exports = { applicantApplication,selectApplicantById,updateApplication,deleteApplication };
