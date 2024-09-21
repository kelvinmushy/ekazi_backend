// models/resources/jobModel.js
const db = require('../../../config/db');

const getJobs = async () => {
    const [results] = await db.query('SELECT * FROM jobs');
    return results;
};

const createJob = async ({ title, region_id, address, salary_from,salary_to, summary, description, expired_date, posting_date }) => {
    const [result] = await db.query(
        `INSERT INTO jobs (title, region_id, address,salary_from,salary_to, summary, description, expired_date, posting_date) 
         VALUES (?, ?, ?,?, ?, ?, ?, ?, ?)`,
        [title, region_id, address, salary_from,salary_to, summary, description, expired_date, posting_date]
    );
    return result.insertId;
};

const linkJobTypes = async (jobId, typeIds) => {
    if (!Array.isArray(typeIds) || typeIds.length === 0) {
        console.log('No type IDs provided for job ID:', jobId);
        return;
    }

    try {
        const queries = typeIds.map(typeId => {
            return db.query('INSERT INTO job_types (job_id, type_id) VALUES (?, ?)', [jobId, typeId]);
        });
        await Promise.all(queries);
        console.log('Inserted job types for job ID:', jobId);
    } catch (error) {
        console.error('Error linking job types for job ID:', jobId, error);
        throw new Error('Failed to link job types');
    }
};


const linkJobCategories = async (jobId, categoryIds) => {
    const queries = categoryIds.map(categoryId => {
        return db.query('INSERT INTO job_categories (job_id, category_id) VALUES (?, ?)', [jobId, categoryId]);
    });
    return Promise.all(queries);
};

const linkJobCultures = async (jobId, cultureIds) => {
    const queries = cultureIds.map(cultureId => {
        return db.query('INSERT INTO job_cultures (job_id, culture_id) VALUES (?, ?)', [jobId, cultureId]);
    });
    return Promise.all(queries);
};

const linkJobSkills = async (jobId, skillIds) => {
    const queries = skillIds.map(skillId => {
        return db.query('INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)', [jobId, skillId]);
    });
    return Promise.all(queries);
};


const updateJob = async ({ id, title, region_id, address, salary_from,salary_to, summary, description, expired_date, posting_date }) => {
    const [result] = await db.query(
        `UPDATE jobs SET title = ?, region_id = ?, address = ?, salary_from= ?, salary_to= ?,summary = ?, description = ?, 
         expired_date = ?, posting_date = ? WHERE id = ?`,
        [title, region_id, address,salary_from,salary_to,summary, description, expired_date, posting_date, id]
    );
    return result.affectedRows;
};

const deleteJob = async (id) => {
    const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = { getJobs,linkJobSkills, createJob, linkJobTypes, linkJobCategories, linkJobCultures, updateJob, deleteJob };
