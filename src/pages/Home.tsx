import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react";

function Home() {
  const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0()
  console.log(user)
  console.log(getAccessTokenSilently())
   useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          console.log('Access Token:', accessToken);
        } catch (error) {
          console.error('Error al obtener el Access Token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);
  return (
    <>
    Home
    </>
  )
}

export default Home
