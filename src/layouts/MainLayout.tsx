
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <main className="flex-grow p-6 bg-gray-50">
      <Outlet />
    </main>
  )
}

export default MainLayout