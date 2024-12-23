const db = require('../../config/db');


const createApplicantReferees = async (refereeData) => {
    // Destructure the incoming referee data
    let { applicant_id, first_name, last_name, institution, referee_position, email, phone } = refereeData;
  
    // Check if any of the fields are undefined, and replace them with null
    first_name = first_name ?? null;
    last_name = last_name ?? null;
    institution = institution ?? null;
    referee_position = referee_position ?? null;
    email = email ?? null;
    phone = phone ?? null;
  
    // SQL query to insert a new referee into the database
    const query = `
      INSERT INTO applicant_referees (applicant_id, first_name, last_name, institution, referee_position, email, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  
    try {
      // Execute the query with the provided data
      const result = await db.execute(query, [applicant_id, first_name, last_name, institution, referee_position, email, phone]);
      return result;  // Return the result (can include inserted ID or success message)
    } catch (error) {
      console.error('Error inserting referee:', error);
      throw new Error('Could not insert referee');
    }
  };

  
// Function to select referees by applicant_id (Only select referees related to the given applicant_id)
const selectRefereesByApplicantId = async (applicantId) => {
  const query = `
    SELECT id,first_name, last_name, institution, referee_position, email, phone
    FROM applicant_referees
    WHERE applicant_id = ?;
  `;
  try {
    // Execute the query with the correct argument (applicantId)
    const [result] = await db.execute(query, [applicantId]);
    return result;  // Return the query result
  } catch (error) {
    console.error('Error selecting referees:', error);
    throw new Error('Could not select referees');
  }
};

// Function to delete a referee by referee_id
const deleteReferee = async (refereeId) => {
  const query = `
    DELETE FROM applicant_referees WHERE id = ?;
  `;

  try {
    const result = await db.execute(query, [refereeId]);  // Use the correct parameter
    return result;
  } catch (error) {
    console.error('Error deleting referee:', error);
    throw new Error('Could not delete referee');
  }
};

// Function to edit an existing referee by referee_id
const editReferee = async (refereeId, updatedRefereeData) => {
  // Destructure the updated referee data
  const { first_name, last_name, institution, referee_position, email, phone } = updatedRefereeData;

  // SQL query to update an existing referee's details
  const query = `
    UPDATE applicant_referees
    SET first_name = ?, last_name = ?, institution = ?, referee_position = ?, email = ?, phone = ?
    WHERE id = ?;
  `;

  try {
    // Execute the query with the provided data
    const [result] = await db.execute(query, [first_name, last_name, institution, referee_position, email, phone, refereeId]);
    return result;  // Return the result (can include updated rows count or success message)
  } catch (error) {
    console.error('Error updating referee:', error);
    throw new Error('Could not update referee');
  }
};

module.exports = {
  createApplicantReferees,
  selectRefereesByApplicantId,
  deleteReferee,
  editReferee  // Export the new editReferee function
};
