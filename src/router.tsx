import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookEditor from "./pages/Editor";
import NewProject from "./pages/NewProject";
import MyWorks from "./pages/MyWorks";


export default function Router(){
  return(
    <Routes>
      <Route path="/" index element={<Home/>}/>
      <Route path="/myworks" element={<MyWorks/>}/>
      <Route path="/newProject" element={<NewProject/>}/>
      <Route path="/editor" element={<BookEditor/>}/>
    </Routes>
  )
}