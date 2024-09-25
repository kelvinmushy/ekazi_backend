const { getJobs, createJob,linkJobSkills, linkJobTypes, linkJobCategories, linkJobCultures, updateJob, deleteJob } = require('../../../models/jobs/jobModel');
const db = require('../../../config/db');
const getAllJobs = async (req, res) => {
    try {
        const jobs = await getJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

const createNewJob = async (req, res) => {
    const connection = await db.getConnection();
    const { title, region_id, address, salary_from, salary_to, skill_ids, type_ids, category_ids, culture_ids, summary, description, expired_date, posting_date } = req.body;

    // Validate required fields
    if (!title || !region_id || !address || !salary_from || !salary_to || !summary || !description || !expired_date || !posting_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const jobId = await createJob({ title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date });
       
        if (type_ids && Array.isArray(type_ids)) await linkJobTypes(connection,jobId, type_ids);
        if (category_ids && Array.isArray(category_ids)) await linkJobCategories(connection,jobId, category_ids);
         if (culture_ids && Array.isArray(culture_ids)) await linkJobCultures(connection,jobId, culture_ids);
        if (skill_ids && Array.isArray(skill_ids)) await linkJobSkills(connection,jobId, skill_ids);

        res.status(201).json({type_ids, message: 'Job created successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to create job' });
    }
};

const updateOldJob = async (req, res) => {
    const { id, title, region_id, address, salary_from, salary_to, type_ids, category_ids, culture_ids, skill_ids, summary, description, expired_date, posting_date } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Update the job itself
        const affectedRows = await updateJob({ id, title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date });

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'No job found with the given ID' });
        }

        // Update links if provided
        if (type_ids) {
            const existingTypes = await connection.query('SELECT * FROM job_types WHERE job_id = ?', [id]);
            console.log('Existing types:', existingTypes);

            if (existingTypes.length > 0) {
                await connection.query('DELETE FROM job_types WHERE job_id = ?', [id]);
                console.log('Deleted job types for job_id:', id);
            }
            console.log('Inserting job types:', type_ids);
            try {
             await linkJobTypes(connection,id, type_ids);
            } catch (error) {
                console.error('Failed to link job types:', error);
                await connection.rollback();
                return res.status(500).json({ error: 'Failed to link job types' });
            }
        }

        if (category_ids) {
            const existingCategories = await connection.query('SELECT * FROM job_categories WHERE job_id = ?', [id]);
            console.log('Existing categories:', existingCategories);

            if (existingCategories.length > 0) {
                await connection.query('DELETE FROM job_categories WHERE job_id = ?', [id]);
                console.log('Deleted job categories for job_id:', id);
            }
            if (category_ids && Array.isArray(category_ids)) await linkJobCategories(connection,id, category_ids);
           
        }

        if (skill_ids) {
            const existingSkills = await connection.query('SELECT * FROM job_skills WHERE job_id = ?', [id]);
            console.log('Existing skills:', existingSkills);

            if (existingSkills.length > 0) {
                await connection.query('DELETE FROM job_skills WHERE job_id = ?', [id]);
                console.log('Deleted job skills for job_id:', id);
            }
           await linkJobSkills(connection,id, skill_ids);
        }

        if (culture_ids) {
            const existingCultures = await connection.query('SELECT * FROM job_cultures WHERE job_id = ?', [id]);
            console.log('Existing cultures:', existingCultures);

            if (existingCultures.length > 0) {
                await connection.query('DELETE FROM job_cultures WHERE job_id = ?', [id]);
                console.log('Deleted job cultures for job_id:', id);
            }
           await linkJobCultures(connection,id, culture_ids);
        }

        await connection.commit();
        res.status(200).json({ message: 'Job updated successfully', affectedRows });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating job:', error);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to update job' });
    } finally {
        connection.release();
    }
};


const deleteOldJob = async (req, res) => {
    const { id } = req.body;
    try {
        const affectedRows = await deleteJob(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'No job found with the given ID' });
        }
        res.status(200).json({ affectedRows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
};

module.exports = { getAllJobs, createNewJob, updateOldJob, deleteOldJob };
