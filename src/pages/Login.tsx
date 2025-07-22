import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'

export default function Login() {
  const { loginWithRedirect } = useAuth0()



  const handleLogin = async () => {
    await loginWithRedirect();
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        <div className="flex flex-col space-y-3">
          <button className="flex items-center justify-center space-x-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100" onClick={handleLogin}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            <span>Continuar con Google</span></button>
        </div>
      </div>
    </div>
  )
}
