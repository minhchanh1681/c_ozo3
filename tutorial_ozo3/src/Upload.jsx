import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const Upload = () => {
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const [image, setImage] = useState(null);
	const [priorityError, setPriorityError] = useState(false); // State for error flag
	const [titlesTable, setTitlesTable] = useState([]);

	useEffect(() => {
		const fetchTitles = async () => {
			try {
				const response = await axios.get('http://localhost:5000/getTitles'); // Assuming your API endpoint
				setTitlesTable(response.data);
			} catch (error) {
				console.error(error);
			}
		};
	
		fetchTitles();
	}, []); // Run on component mount


	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('title', title);
		formData.append('desc', desc);
		formData.append('image', image);
		console.log(image)
		try {
			const response = await axios.post('http://localhost:5000/upload', formData,{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			toast.success(response.data); // Use toast for success message
			clearForm(); // Clear form values after successful upload
		} catch (error) {
			console.error(error);
			toast.error('Error uploading image'); // Use toast for error message
		}
	};

	const clearForm = () => {
		setTitle('');
		setDesc('');
		setImage(null);
		setPriorityError(false); // Reset error flag
	};

	return (
		<div className="container mt-5">
			<h2>Upload Image</h2>
			<ToastContainer /> {/* Add ToastContainer for toast messages */}
			<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label>Title</label>
				<select
						className="form-control"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
				>
						<option value="">Select Title</option>
						{titlesTable.map((t) => (
								<option key={t.id} value={t.name}>
										{t.name}
								</option>
						))}
				</select>
				</div>
				<div className="form-group">
					<label>Description</label>
					<input
						type="text"
						className="form-control"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Image</label>
					<input
						type="file"
						className="form-control-file"
						onChange={(e) => setImage(e.target.files[0])}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary" disabled={priorityError}>
					Upload
				</button>
			</form>
		</div>
	);
};

export default Upload;
