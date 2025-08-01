
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

function MainLayout() {
  return (
    <>
      <NavBar />
      <main className="flex-grow p-6 ">
        <Outlet />
      </main>
    </>

  )
}

export default MainLayout