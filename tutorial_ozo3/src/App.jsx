import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import Upload from './Upload';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:title" element={<Detail />} />
        <Route path="/upload" element={<Upload />} />

      </Routes>
    </Router>
  );
};

export default App;
