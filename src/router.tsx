import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookEditor from "./pages/Editor";
import NewProject from "./pages/NewProject";
import MyWorks from "./pages/MyWorks";
import { Auth0Provider } from "@auth0/auth0-react";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthCheck from "./components/AuthCheck";


export default function Router() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    return <div>Error: Las variables de entorno de Auth0 no están configuradas.</div>;
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/auth/check",
        audience: "http://localhost:8080/api",
        scope: "openid profile email read:users"
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />

        <Route element={<MainLayout />}>
          <Route path="/home" index element={<Home />} />
          <Route path="/myworks" element={<MyWorks />} />
          <Route path="/newProject" element={<NewProject />} />
          <Route path="/editor" element={<BookEditor />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/check" element={<AuthCheck />} />
      </Routes>
    </Auth0Provider>
  )
}