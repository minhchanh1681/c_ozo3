const sql = require('../db');
// getTitles
async function getTitles (req, res) {
	try {
		const request = new sql.Request();
		const result = await request.query(`
			SELECT *
			FROM title
		`);
		res.json(result.recordset);
	} catch (err) {
		console.log(err);
		res.status(500).send('Error fetching titles');
	}
};

async function createTitle(req, res) {
	const { titleName } = req.body;
	const createdAt = new Date();
	const updatedAt = new Date();

	try {
		if (!titleName) {
			return res.status(400).send('Title name is required');
		}

		const request = new sql.Request();

		// Check if title already exists
		request.input('name', sql.NVarChar, titleName);
		const checkQuery = `
			SELECT COUNT(*) AS count
			FROM title
			WHERE name = @name
		`;

		const result = await request.query(checkQuery);
		const titleCount = result.recordset[0].count;

		if (titleCount > 0) {
			return res.status(400).send('Title already exists');
		}

		// Insert new title
		request.input('created_at', sql.DateTime, createdAt);
		request.input('updated_at', sql.DateTime, updatedAt);

		const insertQuery = `
			INSERT INTO title (name, created_at, updated_at)
			VALUES (@name, @created_at, @updated_at)
		`;

		await request.query(insertQuery);

		res.status(200).send('Create title successfully');
	} catch (err) {
		console.log(err);
		res.status(500).send('Error creating title');
	}
}



async function updateTitle(req, res) {
	const { id } = req.params;
	const { titleName } = req.body;
	const updatedAt = new Date();
	
	try {
		if (!id || !titleName) {
			return res.status(400).send('Missing required fields in request body');
		}
		
		const request = new sql.Request();
		request.input('id', sql.Int, id);
		
		// Check if the title already exists
		const checkExistTitle = await request.query`
			SELECT name FROM title WHERE id = @id
		`;
		
		// Verify if the titleName is the same as the existing one
		if (checkExistTitle.recordset[0] && checkExistTitle.recordset[0].name === titleName) {
			return res.status(409).send('Priority conflict: The provided priority already exists');
		}

		// Update the title in the title table
		await request.input('name', sql.NVarChar, titleName);
		await request.input('updated_at', sql.DateTime, updatedAt);
		
		await request.query`
			UPDATE title
			SET name = @name,
				updated_at = @updated_at
			WHERE id = @id
		`;
		
		// Update the title in the images table
		await request.input('oldTitle', sql.NVarChar, checkExistTitle.recordset[0].name);
		await request.input('newTitle', sql.NVarChar, titleName);
		
		await request.query`
			UPDATE images
			SET title = @newTitle
			WHERE title = @oldTitle
		`;

		res.status(200).send('Update title successfully');
	} catch (err) {
		console.error(err);
		res.status(500).send('Error updating title');
	}
}

async function deleteTitle(req, res) {
	const { id } = req.params;

	try {
		const request = new sql.Request();
		request.input('id', sql.Int, id);
			if (!id) {
					return res.status(400).send('Missing required fields in request body');
			}



			// Fetch the title to be deleted
			const checkExistTitle = await request.query`
					SELECT name FROM title WHERE id = @id
			`;

			const titleName = checkExistTitle.recordset[0]?.name;
			if (!titleName) {
					return res.status(404).send('Title not found');
			}

			// Check if there are any images with the same title
			const checkImages = await request.input('titleName', sql.NVarChar, titleName).query`
					SELECT COUNT(*) AS count FROM images WHERE title = @titleName
			`;

			if (checkImages.recordset[0].count > 0) {
					return res.status(400).send('Cannot delete title because it is referenced in images');
			}

			// Delete the title from the title table
			await request.query`
					DELETE FROM title WHERE id = @id
			`;

			res.status(200).send('Title deleted successfully');
	} catch (err) {
			console.error(err);
			res.status(500).send('Error deleting title');
	}
}


module.exports = {
	getTitles,
	createTitle,
	updateTitle,
	deleteTitle
};