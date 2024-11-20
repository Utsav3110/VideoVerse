//MULTER PACKAGE USE FOR SETTING A FILE IN DISKSTORAGE
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    console.log(file);
    cb(null, "./public/temp");


  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// console.log(storage);

export const upload = multer({ storage: storage });
