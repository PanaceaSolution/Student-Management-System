import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import { Classes, Dashboard, Finance, Library, Logistics, Staffs, Students, Subjects, Teachers } from './pages/admin'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        {/* Admin */}
        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/library" element={<Library />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/finance" element={<Finance />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;