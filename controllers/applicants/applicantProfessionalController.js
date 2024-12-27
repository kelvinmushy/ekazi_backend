const {
  createProfessionalQualification,
  getProfessionalQualificationsByApplicantId,
  updateProfessionalQualification,
  removeProfessionalQualification,
  getProfessionalQualificationById
} = require('../../models/applicants/applicantProfessionals'); // Importing the necessary functions from model

const { createInstitution } = require('../../models/resources/institutionModel');
const { createCourse } = require('../../models/resources/courseModel');

const fs = require('fs');
const path = require('path');
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
// const createProfessionalQualificationController = async (req, res) => {
//   try {
//     const { applicantId } = req.params;
//     const { country_id, institution_id, course_id, started, ended, creator_id, updator_id } = req.body;

//     // Validation
//     if (!institution_id || !course_id || !started) {
//       return res.status(400).json({ message: 'Institution, course, and start year are required' });
//     }

//     console.log(req.body)
//     // Handle file upload
//     const attachment = req.file ? req.file.path : null;  // multer stores the file in `req.file`

//     const newQualification = {
//       applicant_id: applicantId,
//       institution_id,
//       course_id,
//       country_id: country_id || null,
//       attachment: attachment,
//       started,
//       ended: ended || null,
//       creator_id: creator_id || applicantId,
//       updator_id: updator_id || null,
//     };

//     // Create the qualification in the database
//     const result = await createProfessionalQualification(newQualification);

//     return res.status(201).json({ message: 'Professional qualification created successfully', data: result });
//   } catch (error) {
//     console.error('Error creating qualification:', error);
//     return res.status(500).json({ message: 'Could not create professional qualification' });
//   }
// };



const createProfessionalQualificationController = async (req, res) => {
  try {
    // Extract applicantId from request parameters
    const { applicantId } = req.params;

    // Extract qualification details from request body
    const {
      country_id,
      institution_id,
      course_id,
      started,
      ended,
      creator_id,
      updator_id,
    } = req.body;

    let finalInstitutionId, finalCourseId;

    // Handle institution
    if (isNaN(institution_id)) {
      console.log(`Creating institution: ${institution_id}`);
      const newInstitution = { name: institution_id, creator_id: applicantId }; // Update to use creator_id
      const createdInstitution = await createInstitution(newInstitution);
     
      finalInstitutionId = createdInstitution; // Assign new institution ID
    } else {
      finalInstitutionId = institution_id; // Use existing institution ID
    }

    // Handle course
    if (isNaN(course_id)) {
      console.log(`Creating course: ${course_id}`);
      const newCourse = { name: course_id, creator_id: applicantId }; // Update to use creator_id
      const createdCourse = await createCourse(newCourse);
      finalCourseId = createdCourse; // Assign new course ID
    } else {
      finalCourseId = course_id; // Use existing course ID
    }

    // Handle file upload
    const attachment = req.file ? req.file.path : null; // multer stores the file in req.file

    // Prepare qualification data
    const newQualification = {
      applicant_id: applicantId,
      institution_id: finalInstitutionId, // Use the resolved institution ID
      course_id: finalCourseId, // Use the resolved course ID
      country_id: country_id || null,
      attachment: attachment,
      started,
      ended: ended || null,
      creator_id: creator_id || applicantId,
      updator_id: updator_id || null,
    };

    console.log("Saving qualification:", newQualification);

    // Save qualification to the database
    const result = await createProfessionalQualification(newQualification);
    if (!result || result.affectedRows === 0) {
      throw new Error(`Failed to save qualification for applicant ${applicantId}`);
    }

    // Respond with success message
    res.status(201).json({ message: "Qualification created successfully", data: result });
  } catch (error) {
    console.error("Error processing qualifications:", error.message || error);
    res.status(500).json({ message: "Internal server error", error: error.message || error });
  }
};






// Edit an existing professional qualification
// Edit an existing professional qualification
const updateProfessionalQualificationController = async (req, res) => {
  try {
    const { qualificationId } = req.params; // Extract qualificationId from route params
    const { institution_id, course_id, started, ended, updator_id, country_id } = req.body; // Extract from request body

    // Get the existing qualification details
    const existingQualification = await getProfessionalQualificationById(qualificationId);
    if (!existingQualification) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    // Handle file upload
    const attachment = req.file ? req.file.path : null; // multer stores the file in req.file

    let finalInstitutionId, finalCourseId;

    // Handle institution
    if (isNaN(institution_id)) {
      console.log(`Creating institution: ${institution_id}`);
      const newInstitution = { name: institution_id, creator_id: updator_id }; // Update to use creator_id
      finalInstitutionId = await createInstitution(newInstitution); // Assign new institution ID
    } else {
      finalInstitutionId = institution_id; // Use existing institution ID
    }

    // Handle course
    if (isNaN(course_id)) {
      console.log(`Creating course: ${course_id}`);
      const newCourse = { name: course_id, creator_id: updator_id }; // Update to use creator_id
      finalCourseId = await createCourse(newCourse); // Assign new course ID
    } else {
      finalCourseId = course_id; // Use existing course ID
    }

    // If a new attachment is uploaded, delete the old one
    if (attachment) {
      const oldAttachmentPath = existingQualification.attachment;
      if (oldAttachmentPath) {
        // Remove the old file
        fs.unlink(path.resolve(oldAttachmentPath), (err) => {
          if (err) {
            console.error('Error deleting old file:', err);
          } else {
            console.log('Old file deleted successfully');
          }
        });
      }
    } else {
      // If no new attachment is uploaded, keep the old one
      attachment = existingQualification.attachment;
    }

    // Construct the updated qualification object
    const updatedQualification = {
      institution_id: finalInstitutionId, // Use the resolved institution ID
      course_id: finalCourseId, // Use the resolved course ID
      started,
      ended: ended || null, // Optional
      country_id: country_id || null, // Optional
      attachment: attachment || null, // Optional, can be null
      updator_id, // Always update the updator_id
    };

    console.log("Updating qualification:", updatedQualification);
    
    // Update the qualification in the database
    const result = await updateProfessionalQualification(qualificationId, updatedQualification);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    return res.status(200).json({ message: 'Professional qualification updated successfully' });
  } catch (error) {
    console.error('Error updating qualification:', error.message || error);
    return res.status(500).json({ message: 'Could not update professional qualification', error: error.message || error });
  }
};



const removeProfessionalQualificationController = async (req, res) => {
  try {
    const { qualificationId } = req.params; // Extract qualificationId from route params

    // Get the existing qualification to retrieve the attachment path
    const existingQualification = await getProfessionalQualificationById(qualificationId);
    
    // Check if the qualification exists
    if (!existingQualification) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    const oldAttachmentPath = existingQualification.attachment;

    // Call the function to remove the qualification from the database
    const result = await removeProfessionalQualification(qualificationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professional qualification not found' });
    }

    // If there is an old attachment, remove the old file
    if (oldAttachmentPath) {
      fs.unlink(path.resolve(oldAttachmentPath), (err) => {
        if (err) {
          console.error('Error deleting old file:', err);
        } else {
          console.log('Old file deleted successfully');
        }
      });
    }

    return res.status(200).json({ message: 'Professional qualification deleted successfully' });
  } catch (error) {
    console.error('Error deleting qualification:', error.message || error);
    return res.status(500).json({ message: 'Could not delete professional qualification', error: error.message || error });
  }
};




// Export controller functions
module.exports = {
  createProfessionalQualificationController,
  getProfessionalQualificationsByApplicantIdController,
  updateProfessionalQualificationController,
  removeProfessionalQualificationController,
};
