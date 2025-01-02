const ApplicantSocialMedia = require('../../models/applicants/applicantSocialMedia');
//const { createSocialMediaLink } = require('../../models/resources/socialMediaModel');


// Create a new social media link for an applicant
const createApplicantSocialMedia = async (req, res) => {
    console.log(req.body);
    try {
        const { applicant_id, social_media_id, url, creator_id } = req.body;

        // Validate that required fields are provided
        // if (!applicant_id || !social_media_id || !url || !creator_id) {
        //     return res.status(400).json({ message: "Applicant ID, social media ID, URL, and creator ID are required." });
        // }

        let actualSocialMediaId;

        // Check if social_media_id is numeric (indicating an existing social media type) or a name
        if (isNaN(social_media_id)) {
            // social_media_id is a name, treat it as a new social media link
            //const newSocialMedia = { name: social_media_id, creator_id };
            // Uncomment and implement the following line if you have a function to create a new social media type
            // actualSocialMediaId = await createSocialMediaLink(newSocialMedia); // Pass name and creator_id
            // if (!actualSocialMediaId) {
            //     throw new Error(`Failed to create social media link for data: ${JSON.stringify(req.body)}`);
            // }
        } else {
            // social_media_id is numeric, use it as is
            actualSocialMediaId = social_media_id;
        }

        // Associate the social media link with the applicant
        const result = await ApplicantSocialMedia.createSocialMediaLink(applicant_id, actualSocialMediaId, url);
        if (result.affectedRows > 0) {
            return res.status(201).json({ message: `Social media ${actualSocialMediaId} added successfully` });
        } else {
            return res.status(400).json({ message: `Failed to associate social media ${actualSocialMediaId} with applicant ${applicant_id}` });
        }
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};




// Get all social media links for a specific applicant
const getSocialMediaByApplicantId = async (req, res) => {
    const { applicantId } = req.params;

    try {
        const socialMediaLinks = await ApplicantSocialMedia.getSocialMediaByApplicantId(applicantId);
        if (socialMediaLinks.length > 0) {
            return res.status(200).json(socialMediaLinks);
        } else {
            return res.status(404).json({ message: 'No social media links found for this applicant' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a specific social media link for an applicant by id
const updateSocialMediaLink = async (req, res) => {
    const { id, social_media_id, url } = req.body; // Destructure social_media_id and id directly from req.body

    // Validate that social_media_id and id are provided
    if (!social_media_id || !id) {
        return res.status(400).json({ message: 'social_media_id and id are required' });
    }

    try {
        // Assuming ApplicantSocialMedia.updateSocialMediaLink takes the current social media ID and new social media ID
        const result = await ApplicantSocialMedia.updateSocialMediaLink(id, social_media_id, url);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Social media link updated successfully' });
        } else {
            return res.status(404).json({ message: 'Social media link not found' });
        }
    } catch (error) {
        console.error('Error updating social media link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a social media link for an applicant by id
const deleteSocialMediaLink = async (req, res) => {
    const { socialMediaId } = req.params;  // Get socialMediaId from route params

    try {
        const result = await ApplicantSocialMedia.deleteSocialMediaLink(socialMediaId);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Social media link deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Social media link not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createApplicantSocialMedia,
    getSocialMediaByApplicantId,
    updateSocialMediaLink,
    deleteSocialMediaLink,
};
