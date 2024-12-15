const {
    getJobs,
    createJob,
    linkJobTypes,
    linkJobCategories,
    linkJobCultures,
    linkJobSkills,
    updateJob,
    deleteJob,
    getJobCount
} = require('../../models/jobs/jobModel');
const db = require('../../config/db');

// Fetch all jobs with pagination
const getAllJobs = async (req, res) => {
   
    const { page = 1, limit = 10 ,status} = req.query;
    try {
        const jobs = await getJobs(page, limit,status);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

// Create a new job
const createNewJob = async (req, res) => {
    const { 
        title, region_id, address, salary_from, salary_to, 
        skill_ids, type_ids, category_ids, culture_ids, 
        summary, description, expired_date, posting_date,
        experience_id, position_level_id,jobAutoRenew,applyOnline,url,emailAddress
    } = req.body;

    // Validate required fields
    if (!title || !region_id || !address || !salary_from || !salary_to || !summary || !description || !expired_date || !posting_date ||!experience_id||!position_level_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const jobId = await createJob({ 
            title, region_id, address, salary_from, salary_to, 
            summary, description, expired_date, posting_date,experience_id,position_level_id,jobAutoRenew,applyOnline,url,emailAddress
        });
       
        // Link other attributes
        if (type_ids && Array.isArray(type_ids)) await linkJobTypes(connection,jobId, type_ids);
        if (category_ids && Array.isArray(category_ids)) await linkJobCategories(connection,jobId, category_ids);
        if (culture_ids && Array.isArray(culture_ids)) await linkJobCultures(connection,jobId, culture_ids);
        if (skill_ids && Array.isArray(skill_ids)) await linkJobSkills(connection,jobId, skill_ids);
        await connection.commit();
        res.status(201).json({ jobId, message: 'Job created successfully',type_ids });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to create job' });
    }finally {
        connection.release();
    }
};

// Update an existing job
const updateOldJob = async (req, res) => {
    const { 
        id, title, region_id, address, salary_from, salary_to, 
        type_ids, category_ids, culture_ids, skill_ids, 
        summary, description, expired_date, posting_date,
        experience_id, position_level_id,jobAutoRenew,applyOnline,url,emailAddress
    } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Update the job itself
        const affectedRows = await updateJob({ 
            id, title, region_id, address, salary_from, salary_to, 
            summary, description, expired_date, posting_date ,experience_id,position_level_id,jobAutoRenew,applyOnline,url,emailAddress
        });

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'No job found with the given ID' });
        }

        // Update links if provided
        if (type_ids) {
            await linkJobTypes(connection, id, type_ids);
        }

        if (category_ids) {
            await linkJobCategories(connection, id, category_ids);
        }

        if (culture_ids) {
            await linkJobCultures(connection, id, culture_ids);
        }

        if (skill_ids) {
            await linkJobSkills(connection, id, skill_ids);
        }
        await connection.commit();
        res.status(200).json({ message: 'Job updated successfully', affectedRows });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job' });
    } finally {
        connection.release();
    }
};

// Delete a job
const deleteOldJob = async (req, res) => {
    const id = req.params.id;
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

const getJobCounts=async(req,res)=>{
    try {
        const jobCounts = await getJobCount();
        res.json(jobCounts); // Send the job counts back to the client
    } catch (error) {
        console.error("Error fetching job counts:", error);
        res.status(500).json({ message: 'Failed to fetch job counts' });
    } 
}

module.exports = { getAllJobs, createNewJob, updateOldJob, deleteOldJob,getJobCounts };
