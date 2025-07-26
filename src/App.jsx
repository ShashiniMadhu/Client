

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Student from "./pages/Student/Student";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
