const { createApplicantReferees, deleteReferee, selectRefereesByApplicantId, editReferee } = require('../../models/applicants/applicantReferees');

// 1. Get Referees by Applicant ID
const getRefereesBYapplicantId = async (req, res) => {
  try {
    const { applicantId } = req.params; // Extract applicantId from the route parameters

    // Fetch referees for the given applicantId from the database
    const referees = await selectRefereesByApplicantId(applicantId);

    if (referees.length === 0) {
      return res.status(404).json({ message: 'No referees found for this applicant' });
    }

    return res.json(referees); // Return referees data as a JSON response
  } catch (error) {
    console.error('Error fetching referees:', error);
    return res.status(500).json({ message: 'Could not fetch referees' });
  }
};

// 2. Create a New Referee for the Given Applicant
const createRefereesBYapplicantId = async (req, res) => {
  try {

    const { applicantId } = req.params; // Extract applicantId from the route parameters
    const { first_name, last_name, institution, email, phone } = req.body; // Extract referee details from request body

  
   
    // Validate input data (ensure all fields are provided)
    if (!first_name || !last_name || !institution  || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Construct the new referee object to be inserted
    const newReferee = {
      applicant_id: applicantId,
      first_name,
      last_name,
      institution,
      email,
      phone,
    };

    // Call the model function to insert the new referee into the database
    const result = await createApplicantReferees(newReferee);


    // Return a success response
    return res.status(201).json({ message: 'Referee added successfully', data: result });
  } catch (error) {
    console.error('Error inserting referee:', error);
    return res.status(500).json({ message: 'Could not insert referee' });
  }
};

const editRefereeById = async (req, res) => {

  
    try {
      const { refereeId } = req.params; // Extract refereeId from the route parameters
      const { first_name, last_name, institution, email, phone, referee_position } = req.body; // Extract updated data from request body
  
      // Validate input data (ensure all required fields are provided)
      if (!first_name || !last_name || !institution || !email || !phone || !referee_position) {
        return res.status(400).json({ message: 'All fields (except title) are required' });
      }
  
      // Call the model function to update the referee details
      const updatedReferee = await editReferee(refereeId, {
        first_name,
        last_name,
        institution,
        email,
        phone,
        referee_position,  // Note: We are using 'referee_position' instead of 'title'
      });
  
      // Check if the update was successful (affected rows > 0)
      if (updatedReferee.affectedRows === 0) {
        return res.status(404).json({ message: 'Referee not found' });
      }
  
      // Return success response with the updated referee data
      return res.status(200).json({ message: 'Referee updated successfully', data: updatedReferee });
    } catch (error) {
      console.error('Error updating referee:', error);
      return res.status(500).json({ message: 'Could not update referee' });
    }
  };
  

// 4. Delete Referee by Referee ID
const deleteRefereeById = async (req, res) => {
  try {
    //console.log(req.body);
    const { refereeId } = req.params; // Extract refereeId from the route parameters

    // Call the model function to delete the referee from the database
    const result = await deleteReferee(refereeId);

    // Check if any rows were affected (deleted)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Referee not found or already deleted' });
    }

    // Return success response
    return res.status(200).json({ message: 'Referee deleted successfully' });
  } catch (error) {
    console.error('Error deleting referee:', error);
    return res.status(500).json({ message: 'Could not delete referee' });
  }
};

module.exports = {
  getRefereesBYapplicantId,
  createRefereesBYapplicantId,
  editRefereeById,
  deleteRefereeById,
};
