const db = require('../../config/db');
const getJobs = async (page = 1, limit = 2, status = 'all', employer_id) => {
    try {
        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        // Define the SQL query with dynamic WHERE clause based on status and employer_id
        const query = `
            SELECT 
                j.*, 
                GROUP_CONCAT(DISTINCT jc.category_id) AS category_ids,
                GROUP_CONCAT(DISTINCT c.industry_name) AS category_names,
                GROUP_CONCAT(DISTINCT jcu.culture_id) AS culture_ids,
                GROUP_CONCAT(DISTINCT cu.culture_name) AS culture_names,
                GROUP_CONCAT(DISTINCT js.skill_id) AS skill_ids,
                GROUP_CONCAT(DISTINCT s.skill_name) AS skill_names
            FROM 
                jobs j
            LEFT JOIN 
                job_categories jc ON j.id = jc.job_id
            LEFT JOIN 
                industries c ON jc.category_id = c.id
            LEFT JOIN 
                job_cultures jcu ON j.id = jcu.job_id
            LEFT JOIN 
                cultures cu ON jcu.culture_id = cu.id
            LEFT JOIN 
                job_skills js ON j.id = js.job_id
            LEFT JOIN 
                skills s ON js.skill_id = s.id
            WHERE 
                j.employer_id = ?  -- Filter by employer_id
                AND (
                    (? = 'active' AND j.expired_date > NOW())    -- Active jobs (expiry date in future)
                    OR (? = 'expired' AND j.expired_date < NOW()) -- Expired jobs (expiry date in past)
                    OR (? = 'all')                              -- No filtering for all jobs
                )
            GROUP BY 
                j.id
            LIMIT ? OFFSET ?;  -- Use LIMIT and OFFSET for pagination
        `;

        // Execute the query with the correct parameters
        const [results] = await db.query(query, [employer_id, status, status, status, limit, offset]);

        // Transform the result to split comma-separated values into arrays
        return results.map(job => ({
            ...job,
            category_ids: job.category_ids ? job.category_ids.split(',') : [],
            category_names: job.category_names ? job.category_names.split(',') : [],
            culture_ids: job.culture_ids ? job.culture_ids.split(',') : [],
            culture_names: job.culture_names ? job.culture_names.split(',') : [],
            skill_ids: job.skill_ids ? job.skill_ids.split(',') : [],
            skill_names: job.skill_names ? job.skill_names.split(',') : [],
        }));
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        throw new Error('Failed to fetch jobs');
    }
};


const createJob = async (jobData) => {
    const { title, employer_id,region_id, address, salary_from, position_level_id,salary_to, summary, description, expired_date, posting_date,experience_id,jobAutoRenew,applyOnline,url,emailAddress} = jobData;
    
    try {
        const [result] = await db.query(
            `INSERT INTO jobs (title,employer_id, region_id,address,experience_id,position_level_id,salary_from, salary_to, summary, description, expired_date,posting_date,jobAutoRenew,applyOnline,url,emailAddress) 
             VALUES (?,?, ?, ?,?,?,?, ?, ?, ?, ?,?,?,?,?,?)`,
            [title,employer_id, region_id, address, experience_id,position_level_id,salary_from, salary_to, summary, description, expired_date, posting_date,jobAutoRenew,applyOnline,url,emailAddress]
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
    const { id, title, region_id, address,experience_id,position_level_id, salary_from, salary_to, summary, description, expired_date, posting_date,jobAutoRenew,applyOnline,url,emailAddress } = jobData;

    try {
        const [result] = await db.query(
            `UPDATE jobs SET title = ?, region_id = ?, address = ?,experience_id=?,position_level_id=?, salary_from = ?, salary_to = ?, summary = ?, description = ?, 
             expired_date = ?, posting_date = ?,jobAutoRenew= ?,applyOnline= ?,url= ?,emailAddress= ? WHERE id = ?`,
            [title, region_id, address,experience_id,position_level_id, salary_from, salary_to, summary, description, expired_date, posting_date,jobAutoRenew,applyOnline,url,emailAddress, id]
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

const getJobCount = async (employer_id) => {
    try {
        // Query to count the active jobs for the specific employer
        const activeQuery = `
            SELECT COUNT(*) AS count
            FROM jobs
            WHERE employer_id = ? AND expired_date > NOW();
        `;

        // Query to count the expired jobs for the specific employer
        const expiredQuery = `
            SELECT COUNT(*) AS count
            FROM jobs
            WHERE employer_id = ? AND expired_date < NOW();
        `;

        // Query to count all jobs for the specific employer
        const allQuery = `
            SELECT COUNT(*) AS count
            FROM jobs
            WHERE employer_id = ?;
        `;

        // Execute queries with the employer_id
        const [activeResult] = await db.query(activeQuery, [employer_id]);
        const [expiredResult] = await db.query(expiredQuery, [employer_id]);
        const [allResult] = await db.query(allQuery, [employer_id]);

        // Return the counts as an object
        return {
            active: activeResult[0].count,
            expired: expiredResult[0].count,
            all: allResult[0].count,
        };
    } catch (error) {
        console.error('Error fetching job counts:', error.message);
        throw new Error('Failed to fetch job counts');
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
    deleteJob,
    getJobCount
};
