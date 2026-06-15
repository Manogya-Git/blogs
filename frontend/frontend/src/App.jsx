import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BlogList from './pages/BlogList'
import BlogsByCategory from './pages/BlogsByCategory'
import SingleBlog from './pages/SingleBlog'
import Register from './pages/Register'
import PrivateRouter from './components/PrivateRouter'
import Login from './pages/Login'
import Signup from './pages/Register'
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import MyBlogs from './pages/MyBlogs'


const App = () => {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/category/:id" element={<BlogsByCategory />} />
        <Route path="/single_blog/:slug" element={<SingleBlog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/create" element={<CreateBlog />} />
<Route path="/blog/:id/edit" element={<EditBlog />} />
<Route path="/my-blogs" element={<MyBlogs />} />
        <Route element={<PrivateRouter/>}>
        </Route>
        <Route path='/login' element={<Login/>}/>  
        <Route path='/signup' element={<Signup/>}/>  
      </Routes>
    </BrowserRouter>
    
  )
}

export default App