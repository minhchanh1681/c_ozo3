import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalUpdateTitle from './components/ModalUpdateTitle';
import { Button } from 'react-bootstrap';
import ModalInsertTitle from './components/ModalInsertTitle';

const Home = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [modalInsertShow, setModalInsertShow] = React.useState(false);

  const [currentTitle, setCurrentTitle] = useState('');
  const [currentTitleId, setCurrentTitleId] = useState(null);

  const [titleList, setTitleList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTitleList = await axios.get(`${import.meta.env.VITE_API_URL}/getTitles`);
        setTitleList(responseTitleList.data);
      } catch (error) {
        console.error('Failed to fetch titles:', error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (title) => {
    navigate(`/detail/${title}`);
  };

  const handleEditClick = (title, id) => {
    setCurrentTitle(title);
    setCurrentTitleId(id);
    setModalShow(true);
  };

  const handleSave = async () => {
    const responseTitleList = await axios.get(`${import.meta.env.VITE_API_URL}/getTitles`);
    setTitleList(responseTitleList.data);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/deleteTitle/${id}`);
      if (res.status === 200) {
        const responseTitleList = await axios.get(`${import.meta.env.VITE_API_URL}/getTitles`);
        setTitleList(responseTitleList.data);
      } else if (res.status === 400) {
        alert('Delete failed');
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container mt-5">
      <Button variant="primary" className="mb-1" onClick={() => setModalInsertShow(true)}>New Title</Button>
      <ModalInsertTitle
        show={modalInsertShow}
        onHide={() => setModalInsertShow(false)}
        onSave={handleSave}
        title={currentTitle}
        id={currentTitleId}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {titleList.map((item) => (
            <tr key={item.id} style={{ cursor: 'pointer' }}>
              <td>{item.id}</td>
              <td onClick={() => handleRowClick(item.name)}>{item.name}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-success btn-sm mr-1"
                  onClick={() => handleEditClick(item.name, item.id)}
                >
                  Edit
                </button>
                <ModalUpdateTitle
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  onSave={handleSave}
                  title={currentTitle}
                  id={currentTitleId}
                />
                <button type="button" className="btn btn-danger btn-sm mr-1" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
