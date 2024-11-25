//MULTER PACKAGE USE FOR SETTING A FILE IN DISKSTORAGE
import multer from "multer";

const storage = multer.memoryStorage();
// console.log(storage);

export const upload = multer({ storage: storage });
