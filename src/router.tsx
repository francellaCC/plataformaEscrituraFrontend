import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Auth0Provider } from "@auth0/auth0-react";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthCheck from "./components/AuthCheck";
import ProyectsLayout from "./layouts/ProyectsLayout";
import StoryReaderPage from "./pages/storys/StoryReaderPage";
import MyWorks from "./pages/users/MyWorks";
import NewProject from "./pages/storys/NewProject";
import UserProfile from "./pages/users/UserProfile";
import StoryEditor from "./pages/storys/StoryEditor";
import CreateNewPageContent from "./pages/storys/CreateNewPageContent";
import EditPageContent from "./pages/storys/EditPageContent";


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
          <Route path="/user/userProfile" element={<UserProfile />} />
          

        </Route>
        <Route element={<ProyectsLayout />}>
          <Route path="/newProject" element={<NewProject />} />
          <Route path="/storyEdit" element={<StoryEditor/>}/>
          <Route path="/editor/:idStory" element={<CreateNewPageContent />} />
          <Route path="/stories/:idStory/:idCahpter/edit" element={<EditPageContent/>}/>
          <Route path="/stories/:storyId/view" element={<StoryReaderPage/>}/>
          

        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/check" element={<AuthCheck />} />
      </Routes>
    </Auth0Provider>
  )
}