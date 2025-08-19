import { useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
// import { getBackendStatus } from './api'
import './App.css'

function App() {
  const [backendMessage, setBackendMessage] = useState('')

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getBackendStatus()
        setBackendMessage(data.message)
      } catch (error) {
        setBackendMessage('Failed to connect to backend')
      }
    }
    fetchStatus()
  }, [])

  return (
    <div>
      {/* <p>Backend Status: {backendMessage}</p> */}
      <LandingPage />
    </div>
  )
}

export default App