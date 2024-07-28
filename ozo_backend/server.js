const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const sql = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({ storage });
const imageApi = require('./api/image');
const titleApi = require('./api/title');


app.use('/uploads', express.static(uploadDir));


// API cho trang home
app.get('/api/titles', imageApi.getTitleGroupByTitle);

// titleApi
app.get('/getTitles', titleApi.getTitles);
app.post('/createTitle', titleApi.createTitle);
app.put('/updateTitle/:id', titleApi.updateTitle);
app.delete('/deleteTitle/:id', titleApi.deleteTitle);

// images
app.get('/getImages', imageApi.getImages);
app.post('/upload', upload.single('image'), imageApi.uploadImage);
app.put('/upload/:id', upload.single('image'), imageApi.editImage);
app.get('/images/:title', imageApi.getImageDetailByTitle);
app.post('/bulkInsert', upload.single('image'),imageApi.bulkInsertImages);
app.delete('/image/:id', imageApi.deleteImage);



app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
