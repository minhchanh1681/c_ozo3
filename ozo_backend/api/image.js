const sql = require('../db');

async function getImages(req, res)  {
	try {
		const request = new sql.Request();
		const result = await request.query(`
			SELECT * FROM images
		`);
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.status(500).send('Error fetching titles');
	}
};

async function uploadImage(req, res) {
	const { title, desc } = req.body; // Không cần priority từ body nữa
	const filePath = `uploads/${req.file.filename}`;
	const createdAt = new Date();
	const updatedAt = new Date();
	
	try {
		const request = new sql.Request();

		// Bước 1: Lấy giá trị priority cao nhất cho title cụ thể
		request.input('title', sql.NVarChar, title);
		const result = await request.query(`
			SELECT ISNULL(MAX(priority), 0) AS maxPriority
			FROM images
			WHERE title = @title
		`, { title });

		const maxPriority = result.recordset[0].maxPriority;
		const newPriority = maxPriority + 1;

		await request.input('description', sql.NVarChar, desc);
		await request.input('file_path', sql.NVarChar, filePath);
		await request.input('priority', sql.Int, newPriority);
		await request.input('created_at', sql.DateTime, createdAt);
		await request.input('updated_at', sql.DateTime, updatedAt);

		await request.query(`
			INSERT INTO images (title, description, file_path, priority, created_at, updated_at)
			VALUES (@title, @description, @file_path, @priority, @created_at, @updated_at)
		`);

		res.status(200).send('Image uploaded successfully');
	} catch (err) {
		console.log(err);
		res.status(500).send('Error uploading image');
	}
}

// edit images
async function editImage(req, res) {
    const { id } = req.params;
    const { desc } = req.body; // Only get desc from body
    const file = req.file; // File uploaded by multer
    const updatedAt = new Date();

    if (!id || !file || !desc) {
        return res.status(400).send('Missing required fields in request body');
    }

    const filePath = `uploads/${file.filename}`;

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, id);

        // Step 1: Get the current image's information
        const result = await request.query(`
            SELECT title, created_at, priority FROM images WHERE id = @id
        `);

        const currentImage = result.recordset[0];

        if (!currentImage) {
            return res.status(404).send('Image not found');
        }

        const { title, created_at, priority } = currentImage;

        // Step 2: Insert the new image with the same created_at and priority as the old image
        const newRequest = new sql.Request();
        newRequest.input('title', sql.NVarChar, title);
        newRequest.input('description', sql.NVarChar, desc);
        newRequest.input('file_path', sql.NVarChar, filePath);
        newRequest.input('priority', sql.Int, priority);
        newRequest.input('created_at', sql.DateTime, created_at);
        newRequest.input('updated_at', sql.DateTime, updatedAt);

        await newRequest.query(`
            INSERT INTO images (title, description, file_path, priority, created_at, updated_at)
            VALUES (@title, @description, @file_path, @priority, @created_at, @updated_at)
        `);

        // Step 3: Delete the old image
        await request.query(`
            DELETE FROM images WHERE id = @id
        `);

        res.status(200).send('Image updated successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating image');
    }
}



// API cho trang detail
async function getImageDetailByTitle(req, res) {
	const title = req.params.title;
	
	try {
		const request = new sql.Request();
		// Sử dụng biến @title trong truy vấn
		request.input('title', sql.NVarChar, `%${title}%`);

		const result = await request.query(`
			SELECT * FROM images
			WHERE title LIKE @title
			ORDER BY priority ASC
		`);

		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.status(500).send('Error fetching images');
	}
}

async function getTitleGroupByTitle(req, res) {
		try {
			const request = new sql.Request();
			const result = await request.query(`
				SELECT title, COUNT(*) as quantity
				FROM images
				GROUP BY title
			`);
			res.json(result.recordset);
		} catch (err) {
			console.log(err);
			res.status(500).send('Error fetching titles');
		}
};


async function bulkInsertImages(req, res) {
    const { title, images } = req.body;

    try {
        const deleteRequest = new sql.Request();

        // Step 1: Delete all images with the same title
        deleteRequest.input('title', sql.NVarChar, title);
        await deleteRequest.query(`
            DELETE FROM images
            WHERE title = @title
        `);

        // Step 2: Insert each image individually as in the uploadImage function
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const { file_name, description } = image; // Ensure 'file_name' is sent from client
            const createdAt = new Date();
            const updatedAt = new Date();
            const filePath = `uploads/${file_name}`; // Ensure 'file_name' contains a valid file name

            const request = new sql.Request();

            // Fetch the max priority for the title
            request.input('title', sql.NVarChar, title);
            const result = await request.query(`
                SELECT ISNULL(MAX(priority), 0) AS maxPriority
                FROM images
                WHERE title = @title
            `);

            const maxPriority = result.recordset[0].maxPriority;
            const newPriority = maxPriority + 1;

            await request.input('description', sql.NVarChar, description);
            await request.input('file_path', sql.NVarChar, filePath);
            await request.input('priority', sql.Int, newPriority);
            await request.input('created_at', sql.DateTime, createdAt);
            await request.input('updated_at', sql.DateTime, updatedAt);

            await request.query(`
                INSERT INTO images (title, description, file_path, priority, created_at, updated_at)
                VALUES (@title, @description, @file_path, @priority, @created_at, @updated_at)
            `);
        }

        res.status(200).send('Bulk images inserted successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error inserting bulk images');
    }
}
// Delete image by id
async function deleteImage(req, res) {
	const { id } = req.params;

	try {
		const request = new sql.Request();
		request.input('id', sql.Int, id);

		await request.query(`
			DELETE FROM images
			WHERE id = @id
		`);

		res.status(200).send('Image deleted successfully');
	} catch (err) {
		console.log(err);
		res.status(500).send('Error deleting image');
	}
}
  
module.exports = {
	uploadImage,
	editImage,
	getImages,
	getImageDetailByTitle,
	getTitleGroupByTitle,
	bulkInsertImages,
	deleteImage
};