import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import axios from 'axios';

function ModalInsertTitle({ show, onHide, onSave }) {
  const [newTitle, setNewTitle] = useState('');

  const handleSave = async () => {
    try {
      const res = await axios.post('http://localhost:5000/createTitle', { titleName: newTitle });
      onSave(newTitle); // Cập nhật danh sách tiêu đề trong component Home
      setNewTitle(''); // Xóa tiêu đề sau khi lưu
      if(res.response.status === 200) {
        onSave(newTitle); // Cập nhật danh sách tiêu đề trong component Home
        setNewTitle(''); // Xóa tiêu đề sau khi lưu
      }
        
    } catch (error) {
			alert('Tiêu đề đã tồn tại');
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
          Insert Title
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Title Name"
            aria-label="Title Name"
            aria-describedby="basic-addon1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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

export default ModalInsertTitle;
