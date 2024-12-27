const {
  createProfessionalQualification,
  getProfessionalQualificationsByApplicantId,
  updateProfessionalQualification,
  removeProfessionalQualification,
} = require('../../models/applicants/applicantProfessionals'); // Importing the necessary functions from model

// Get professional qualifications by Applicant ID
const getProfessionalQualificationsByApplicantIdController = async (req, res) => {
  try {
    const { applicantId } = req.params; // Extract applicantId from route params
    const qualifications = await getProfessionalQualificationsByApplicantId(applicantId); // Fetch qualifications

    if (!qualifications || qualifications.length === 0) {
      return res.status(404).json({ message: 'No professional qualifications found for this applicant' });
    }

    return res.status(200).json(qualifications);
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return res.status(500).json({ message: 'Error fetching professional qualifications' });
  }
};

// Create a new professional qualification for an applicant
const createProfessionalQualificationController = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { country_id, institution_id, course_id, started, ended, creator_id, updator_id } = req.body;

    // Validation
    if (!institution_id || !course_id || !started) {
      return res.status(400).json({ message: 'Institution, course, and start year are required' });
    }

    // Handle file upload
    const attachment = req.file ? req.file.path : null;  // multer stores the file in `req.file`

    const newQualification = {
      applicant_id: applicantId,
      institution_id,
      course_id,
      country_id: country_id || null,
      attachment: attachment,
      started,
      ended: ended || null,
      creator_id: creator_id || applicantId,
      updator_id: updator_id || null,
    };

    // Create the qualification in the database
    const result = await createProfessionalQualification(newQualification);

    return res.status(201).json({ message: 'Professional qualification created successfully', data: result });
  } catch (error) {
    console.error('Error creating qualification:', error);
    return res.status(500).json({ message: 'Could not create professional qualification' });
  }
};


// Edit an existing professional qualification
// Edit an existing professional qualification
const updateProfessionalQualificationController = async (req, res) => {
  try {
    const { qualificationId } = req.params; // Extract qualificationId from route params
    const { institution_id, course_id, started, ended, updator_id, country_id } = req.body; // Extract from request body

    // Handle file upload
    const attachment = req.file ? req.file.path : null;  // multer stores the file in `req.file`

    // Construct the updated qualification object
    const updatedQualification = {
      institution_id,
      course_id,
      started,
      ended: ended || null, // Optional
      country_id: country_id || null, // Optional
      attachment: attachment || null, // Optional, can be null
      updator_id,  // Always update the updator_id
    };

    console.log(updatedQualification);
    // Update the qualification in the database
    const result = await updateProfessionalQualification(qualificationId, updatedQualification);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    return res.status(200).json({ message: 'Professional qualification updated successfully' });
  } catch (error) {
    console.error('Error updating qualification:', error);
    return res.status(500).json({ message: 'Could not update professional qualification' });
  }
};


// Delete a professional qualification by ID
const removeProfessionalQualificationController = async (req, res) => {
  try {
    const { qualificationId } = req.params; // Extract qualificationId from route params

    // Delete the qualification
    const result = await removeProfessionalQualification(qualificationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    return res.status(200).json({ message: 'Professional qualification deleted successfully' });
  } catch (error) {
    console.error('Error deleting qualification:', error);
    return res.status(500).json({ message: 'Could not delete professional qualification' });
  }
};

// Export controller functions
module.exports = {
  createProfessionalQualificationController,
  getProfessionalQualificationsByApplicantIdController,
  updateProfessionalQualificationController,
  removeProfessionalQualificationController,
};
