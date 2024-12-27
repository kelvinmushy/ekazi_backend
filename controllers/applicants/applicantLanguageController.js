const {
    createApplicantLanguage,
    deleteApplicantLanguage,
    selectLanguagesByApplicantId,
    editApplicantLanguage,
  } = require("../../models/applicants/applicantLanguages");
  
  // 1. Get Languages by Applicant ID
  const getLanguagesByApplicantId = async (req, res) => {
    try {
      const { applicantId } = req.params; // Extract applicantId from the route parameters
  
      // Fetch languages for the given applicantId from the database
      const languages = await selectLanguagesByApplicantId(applicantId);
  
      if (languages.length === 0) {
        return res.status(404).json({ message: "No languages found for this applicant" });
      }
  
      return res.json(languages); // Return languages data as a JSON response
    } catch (error) {
      console.error("Error fetching applicant languages:", error);
      return res.status(500).json({ message: "Could not fetch applicant languages" });
    }
  };
  
  // 2. Create a New Language Entry for the Applicant
  const createLanguageByApplicantId = async (req, res) => {
    console.log(req.body);
    try {
      const { applicantId } = req.params; // Extract applicantId from the route parameters
      const { read_id, write_id, speak_id, language_id } = req.body; // Extract language details from request body
  
      // Validate input data (ensure all fields are provided)
      if (!read_id || !write_id || !speak_id || !language_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Construct the new language object to be inserted
      const newLanguage = {
        applicant_id: applicantId,
        read_id,
        write_id,
        speak_id,
        language_id,
      };
  
      // Call the model function to insert the new language entry
      const result = await createApplicantLanguage(newLanguage);
  
      // Return a success response
      return res.status(201).json({ message: "Language added successfully", data: result });
    } catch (error) {
      console.error("Error inserting applicant language:", error);
      return res.status(500).json({ message: "Could not insert applicant language" });
    }
  };
  
  // 3. Edit Language Entry by ID
  const editLanguageById = async (req, res) => {
    try {
      const { languageId } = req.params; // Extract languageId from the route parameters
      const { read_id, write_id, speak_id, language_id } = req.body; // Extract updated data from request body
  
      // Validate input data (ensure all fields are provided)
      if (!read_id || !write_id || !speak_id || !language_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Call the model function to update the language entry
      const updatedLanguage = await editApplicantLanguage(languageId, {
        read_id,
        write_id,
        speak_id,
        language_id,
      });
  
      // Check if the update was successful (affected rows > 0)
      if (updatedLanguage.affectedRows === 0) {
        return res.status(404).json({ message: "Language not found" });
      }
  
      // Return success response with the updated language data
      return res.status(200).json({ message: "Language updated successfully", data: updatedLanguage });
    } catch (error) {
      console.error("Error updating applicant language:", error);
      return res.status(500).json({ message: "Could not update applicant language" });
    }
  };
  
  // 4. Delete Language Entry by ID
  const deleteLanguageById = async (req, res) => {
    try {
      const { languageId } = req.params; // Extract languageId from the route parameters
  
      // Call the model function to delete the language entry
      const result = await deleteApplicantLanguage(languageId);
  
      // Check if any rows were affected (deleted)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Language not found or already deleted" });
      }
  
      // Return success response
      return res.status(200).json({ message: "Language deleted successfully" });
    } catch (error) {
      console.error("Error deleting applicant language:", error);
      return res.status(500).json({ message: "Could not delete applicant language" });
    }
  };
  
  module.exports = {
    getLanguagesByApplicantId,
    createLanguageByApplicantId,
    editLanguageById,
    deleteLanguageById,
  };
  