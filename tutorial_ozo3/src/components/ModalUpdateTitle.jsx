// ModalUpdateTitle.js
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import axios from 'axios';

function ModalUpdateTitle({ show, onHide, onSave, title, id }) {
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/updateTitle/${id}`, { titleName: updatedTitle });
      onSave(updatedTitle); // Cập nhật danh sách tiêu đề trong component Home
    } catch (error) {
      console.error('Failed to update title:', error);
    }
    onHide(); // Đóng modal sau khi lưu
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Title
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Title Name"
            aria-label="Title Name"
            aria-describedby="basic-addon1"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSave}>Save</Button>
        <Button variant="danger" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUpdateTitle;
