import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Image, Form, Modal } from 'react-bootstrap';

const Detail = () => {
  const { title } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/images/${title}`);
      setImages(response.data);
    };
    fetchData();
  }, [title]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!image || !desc) {
      alert('Please fill in all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('desc', desc);
    formData.append('image', image);

    setUploading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/upload/${currentImageId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh images after update
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/images/${title}`);
      setImages(response.data);
      alert('Image updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/image/${imageToDelete}`);
      setImages(images.filter(image => image.id !== imageToDelete));
      alert('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    } finally {
      setShowConfirmModal(false);
      setImageToDelete(null);
    }
  };

  return (
    <Container fluid="md">
      <h2 className="text-center mb-4">Guide for 「{title}」</h2>
      <div className="row d-flex justify-content-center">
        {images.map((image, index) => (
          <Col key={image.id} xs={12} className="mb-4">
            <Image src={`${import.meta.env.VITE_API_URL}/${image.file_path}`} alt={image.title} fluid className='border border-black'/>
            <div className='mt-1'>
              <Button 
                variant="success" 
                className="mr-2" 
                onClick={() => {
                  setDesc(image.description || '');
                  setCurrentImageId(image.id);
                  setShowEditModal(true);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  setImageToDelete(image.id);
                  setShowConfirmModal(true);
                }}
              >
                Xóa
              </Button>
            </div>

            {index < images.length - 1 && (
              <Col className="text-primary" xs={1}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                </svg>
              </Col>
            )}
          </Col>
        ))}
      </div>

      {/* Modal for editing image */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Choose new image</Form.Label>
              <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])}/>
            </Form.Group>
            <Form.Group controlId="formDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdate} 
            disabled={uploading}
            
          >
            {uploading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for confirming delete */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Detail;
