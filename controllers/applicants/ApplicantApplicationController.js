// Import the required model functions
const { createApplicantApplication,deleteApplicantApplication,selectApplicationsByApplicantId
  ,editApplicantApplication,JobSavedModel,deleteSavedJobModel,getSavedJobsByApplicantId} = require('../../models/applicants/applicantApplication');






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
//applicant get all saved jobs here


const applicantGetSavedJob = async (req, res) => {
  const { applicant_id } = req.params; // Get applicant_id from request parameters

  try {
    // Fetch saved jobs for the given applicant ID
    const savedJobs = await getSavedJobsByApplicantId(applicant_id);
    
    // Check if any saved jobs were found
    if (savedJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No saved jobs found for this applicant.",
      });
    }
    
    // Return the saved jobs
    return res.status(200).json({
      success: true,
      data: savedJobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({
      success: false,
      message: error.message, // Return error message
    });
  }
};

// Function to save a job
const applicantSaveJob = async (req, res) => {
  const { job_id, applicant_id } = req.body; // Destructure job_id and applicant_id from the request body
  try {
    const savedJob = await JobSavedModel({ job_id, applicant_id }); // Call the model function to save the job
    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: savedJob, // Return the saved job data
    });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({
      success: false,
      message: error.message, // Return error message
    });
  }
};

// Function to delete a saved job
const applicantDeleteSavedJob = async (req, res) => {
  const { savedJobId } = req.params; // Get the saved job ID from the request parameters
    

  try {
    const result = await deleteSavedJobModel(savedJobId); // Call the model function to delete the job
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found", // If no rows are affected, the job was not found
      });
    }
    return res.status(200).json({
      success: true,
      message: "Saved job deleted successfully", // Return success message
    });
  } catch (error) {
    console.error("Error deleting saved job:", error);
    return res.status(500).json({
      success: false,
      message: error.message, // Return error message
    });
  }
};


// Export the controller
module.exports = { applicantApplication,selectApplicantById,
  updateApplication,deleteApplication,
  applicantSaveJob,applicantDeleteSavedJob,
  applicantGetSavedJob
};
