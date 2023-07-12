const multer = require("multer");
const AppError = require("../src/utils/AppError");

let option = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("images only", 400), false);
    }
  }
  return multer({ storage, fileFilter });
};

module.exports.uploadSingleFile = (fieldName, folderName) => {
  return option(folderName).single(fieldName);
};

module.exports.uploadMixOfFiles = (arrayOfFields, folderName) => {
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, `uploads/${folderName}`);
  //   },
  //   filename: function (req, file, cb) {
  //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //     cb(null, uniqueSuffix + "-" + file.originalname);
  //   },
  // });

  // function fileFilter(req, file, cb) {
  //   if (file.mimetype.startsWith("image")) {
  //     cb(null, true);
  //   } else {
  //     cb(new AppError("images only", 400), false);
  //   }
  // }

  // const upload = multer({ storage, fileFilter });
  return option(folderName).fields(arrayOfFields);
};

// module.exports = {
//   uploadSingleFile,
//   uploadMixOfFiles,
// };
