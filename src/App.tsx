import { useEffect, useState } from 'react';
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from 'web3';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AdvanceStorageContract from './build/contracts/AdvanceStorage.json';


const chainAndContracts = {
  chain: "0x539",
  contract: AdvanceStorageContract.networks[1690143709850].address, // mainnet
};

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<string>('')
  const [currentWallet, setCurrentWallet] = useState<string>('')
  const [contractInstance, setContractInstance] = useState<string>('')
  const [valuesInContract, setValuesInContract] = useState(0)

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider();
      console.log(provider)
      if (provider) {
        console.log("Ethereum successfully detected!");
        const chainId = await provider.request({
          method: "eth_chainId",
        });
        setChainId(chainId);
      } else {
        console.log("Please install/connect MetaMask!");
      }
    };
    getProvider();
  }, []);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts[0]) {
        setCurrentWallet(accounts[0]);
      } else {
        setIsConnected(false);
      }
    });

    window.ethereum.on("chainChanged", async (_chainId) => {
      setChainId(_chainId);
    });
  }, []);

  const getValuesInContract = async () => {
    const currentValueInContract = await contractInstance.methods.getAll().call();
    setValuesInContract(currentValueInContract.length)
    return currentValueInContract.length
  }

  useEffect(() => {
    if (contractInstance) {
      getValuesInContract();
    }
  }, [contractInstance]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const w3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]) {
          setCurrentWallet(accounts[0]);
          setIsConnected(true);
          //console.log(chainId, AdvanceStorageContract.networks[chainId]);
          const deployedNetwork = AdvanceStorageContract.networks[chainId];
          //console.log(deployedNetwork, chainId);
          const instance = new w3.eth.Contract(
            AdvanceStorageContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          instance.options.address = chainAndContracts.contract;
          setContractInstance(instance);
        }
      } catch (error) {
        throw new Error(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event)
    const inputValue = event.target.elements[0].value;
    await contractInstance.methods.add(inputValue).send({ from: currentWallet })
    const currentValue = await getValuesInContract();
    setValuesInContract(currentValue)
    event.target.elements[0].value = ''
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
        {!isConnected && (<button onClick={connectMetaMask} >
          Connect Wallet
        </button>)}
        {isConnected && (<form onSubmit={handleSubmit}><input type="text" /><button type="submit">submit</button></form>)}
        <p>
          Values in contract <code>{valuesInContract}</code>
        </p>
      </div >
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

