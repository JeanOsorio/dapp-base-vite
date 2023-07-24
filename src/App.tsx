import { useEffect, useState } from 'react'
import Web3 from 'web3'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isConnected, setIsConnecte] = useState(false)
  useEffect(() => {

  }, [])

  const handleConnect = async (event) => {
    event.preventDefault();
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      setIsConnecte(true);
    } else {
      setIsConnecte(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
