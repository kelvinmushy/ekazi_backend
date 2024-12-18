const db = require('../../config/db');

// Create an applicant and save associated addresses and phone numbers
const createApplicant = async (connection, user_id, otherDetails) => {
  try {
    // Insert into the applicants table first
    const [result] = await connection.query(
      'INSERT INTO applicants (user_id, first_name, last_name,logo) VALUES (?, ?, ?, ?)',
      [
        user_id,                         // user_id
        otherDetails.firstName,         // first_name
        otherDetails.lastName,          // last_name
        otherDetails.logo                // logo (if provided)
      ]
    );

    const applicant_id = result.insertId; // The applicant ID returned after the insertion

    // Now handle the applicant addresses (assuming otherDetails.addresses is an array of objects)
    if (otherDetails.addresses && Array.isArray(otherDetails.addresses)) {
      for (const address of otherDetails.addresses) {
        // Insert each address into the applicant_addresses table
        await connection.query(
          'INSERT INTO applicant_addresses (applicant_id, address, region_id) VALUES (?, ?, ?,)',
          [applicant_id, address.address, address.city]
        );
      }
    }

    // Now handle the applicant phones (assuming otherDetails.contactNo and otherDetails.contactNo2 are arrays or single values)
    if (otherDetails.contactNo) {
      // Insert primary phone number
      await connection.query(
        'INSERT INTO applicant_phones (applicant_id, phone_number) VALUES (?, ?)',
        [applicant_id, otherDetails.contactNo]
      );
    }

    if (otherDetails.contactNo2) {
      // Insert secondary phone number if it exists
      await connection.query(
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

module.exports = { createApplicant };
