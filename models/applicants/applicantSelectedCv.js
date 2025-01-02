const db = require('../../config/db'); // Import the DB connection

const saveSelectedCvTemplate = async (applicant_id, template_id) => {
    try {
      // SQL query to check if a record exists for the applicant
      const checkQuery = `
        SELECT COUNT(*) as count FROM applicant_selected_cvs
        WHERE applicant_id = ?
      `;
  
      const [checkResult] = await db.execute(checkQuery, [applicant_id]);
      const recordExists = checkResult[0].count > 0;
  
      let result;
  
      if (recordExists) {
        // Update the template_id for the existing record
        const updateQuery = `
          UPDATE applicant_selected_cvs
          SET template_id = ?
          WHERE applicant_id = ?
        `;
        [result] = await db.execute(updateQuery, [template_id, applicant_id]);
        console.log("Template updated successfully:", result);
      } else {
        // Insert a new record if none exists
        const insertQuery = `
          INSERT INTO applicant_selected_cvs (applicant_id, template_id)
          VALUES (?, ?)
        `;
        [result] = await db.execute(insertQuery, [applicant_id, template_id]);
        console.log("Template saved successfully:", result);
      }
  
      return result;
    } catch (error) {
      console.error("Error saving or updating the template:", error);
      throw error; // Re-throw the error for further handling
    }
  };
  
  module.exports = {
    saveSelectedCvTemplate,
  };
  

  