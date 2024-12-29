const {
    createEducationalQualification,
    getEducationalQualificationsByApplicantId,
    updateEducationalQualification,
    removeEducationalQualification,
    getEducationalQualificationById
  } = require('../../models/applicants/applicantEducations'); // Importing the necessary functions from model
  
  const { createInstitution } = require('../../models/resources/institutionModel');
  const { createdProgrammes } = require('../../models/resources/programmeModel');
  const fs = require('fs');
  const path = require('path');
  
  // Get educational qualifications by Applicant ID
  const getEducationalQualificationsByApplicantIdController = async (req, res) => {
    try {
      const { applicantId } = req.params; // Extract applicantId from route params
      const qualifications = await getEducationalQualificationsByApplicantId(applicantId); // Fetch qualifications
  
      if (!qualifications || qualifications.length === 0) {
        return res.status(404).json({ message: 'No educational qualifications found for this applicant' });
      }
  
      return res.status(200).json(qualifications);
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      return res.status(500).json({ message: 'Error fetching educational qualifications' });
    }
  };
  
  // Create a new educational qualification for an applicant
  const createEducationalQualificationController = async (req, res) => {
    try {
      // Extract applicantId from request parameters
      const { applicantId } = req.params;
      console.log(req.body);
      // Extract qualification details from request body
      const {
        country_id,
        institution_id,
        programme_id,
        education_level_id,
        category_id,
        date_to,
        date_from,
        creator_id,
        updator_id,
      } = req.body;
  
      let finalInstitutionId, finalProgrammeId;
  
      // Handle institution
      if (isNaN(institution_id)) {
        console.log(`Creating institution: ${institution_id}`);
        const newInstitution = { name: institution_id, creator_id: applicantId }; // Update to use creator_id
        const createdInstitution = await createInstitution(newInstitution);
       
        finalInstitutionId = createdInstitution; // Assign new institution ID
      } else {
        finalInstitutionId = institution_id; // Use existing institution ID
      }
  
      // Handle programme
      if (isNaN(programme_id)) {
        console.log(`Creating programme: ${programme_id}`);
        const newProgramme = { name: programme_id, creator_id: applicantId }; // Update to use creator_id
        const createdProgramme = await createdProgrammes(newProgramme); // Change this to your actual model for creating programmes
        finalProgrammeId = createdProgramme; // Assign new programme ID
      } else {
        finalProgrammeId = programme_id; // Use existing programme ID
      }
  
      // Handle file upload
      const attachment = req.file ? req.file.path : null; // multer stores the file in req.file
  
      // Prepare qualification data
      const newQualification = {
        applicant_id: applicantId,
        institution_id: finalInstitutionId, // Use the resolved institution ID
        programme_id: finalProgrammeId, // Use the resolved programme ID
        education_level_id,
        category_id,
        country_id: country_id || null,
        attachment: attachment,
        date_from,
        date_to: date_to || null,
        creator_id: creator_id || applicantId,
        updator_id: updator_id || null,
      };
  
      console.log("Saving qualification:", newQualification);
  
      // Save qualification to the database
      const result = await createEducationalQualification(newQualification);
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
  
  // Edit an existing educational qualification
  const updateEducationalQualificationController = async (req, res) => {
    try {
      const { qualificationId } = req.params; // Extract qualificationId from route params
      const { institution_id, programme_id, education_level_id, category_id, date_from, date_to, updator_id, country_id } = req.body; // Extract from request body
  
      // Get the existing qualification details
      const existingQualification = await getEducationalQualificationById(qualificationId);
      if (!existingQualification) {
        return res.status(404).json({ message: 'Educational qualification not found' });
      }
  
      // Handle file upload
      const attachment = req.file ? req.file.path : null; // multer stores the file in req.file
  
      let finalInstitutionId, finalProgrammeId;
  
      // Handle institution
      if (isNaN(institution_id)) {
        console.log(`Creating institution: ${institution_id}`);
        const newInstitution = { name: institution_id, creator_id: updator_id }; // Update to use creator_id
        finalInstitutionId = await createInstitution(newInstitution); // Assign new institution ID
      } else {
        finalInstitutionId = institution_id; // Use existing institution ID
      }
  
      // Handle programme
      if (isNaN(programme_id)) {
        console.log(`Creating programme: ${programme_id}`);
        const newProgramme = { name: programme_id, creator_id: updator_id }; // Update to use creator_id
        finalProgrammeId = await createdProgrammes(newProgramme); // Assign new programme ID
      } else {
        finalProgrammeId = programme_id; // Use existing programme ID
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
        programme_id: finalProgrammeId, // Use the resolved programme ID
        education_level_id,
        category_id,
        country_id: country_id || null, // Optional
        attachment: attachment || null, // Optional, can be null
        date_from,
        date_to: date_to || null, // Optional
        updator_id, // Always update the updator_id
      };
  
      console.log("Updating qualification:", updatedQualification);
      
      // Update the qualification in the database
      const result = await updateEducationalQualification(qualificationId, updatedQualification);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Educational qualification not found' });
      }
  
      return res.status(200).json({ message: 'Educational qualification updated successfully' });
    } catch (error) {
      console.error('Error updating qualification:', error.message || error);
      return res.status(500).json({ message: 'Could not update educational qualification', error: error.message || error });
    }
  };
  
  // Remove an educational qualification
  const removeEducationalQualificationController = async (req, res) => {
    try {
      const { qualificationId } = req.params; // Extract qualificationId from route params
  
      // Get the existing qualification to retrieve the attachment path
      const existingQualification = await getEducationalQualificationById(qualificationId);
      
      // Check if the qualification exists
      if (!existingQualification) {
        return res.status(404).json({ message: 'Educational qualification not found' });
      }
  
      const oldAttachmentPath = existingQualification.attachment;
  
      // Call the function to remove the qualification from the database
      const result = await removeEducationalQualification(qualificationId);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Educational qualification not found' });
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
  
      return res.status(200).json({ message: 'Educational qualification deleted successfully' });
    } catch (error) {
      console.error('Error deleting qualification:', error.message || error);
      return res.status(500).json({ message: 'Could not delete educational qualification', error: error.message || error });
    }
  };
  
  // Export controller functions
  module.exports = {
    createEducationalQualificationController,
    getEducationalQualificationsByApplicantIdController,
    updateEducationalQualificationController,
    removeEducationalQualificationController,
  };
  