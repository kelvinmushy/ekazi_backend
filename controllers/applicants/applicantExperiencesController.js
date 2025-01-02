const {
    createApplicantExperience,
    deleteExperience,
    selectExperiencesByApplicantId,
    editExperience,
  } = require('../../models/applicants/applicantExperiences');
const {createInstitution} =require('../../models/resources/institutionModel');
const {createPosition} =require('../../models/resources/positionModel');
  // 1. Get Experiences by Applicant ID
  const getExperiencesByApplicantId = async (req, res) => {
    try {
      const { applicantId } = req.params; // Extract applicantId from the route parameters
  
      // Fetch experiences for the given applicantId from the database
      const experiences = await selectExperiencesByApplicantId(applicantId);
  
      if (experiences.length === 0) {
        return res.status(404).json({ message: 'No experiences found for this applicant' });
      }
  
      return res.json(experiences); // Return experiences data as a JSON response
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return res.status(500).json({ message: 'Could not fetch experiences' });
    }
  };
  
  // 2. Create a New Experience for the Given Applicant
//   const createExperienceByApplicantId = async (req, res) => {
//     try {
        
//       const { applicantId } = req.params; // Extract applicantId from the route parameters
//       const { institution_id, position_id, from, to, isCurrentlyWorking,responsibilities } = req.body; // Extract experience details from request body
  
//       // Validate input data
//       if (!institution_id || !position_id || !from) {
//         return res.status(400).json({ message: 'Institution, position, and start date (from) are required' });
//       }
  
//       // Construct the new experience object to be inserted
//       const newExperience = {
//         applicant_id: applicantId,
//         institution_id,
//         position_id,
//         responsibilities,
//         from,
//         to: isCurrentlyWorking ? 'Present' : to || null,
//         is_currently_working: isCurrentlyWorking || false,
//       };
  
//       // Call the model function to insert the new experience into the database
//       const result = await createApplicantExperience(newExperience);
  
//       // Return a success response
//       return res.status(201).json({ message: 'Experience added successfully', data: result });
//     } catch (error) {
//       console.error('Error inserting experience:', error);
//       return res.status(500).json({ message: 'Could not insert experience' });
//     }
//   };
  

// 2. Create a New Experience for the Given Applicant
const createExperienceByApplicantId = async (req, res) => {
    try {
      const { applicantId } = req.params; // Extract applicantId from the route parameters
      const { institution_id, position_id, from, to, isCurrentlyWorking, responsibilities } = req.body; // Extract experience details from request body
  
      // Validate input data
      if (!institution_id || !position_id || !from) {
        return res.status(400).json({ message: 'Institution, position, and start date (from) are required' });
      }
  
      let institutionId;
      let positionId;
  
      // Check if institution_id is a string (indicating it's a name)
      if (typeof institution_id === 'string') {
        institutionId = await createInstitution({ name: institution_id, creator_id: applicantId });
      } else {
        institutionId = institution_id; // Use the provided institution_id
      }
  
      // Check if position_id is a string (indicating it's a name)
      if (typeof position_id === 'string') {
        positionId = await createPosition({ name: position_id, creator_id: applicantId });
      } else {
        positionId = position_id; // Use the provided position_id
      }
  
      // Construct the new experience object to be inserted
      const newExperience = {
        applicant_id: applicantId,
        institution_id: institutionId,
        position_id: positionId,
        responsibilities,
        from,
        to: isCurrentlyWorking ? 'Present' : to || null,
        is_currently_working: isCurrentlyWorking || false,
      };
  
      // Call the model function to insert the new experience into the database
      const result = await createApplicantExperience(newExperience);
  
      // Return a success response
      return res.status(201).json({ message: 'Experience added successfully', data: result });
    } catch (error) {
      console.error('Error inserting experience:', error);
      return res.status(500).json({ message: 'Could not insert experience' });
    }
  };
  
  // 3. Edit Experience by Experience ID
//   const editExperienceById = async (req, res) => {
//     try {
//       const { experienceId } = req.params; // Extract experienceId from the route parameters
//       const { institution_id, position_id, responsibilities,from, to, isCurrentlyWorking } = req.body; // Extract updated data from request body
  
//       // Validate input data
//       if (!institution_id || !position_id || !from) {
//         return res.status(400).json({ message: 'Institution, position, and start date (from) are required' });
//       }
  
//       // Construct the updated experience object
//       const updatedExperience = {
//         institution_id,
//         position_id,
//         responsibilities,
//         from,
//         to: isCurrentlyWorking ? 'Present' : to || null,
//         is_currently_working: isCurrentlyWorking || false,
//       };
  
//       // Call the model function to update the experience details
//       const result = await editExperience(experienceId, updatedExperience);
  
//       // Check if the update was successful (affected rows > 0)
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'Experience not found' });
//       }
  
//       // Return success response
//       return res.status(200).json({ message: 'Experience updated successfully', data: result });
//     } catch (error) {
//       console.error('Error updating experience:', error);
//       return res.status(500).json({ message: 'Could not update experience' });
//     }
//   };
const editExperienceById = async (req, res) => {
    //console.log(req.body);
    try {
      const { experienceId } = req.params; // Extract experienceId from the route parameters
      const { institution_id, position_id, responsibilities, from, to, isCurrentlyWorking,applicantId } = req.body; // Extract updated data from request body
  
      // Validate input data
      if (!institution_id || !position_id || !from) {
        return res.status(400).json({ message: 'Institution, position, and start date (from) are required' });
      }
  
      let institutionId;
      let positionId;
  
      // Check if institution_id is a string (indicating it's a name)
      if (typeof institution_id === 'string') {
        institutionId = await createInstitution({ name: institution_id, creator_id:applicantId}); // Replace `req.userId` with appropriate user identifier if available
      } else {
        institutionId = institution_id; // Use the provided institution_id
      }
  
      // Check if position_id is a string (indicating it's a name)
      if (typeof position_id === 'string') {
        positionId = await createPosition({ name: position_id, creator_id:applicantId }); // Replace `req.userId` with appropriate user identifier if available
      } else {
        positionId = position_id; // Use the provided position_id
      }
  
      // Construct the updated experience object
      const updatedExperience = {
        institution_id: institutionId,
        position_id: positionId,
        responsibilities,
        from,
        to: isCurrentlyWorking ? 'Present' : to || null,
        is_currently_working: isCurrentlyWorking || false,
      };
  
      // Call the model function to update the experience details
      const result = await editExperience(experienceId, updatedExperience);
  
      // Check if the update was successful (affected rows > 0)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Experience not found' });
      }
  
      // Return success response
      return res.status(200).json({ message: 'Experience updated successfully', data: result });
    } catch (error) {
      console.error('Error updating experience:', error);
      return res.status(500).json({ message: 'Could not update experience' });
    }
  };
  
  
  // 4. Delete Experience by Experience ID
  const deleteExperienceById = async (req, res) => {
    try {
      const { experienceId } = req.params; // Extract experienceId from the route parameters
  
      // Call the model function to delete the experience from the database
      const result = await deleteExperience(experienceId);
  
      // Check if any rows were affected (deleted)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Experience not found or already deleted' });
      }
  
      // Return success response
      return res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
      console.error('Error deleting experience:', error);
      return res.status(500).json({ message: 'Could not delete experience' });
    }
  };
  
  module.exports = {
    getExperiencesByApplicantId,
    createExperienceByApplicantId,
    editExperienceById,
    deleteExperienceById,
  };
  