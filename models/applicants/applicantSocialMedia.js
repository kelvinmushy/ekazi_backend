const db = require('../../config/db');

// Create a new social media link for an applicant
const createSocialMediaLink = async (applicant_id, social_media_id, url) => {
    const query = `
        INSERT INTO applicant_social_medias (applicant_id, social_media_id, url)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [applicant_id, social_media_id, url]);
    return result;
};

// Get all social media links for a specific applicant
const getSocialMediaByApplicantId = async (applicant_id) => {
    const query = `
        SELECT 
            applicant_social_medias.id,
            applicant_social_medias.social_media_id,
            social_medias.name AS social_media_name,
            applicant_social_medias.url
        FROM 
            applicant_social_medias
        INNER JOIN 
            social_medias
        ON 
            applicant_social_medias.social_media_id = social_medias.id
        WHERE 
            applicant_social_medias.applicant_id = ?
    `;
    const [rows] = await db.execute(query, [applicant_id]);
    return rows;
};

// Update a social media link for an applicant
const updateSocialMediaLink = async (id, social_media_id, url) => {
    const query = `
        UPDATE applicant_social_medias
        SET social_media_id = ?, url = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [social_media_id, url, id]);
    return result;
};

// Delete a social media link for an applicant by id
const deleteSocialMediaLink = async (id) => {
    const query = `
        DELETE FROM applicant_social_medias
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [id]);
    return result;
};

module.exports = {
    createSocialMediaLink,
    getSocialMediaByApplicantId,
    updateSocialMediaLink,
    deleteSocialMediaLink,
};
