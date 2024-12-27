const db = require('../../config/db');
// 1. Fetch all languages by applicant ID
const selectLanguagesByApplicantId = async (applicantId) => {
  const query = `
    SELECT 
    al.id, 
    l.name,
    rw.name AS writing_skill,
    rd.name AS reading_skill,
    sp.name AS speaking_skill
  FROM 
    applicant_languages al
  JOIN 
    languages l ON al.language_id = l.id
LEFT JOIN 
    language_writes rw ON al.write_id = rw.id
LEFT JOIN 
    language_reads rd ON al.read_id = rd.id
LEFT JOIN 
    language_speaks sp ON al.speak_id = sp.id
WHERE 
    al.applicant_id = ?;

  `;
  const [rows] = await db.execute(query, [applicantId]);
  return rows;
};

// 2. Create a new language entry for the applicant
const createApplicantLanguage = async (languageData) => {
  const query = `
    INSERT INTO applicant_languages 
      (applicant_id, read_id, write_id, speak_id, language_id) 
    VALUES 
      (?, ?, ?, ?, ?);
  `;
  const { applicant_id, read_id, write_id, speak_id, language_id } = languageData;
  const [result] = await db.execute(query, [applicant_id, read_id, write_id, speak_id, language_id]);
  return {
    id: result.insertId,
    applicant_id,
    read_id,
    write_id,
    speak_id,
    language_id,
  };
};

// 3. Edit an existing language entry by ID
const editApplicantLanguage = async (languageId, updatedData) => {
  const query = `
    UPDATE applicant_languages
    SET 
      read_id = ?, 
      write_id = ?, 
      speak_id = ?, 
      language_id = ?
    WHERE 
      id = ?;
  `;
  const { read_id, write_id, speak_id, language_id } = updatedData;
  const [result] = await db.execute(query, [read_id, write_id, speak_id, language_id, languageId]);
  return result;
};

// 4. Delete a language entry by ID
const deleteApplicantLanguage = async (languageId) => {
  const query = `
    DELETE FROM applicant_languages
    WHERE id = ?;
  `;
  const [result] = await db.execute(query, [languageId]);
  return result;
};

module.exports = {
  selectLanguagesByApplicantId,
  createApplicantLanguage,
  editApplicantLanguage,
  deleteApplicantLanguage,
};
