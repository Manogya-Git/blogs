import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BlogList from './pages/BlogList'
import BlogsByCategory from './pages/BlogsByCategory'
import SingleBlog from './pages/SingleBlog'
import Navbar from './components/Navbar'

const App = () => {
  return (
    
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/category/:id" element={<BlogsByCategory />} />
        <Route path="/single_blog/:slug" element={<SingleBlog />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App