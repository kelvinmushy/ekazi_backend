const db = require('../../config/db');

const getJobs = async () => {
    try {
        const [results] = await db.query('SELECT * FROM jobs');
        return results;
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        throw new Error('Failed to fetch jobs');
    }
};

const createJob = async (jobData) => {
    const { title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date } = jobData;
    
    try {
        const [result] = await db.query(
            `INSERT INTO jobs (title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error creating job:', error.message);
        throw new Error('Failed to create job');
    }
};

const linkJobTypes = async (connection, jobId, typeIds) => {
    if (!Array.isArray(typeIds) || typeIds.length === 0) {
        console.log('No type IDs provided for job ID:', jobId);
        return;
    }

    try {
        const queries = typeIds.map(typeId => {
            return connection.query('INSERT INTO job_types (job_id, type_id) VALUES (?, ?)', [jobId, typeId]);
        });
        await Promise.all(queries);
        console.log('Inserted job types for job ID:', jobId);
    } catch (error) {
        console.error('Error linking job types for job ID:', jobId, error.message);
        throw new Error('Failed to link job types');
    }
};

const linkJobCategories = async (connection, jobId, categoryIds) => {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        console.log('No category IDs provided for job ID:', jobId);
        return;
    }

    try {
        const queries = categoryIds.map(categoryId => {
            return connection.query('INSERT INTO job_categories (job_id, category_id) VALUES (?, ?)', [jobId, categoryId]);
        });
        await Promise.all(queries);
        console.log('Inserted job categories for job ID:', jobId);
    } catch (error) {
        console.error('Error linking job categories for job ID:', jobId, error.message);
        throw new Error('Failed to link job categories');
    }
};

const linkJobCultures = async (connection, jobId, cultureIds) => {
    if (!Array.isArray(cultureIds) || cultureIds.length === 0) {
        console.log('No culture IDs provided for job ID:', jobId);
        return;
    }

    try {
        const queries = cultureIds.map(cultureId => {
            return connection.query('INSERT INTO job_cultures (job_id, culture_id) VALUES (?, ?)', [jobId, cultureId]);
        });
        await Promise.all(queries);
        console.log('Inserted job cultures for job ID:', jobId);
    } catch (error) {
        console.error('Error linking job cultures for job ID:', jobId, error.message);
        throw new Error('Failed to link job cultures');
    }
};

const linkJobSkills = async (connection, jobId, skillIds) => {
    if (!Array.isArray(skillIds) || skillIds.length === 0) {
        console.log('No skill IDs provided for job ID:', jobId);
        return;
    }

    try {
        const queries = skillIds.map(skillId => {
            return connection.query('INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)', [jobId, skillId]);
        });
        await Promise.all(queries);
        console.log('Inserted job skills for job ID:', jobId);
    } catch (error) {
        console.error('Error linking job skills for job ID:', jobId, error.message);
        throw new Error('Failed to link job skills');
    }
};

const updateJob = async (jobData) => {
    const { id, title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date } = jobData;

    try {
        const [result] = await db.query(
            `UPDATE jobs SET title = ?, region_id = ?, address = ?, salary_from = ?, salary_to = ?, summary = ?, description = ?, 
             expired_date = ?, posting_date = ? WHERE id = ?`,
            [title, region_id, address, salary_from, salary_to, summary, description, expired_date, posting_date, id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error('Error updating job:', error.message);
        throw new Error('Failed to update job');
    }
};

const deleteJob = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error('Error deleting job:', error.message);
        throw new Error('Failed to delete job');
    }
};

module.exports = { 
    getJobs, 
    createJob, 
    linkJobTypes, 
    linkJobCategories, 
    linkJobCultures, 
    linkJobSkills, 
    updateJob, 
    deleteJob 
};
