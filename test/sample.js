const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs =require('fs/promises');
const app = express();
const port = 3000;

// Adjust the maximum request size (10MB in this example).
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Set up a storage engine for multer to save the uploaded files.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//app.use(upload());
app.post('/uploadMedia',async (req, res) => {
  try {
   console.log(req.body);
    res.json({
      success: true,
      message: 'Files uploaded successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading files.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
