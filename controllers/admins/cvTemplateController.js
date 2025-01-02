const {
    getCvTemplates,
    createCvTemplate,
    updateCvTemplate,
    deleteCvTemplate,
    getCvTemplateById // Ensure this is implemented to get a CV template by ID
  } = require('../../models/resources/cvTemplateModel');
  const fs = require('fs');
  const path = require('path');
  
  // Controller to fetch all CV templates
  const fetchCvTemplates = async (req, res) => {
    try {
      const templates = await getCvTemplates();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch CV templates: ' + error.message });
    }
  };
  
  // Controller to create a new CV template
  const addCvTemplate = async (req, res) => {
    // Checking for the presence of required fields
    const { name, creator_id } = req.body;
    if (!name || !creator_id) {
      return res.status(400).json({ message: 'Name and Creator ID are required.' });
    }
  
    // File attachment handling
    const attachments = req.file ? req.file.path : null; // multer stores the file in req.file
  
    
    try {
      const newTemplateId = await createCvTemplate({ name, creator_id, attachment:attachments });
      res.status(201).json({ message: 'CV template created successfully', id: newTemplateId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create CV template: ' + error.message });
    }
  };
  
  // Controller to update an existing CV template
  const modifyCvTemplate = async (req, res) => {
    const { id } = req.params;
    const { updator_id, name } = req.body;
  
    // Checking for the presence of required fields
    if (!updator_id || !name) {
      return res.status(400).json({ message: 'Updator ID and Name are required.' });
    }
  
    // Handle the file upload: if a new file is uploaded, use that; otherwise, keep the existing file.
    const attachment = req.file ? req.file.path : null; // multer stores the file in req.file
  
    try {
      // Fetch the existing template to check the old attachment
      const existingTemplate = await getCvTemplateById(id);

      console.log("Cv Template",existingTemplate)
      if (!existingTemplate) {
        return res.status(404).json({ message: 'CV template not found' });
      }
  
      // If a new attachment is uploaded, delete the old file
      if (req.file) {
        const oldAttachmentPath = existingTemplate.attachment;
        if (oldAttachmentPath) {
          // Delete the old file using fs.unlink
          fs.unlink(path.resolve(oldAttachmentPath), (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            } else {
              console.log('Old file deleted successfully');
            }
          });
        }
      }
  
      // Update the CV template in the database
      const affectedRows = await updateCvTemplate({ id, updator_id, name, attachment });
      if (affectedRows > 0) {
        res.status(200).json({ message: `Successfully updated ${affectedRows} template(s)` });
      } else {
        res.status(404).json({ message: 'CV template not found or no changes made' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update CV template: ' + error.message });
    }
  };
  
  // Controller to delete a CV template
  const removeCvTemplate = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the existing template to get the attachment file path
      const existingTemplate = await getCvTemplateById(id);
      if (!existingTemplate) {
        return res.status(404).json({ message: 'CV template not found' });
      }
  
      // Delete the attachment file from the server
      const attachmentPath = existingTemplate.attachment;
      if (attachmentPath) {
        fs.unlink(path.resolve(attachmentPath), (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
      }
  
      // Now delete the template from the database
      const affectedRows = await deleteCvTemplate(id);
      if (affectedRows > 0) {
        res.status(200).json({ message: `Successfully deleted ${affectedRows} template(s)` });
      } else {
        res.status(404).json({ message: 'CV template not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete CV template: ' + error.message });
    }
  };
  
  module.exports = {
    fetchCvTemplates,
    addCvTemplate,
    modifyCvTemplate,
    removeCvTemplate
  };
  