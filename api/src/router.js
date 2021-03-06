const { Router } = require("express");
const multer = require("multer");
const { response } = require("../app");
const path = require("path");

const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");

const router = Router();

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== "image/png") {
    request.fileValidationError = "Wrong file type";
    callback(null, false, new Error("Wrong file type"));
  } else {
    callback(null, true);
  }
};

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};

const storage = multer.diskStorage({
  destination: "api/uploads/",
  filename: filename,
});
const upload = multer({ fileFilter: fileFilter, storage: storage });

router.post("/upload", upload.single("photo"), function (req, res) {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  return res.status(201).json({ success: true });
});

router.get("/photo-viewer", (request, response) => {
  response.sendFile(photoPath);
});

module.exports = router;
