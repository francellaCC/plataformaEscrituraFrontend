import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookEditor from "./pages/Editor";


export default function Router(){
  return(
    <Routes>
      <Route index element={<Home/>}/>
      <Route path="/editor" element={<BookEditor/>}/>
    </Routes>
  )
}