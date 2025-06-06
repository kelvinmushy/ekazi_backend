// models/applicants/applicant.js
const db = require('../../config/db'); // Import the DB connection

// Fetch an applicant by their applicant_id with details like addresses and phone numbers
const getApplicantById = async (applicant_id) => {

  try {
    const [applicant] = await db.query(
      `
        SELECT 
   u.email,
   a.id,
   a.first_name,
   a.last_name,
   a.about,
   a.logo,
   a.dob,
   a.user_id ,
   a.gender_id,
   a.marital_id,
   aa.address,
   ap.phone_number,
   aa.region_id,
   r.name AS region_name,           -- Assuming regions table has a 'name' field for the region
   r.country_id AS country_id,           -- Assuming regions table has a 'name' field for the region
   c.name AS country_name           -- Assuming countries table has a 'name' field for the country
FROM 
  applicants a
LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
LEFT JOIN users u ON a.user_id = u.id 
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

//Get All Applicant will be here
const getApplicantsWithDetails = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    // Calculate the offset based on the page number and page size
    const offset = (page - 1) * pageSize;

    // Start the base SQL query
    let query = `
      SELECT 
        u.email,
        a.id,
        a.first_name,
        a.last_name,
        a.about,
        a.logo,
        a.dob,
        a.user_id,
        a.gender_id,
        a.marital_id,
        aa.address,
        ap.phone_number,
        aa.region_id,
        r.name AS region_name,
        r.country_id AS country_id,
        c.name AS country_name
      FROM 
        applicants a
      LEFT JOIN applicant_addresses aa ON a.id = aa.applicant_id
      LEFT JOIN users u ON a.user_id = u.id 
      LEFT JOIN regions r ON aa.region_id = r.id
      LEFT JOIN countries c ON r.country_id = c.id
      LEFT JOIN marital_statuses m ON a.marital_id = m.id
      LEFT JOIN genders g ON a.gender_id = g.id
      LEFT JOIN applicant_phones ap ON a.id = ap.applicant_id
    `;

    // Array to hold filter conditions
    const filterConditions = [];
    const queryParams = [];

    // Dynamically build the WHERE clause based on the provided filters
    if (filters.country_id) {
      filterConditions.push('r.country_id = ?');
      queryParams.push(filters.country_id);
    }
    if (filters.region_id) {
      filterConditions.push('aa.region_id = ?');
      queryParams.push(filters.region_id);
    }
    if (filters.region_id) {
      filterConditions.push('aa.region_id = ?');
      queryParams.push(filters.region_id);
    }
    if (filters.marital_id) {
      filterConditions.push('a.marital_id = ?');
      queryParams.push(filters.marital_id);
    }
    if (filters.gender_id) {
      filterConditions.push('a.gender_id = ?');
      queryParams.push(filters.gender_id);
    }
    // Apply first_name filter if provided
    if (filters.first_name && typeof filters.first_name === 'string' && filters.first_name.trim() !== '') {
      console.log(`Applying first_name filter: '%${filters.first_name.trim()}%'`); // Debugging log
      filterConditions.push('a.first_name LIKE ?');
      queryParams.push(`%${filters.first_name.trim()}%`);
    }

    // Apply last_name filter if provided
    if (filters.last_name && typeof filters.last_name === 'string' && filters.last_name.trim() !== '') {
      console.log(`Applying last_name filter: '%${filters.last_name.trim()}%'`); // Debugging log
      filterConditions.push('a.last_name LIKE ?');
      queryParams.push(`%${filters.last_name.trim()}%`);
    }

    // Apply email filter if provided
    if (filters.email && typeof filters.email === 'string' && filters.email.trim() !== '') {
      console.log(`Applying email filter: '%${filters.email.trim()}%'`); // Debugging log
      filterConditions.push('u.email LIKE ?');
      queryParams.push(`%${filters.email.trim()}%`);
    }

    // If there are any filter conditions, add them to the query
    if (filterConditions.length > 0) {
      query += ' WHERE ' + filterConditions.join(' AND ');
    }

    // Add pagination to the query
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(pageSize, offset);

    console.log('Executing Query:', query); // Debugging log for the final query
    console.log('With Parameters:', queryParams); // Debugging log for the parameters

    // Execute the query with the filters and pagination
    const [applicants] = await db.query(query, queryParams);

    // Return an empty array if no applicants are found
    if (applicants.length === 0) {
      console.log('No applicants found for this filter'); // Debugging log
      return [];
    }

    return applicants;
  } catch (error) {
    console.error('Error fetching applicants:', error);
    throw new Error('Could not fetch applicants');
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

const updateApplicant = async (applicant_id, updatedDetails) => {
  try {
    // Update the main applicant details
    await db.query(
      `
      UPDATE applicants 
      SET 
        first_name = ?, 
        last_name = ?, 
        logo = ?, 
        dob = ?,
        marital_id = ?,
        gender_id = ?,
        about=?
      WHERE id = ?
      `,
      [
        updatedDetails.firstName,         // Updated first name
        updatedDetails.lastName,          // Updated last name
        updatedDetails.logo,              // Updated logo
        updatedDetails.dateOfBirth,               // Updated date of birth
        updatedDetails.maritalStatus,         // Updated marital status ID
        updatedDetails.gender,          // Updated gender ID
        updatedDetails.about,  
        applicant_id                      // Applicant ID to identify the record

      ]
    );

    // Update addresses (assuming updatedDetails.addresses is an array of objects with id and new data)
    if (updatedDetails.addresses && Array.isArray(updatedDetails.addresses)) {
      for (const address of updatedDetails.addresses) {
        if (address.id) {
          // Update existing address
          await db.query(
            `
            UPDATE applicant_addresses 
            SET address = ?, region_id = ? 
            WHERE id = ?
            `,
            [address.address, address.regionId, address.id]
          );
        } else {
          // Insert new address
          await db.query(
            `
            INSERT INTO applicant_addresses (applicant_id, address, region_id) 
            VALUES (?, ?, ?)
            `,
            [applicant_id, address.address, address.regionId]
          );
        }
      }
    }

    // Update phone numbers (assuming updatedDetails.phones is an array of objects with id and new data)
    if (updatedDetails.phones && Array.isArray(updatedDetails.phones)) {
      for (const phone of updatedDetails.phones) {
        if (phone.id) {
          // Update existing phone number
          await db.query(
            `
            UPDATE applicant_phones 
            SET phone_number = ? 
            WHERE id = ?
            `,
            [phone.phoneNumber, phone.id]
          );
        } else {
          // Insert new phone number
          await db.query(
            `
            INSERT INTO applicant_phones (applicant_id, phone_number) 
            VALUES (?, ?)
            `,
            [applicant_id, phone.phoneNumber]
          );
        }
      }
    }

    return { success: true, message: 'Applicant updated successfully' };
  } catch (error) {
    console.error('Error updating applicant:', error);
    throw new Error('Could not update applicant');
  }
};

module.exports = { createApplicant, getApplicantById ,updateApplicant,getApplicantsWithDetails};
