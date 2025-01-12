const ApplicantSkills = require('../../models/applicants/applicantSkills');
const { createSkill } = require('../../models/resources/skillModel');


const createApplicantSkill = async (req, res) => {
    try {
        //console.log("Full request body:", req.body);

        // Validate that req.body is an array
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Payload must be an array of skills." });
        }

        // Process each skill in the array
        const results = await Promise.all(
            req.body.map(async (data) => {
                const { applicant_id, skill_id, creator_id } = data;

               // console.log("Processing skill:", skill_id);

                let actualSkillId;

                // Check if skill_id is numeric (indicating an existing skill) or a name
                if (isNaN(skill_id)) {
                    // Skill ID is a name, treat it as a new skill
                   // console.log("Creating new skill...");
                    const newSkill = { skill_name: skill_id, creator_id };
                    actualSkillId = await createSkill(newSkill); // Pass skill_name and creator_id
                    if (!actualSkillId) {
                        throw new Error(`Failed to create skill for data: ${JSON.stringify(data)}`);
                    }
                } else {
                    // Skill ID is numeric, use it as is
                    actualSkillId = skill_id;
                }

                // Associate the skill with the applicant
                const result = await ApplicantSkills.createSkill(applicant_id, actualSkillId);
                if (result.affectedRows > 0) {
                    return { success: true, message: `Skill ${actualSkillId} added successfully` };
                } else {
                    throw new Error(`Failed to associate skill ${actualSkillId} with applicant ${applicant_id}`);
                }
            })
        );

        // If all operations succeed, return a success response
        res.status(201).json({
            message: "All skills processed successfully",
            results,
        });
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};



// Get all skills for a specific applicant
const getSkillsByApplicantId = async (req, res) => {
    const { applicantId } = req.params;

    try {
        const skills = await ApplicantSkills.getSkillsByApplicantId(applicantId);
        if (skills.length > 0) {
            return res.status(200).json(skills);
        } else {
            return res.status(404).json({ message: 'No skills found for this applicant' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a specific skill for an applicant by skillId
const updateSkill = async (req, res) => {
    const { skill_id, id } = req.body; // Destructure skill_id and id directly from req.body

   // console.log(skill_id);
    // Validate that skill_id and id are provided
    if (!skill_id || !id) {
        return res.status(400).json({ message: 'skill_id and id are required' });
    }

    try {
        // Assuming ApplicantSkills.updateSkill takes the current skillId and new skill_id
        const result = await ApplicantSkills.updateSkill(skill_id,id);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Skill updated successfully' });
        } else {
            return res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Delete a skill for an applicant by skillId
const deleteSkill = async (req, res) => {
    const { skillId } = req.params;  // Get skillId from route params

    try {
        const result = await ApplicantSkills.deleteSkill(skillId);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Skill deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createApplicantSkill,
    getSkillsByApplicantId,
    updateSkill,
    deleteSkill,
};
