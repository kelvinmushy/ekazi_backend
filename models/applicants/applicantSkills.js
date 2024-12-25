const db = require('../../config/db');


// Create a new skill for an applicant
const createSkill = async (applicant_id, skill_id) => {
    const query = `
        INSERT INTO applicant_skills (applicant_id, skill_id)
        VALUES (?, ?)
    `;
    const [result] = await db.execute(query, [applicant_id, skill_id]);
    return result;
};

// Get all skills for a specific applicant
const getSkillsByApplicantId = async (applicant_id) => {
    const query = `
        SELECT 
            applicant_skills.id,
            applicant_skills.skill_id,
            skills.skill_name AS skill_name
        FROM 
            applicant_skills
        INNER JOIN 
            skills
        ON 
            applicant_skills.skill_id = skills.id
        WHERE 
            applicant_skills.applicant_id = ?
    `;
    const [rows] = await db.execute(query, [applicant_id]);
    return rows;
};

const updateSkill = async (id, skill_id) => {
    const query = `
        UPDATE applicant_skills
        SET skill_id = ?
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [id,skill_id]); // Pass both `skill_id` and `id` in the correct order
    return result;
};


// Delete a skill for an applicant by skillId
const deleteSkill = async (id) => {
    const query = `
        DELETE FROM applicant_skills
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [id]);
    return result;
};

module.exports = {
    createSkill,
    getSkillsByApplicantId,
    updateSkill,
    deleteSkill,
};
