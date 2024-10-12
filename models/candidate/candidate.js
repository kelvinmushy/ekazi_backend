const db = require('../../config/db'); 

const Candidate = {
  create: async (userId, candidateData) => {
    const { firstName, lastName, address, city, zip, state, contactNo, mobile, resume } = candidateData;
    await db.execute(
      'INSERT INTO candidates (user_id, first_name, last_name, address, city, zip, state, contact_no, mobile, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, firstName, lastName, address, city, zip, state, contactNo, mobile, resume]
    );
  },
};

module.exports = Candidate;
