// models/applicants/applicant.js
const db = require('../../config/db'); // Import the DB connection

// Fetch an applicant by their applicant_id with details like addresses and phone numbers
const getApplicantById = async (applicant_id) => {

  try {
    const [applicant] = await db.query(
      `
        SELECT 
  a.id,
  a.first_name,
  a.last_name,
  a.logo,
   a.dob,
  aa.address,
ap.phone_number,
  aa.region_id,
  r.name AS region_name,           -- Assuming regions table has a 'name' field for the region
   r.country_id AS country_id,           -- Assuming regions table has a 'name' field for the region
  m.name AS marital_status,        -- Assuming marital_statuses table has a 'name' field for marital status
  g.name AS gender,                -- Assuming gender table has a 'name' field for gender
  c.name AS country_name           -- Assuming countries table has a 'name' field for the country
FROM 
  applicants a
LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id

LEFT JOIN regions r ON aa.region_id = r.id     -- Join regions by region_id
LEFT JOIN countries c ON r.country_id = c.id  -- Join countries by country_id
LEFT JOIN marital_statuses m ON a.marital_id = m.id  -- Join marital statuses by marital_id
LEFT JOIN genders g ON a.gender_id = g.id     -- Join genders by gender_id
LEFT JOIN applicant_phones ap ON a.id = ap.applicant_id
WHERE a.id = ?;
      `,
      [applicant_id] // Use the applicant_id in the WHERE clause to filter by specific applicant
    );

    // If no applicant is found with the given ID, return null or throw an error
    if (applicant.length === 0) {
      throw new Error('Applicant not found');
    }

    return applicant; // Return the applicant details (addresses and phone numbers will be in the result)
  } catch (error) {
    console.error('Error fetching applicant by ID:', error);
    throw new Error('Could not fetch applicant');
  }
};

// Create a new applicant and save associated addresses and phone numbers
const createApplicant = async (user_id, otherDetails) => {
  try {
    // Insert into the applicants table first
    const [result] = await db.query(
      'INSERT INTO applicants (user_id, first_name, last_name, logo) VALUES (?, ?, ?, ?)',
      [
        user_id,                         // user_id
        otherDetails.firstName,         // first_name
        otherDetails.lastName,          // last_name
        otherDetails.logo               // logo (if provided)
      ]
    );

    const applicant_id = result.insertId; // The applicant ID returned after the insertion

    // Insert the applicant addresses (assuming otherDetails.addresses is an array of objects)
    if (otherDetails.addresses && Array.isArray(otherDetails.addresses)) {
      for (const address of otherDetails.addresses) {
        await db.query(
          'INSERT INTO applicant_addresses (applicant_id, address, region_id) VALUES (?, ?, ?)',
          [applicant_id, address.address, address.city]
        );
      }
    }

    // Insert the applicant phones (assuming otherDetails.contactNo and otherDetails.contactNo2 are arrays or single values)
    if (otherDetails.contactNo) {
      await db.query(
        'INSERT INTO applicant_phones (applicant_id, phone_number) VALUES (?, ?)',
        [applicant_id, otherDetails.contactNo]
      );
    }

    if (otherDetails.contactNo2) {
      await db.query(
        'INSERT INTO applicant_phones (applicant_id, phone_number) VALUES (?, ?)',
        [applicant_id, otherDetails.contactNo2]
      );
    }

    return applicant_id; // Return the applicant_id to be used elsewhere

  } catch (error) {
    console.error('Error creating applicant:', error);
    throw new Error('Could not create applicant');
  }
};

module.exports = { createApplicant, getApplicantById };
