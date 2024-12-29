const { createApplicant, getApplicantById } = require('../../models/applicants/applicant'); // Importing model functions

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
    console.log(req.params);
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

// Controller to get all applicants (if needed)
const getApplicantsController = async (req, res) => {
  try {
    // Assuming you have a function that fetches all applicants with details (addresses and phone numbers)
    const applicants = await getApplicantsWithDetails();

    if (applicants.length === 0) {
      return res.status(404).json({ message: 'No applicants found' });
    }

    return res.status(200).json({ applicants });
    
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
};

module.exports = {
  createApplicantController,
  getApplicantByIdController,
  getApplicantsController
};
