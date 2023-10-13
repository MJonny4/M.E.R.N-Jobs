import path from path;

import multer from "multer";
import DataParser from "datauri/parser.js";

const storage = multer.diskStorage();
const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
    const ext = path.extname(file.originalname).toString();
    const data = parser.format(ext, file.buffer);
    return data.content;
}

export default upload;
