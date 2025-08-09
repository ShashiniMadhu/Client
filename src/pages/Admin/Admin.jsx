import { Routes, Route } from 'react-router-dom';
import Header from './Header'; 
import Footer from '../../components/footer' ;
import Dashboard from './Dashboard';
import Sessions from './Sessions';
import Classes from './Classes';
import Mentors from './Mentors';
import Students from './Students';

function Admin() {
  return (
    <div>
        <Header/>
    <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />        <Route path="sessions" element={<Sessions />} />
        <Route path="classes" element={<Classes />} />
        <Route path="mentors" element={<Mentors />} />
        <Route path="students" element={<Students />} />
    </Routes>
        <Footer />
    </div>
  );
}

export default Admin;