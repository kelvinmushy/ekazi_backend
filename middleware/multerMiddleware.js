const multer = require('multer');
const path = require('path');

// Set up storage options (for example, saving images in the 'uploads' directory)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/logos'); // The folder where you want to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique filename (timestamp + file extension)
    }
});

// Initialize multer with file size limits and accepted file types (e.g., images)
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Accepted image formats
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
}).single('logo'); // 'logo' is the field name for the uploaded file

module.exports = upload;
