const multer = require('multer');
const uploadImage = multer({
  // fileFilter: multerFilter,
  // limits: {
  //     fileSize: 5 * 1024 * 1024,
  // }
});

const uploadVideo = multer({
    // fileFilter: multerFilter,
    // limits: {
    //     fileSize: 20 * 1024 * 1024,
    // }
  });

export default {uploadImage, uploadVideo };