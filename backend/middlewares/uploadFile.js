const multer = require('multer');

const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp'
];

const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (PNG, JPEG, WEBP) are allowed'), false);
    }
};

const upload = multer({
    storage: uploadStorage,
    fileFilter,
});

// Ko'p rasimlar yuklash uchun max:5
const uploadMiddleware = upload.array('images', 5);
module.exports = uploadMiddleware;
