const { createSavedResumeModel, deleteSavedResumeModel,getSavedResumesByCollectionId,updateSavedResumeModel,getCollectionByEmployerId } = require('../../models/applicants/savedResumes');

// Create a new saved resume
const createSavedResume = async (req, res) => {

    console.log(req.body);
    try {
        // Validate that req.body contains the necessary data
        const { applicant_id, employer_id, collection_id, position_id,category_id } = req.body;

        if (!applicant_id || !employer_id || !collection_id || !position_id||!category_id) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const result = await createSavedResumeModel({
            applicant_id,
            employer_id,
            collection_id,
            category_id,
            position_id,
           
        });

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: "Saved resume created successfully." });
        } else {
            throw new Error("Failed to create saved resume.");
        }
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

// Get all saved resumes for a specific applicant
const getSavedResumes = async (req, res) => {

    
    const { employerId } = req.params;
    const { collectionId } = req.params;
    

    try {
        const resumes = await getSavedResumesByCollectionId(employerId,collectionId);
        if (resumes.length > 0) {
            return res.status(200).json(resumes);
        } else {
            return res.status(404).json({ message: 'No saved resumes found for this applicant' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Get all saved resumes for a specific applicant
const getCollectionByIdController = async (req, res) => {
    const { employerId } = req.params;

    try {
        const resumes = await getCollectionByEmployerId(employerId);
        if (resumes.length > 0) {
            return res.status(200).json(resumes);
        } else {
            return res.status(404).json({ message: 'No saved resumes found for this applicant' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a specific saved resume
const updateSavedResume = async (req, res) => {

    const { id, applicant_id, collection_id, position_id, updator_id } = req.body;

    // Validate that all required fields are provided
    if (!id || !applicant_id || !collection_id || !position_id || !updator_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await updateSavedResumeModel({
            id,
            applicant_id,
            collection_id,
            position_id,
            updator_id,
        });

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Saved resume updated successfully' });
        } else {
            return res.status(404).json({ message: 'Saved resume not found' });
        }
    } catch (error) {
        console.error('Error updating saved resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a saved resume
const deleteSavedResume = async (req, res) => {
    const { id } = req.params;  // Get resume ID from route params

    try {
        const result = await deleteSavedResumeModel(id);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Saved resume deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Saved resume not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createSavedResume,
    getSavedResumes,
    updateSavedResume,
    deleteSavedResume,
    getCollectionByIdController
};
