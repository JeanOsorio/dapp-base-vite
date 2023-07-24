import Web3 from 'web3';

const getWeb3 = (): Promise<Web3> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        reject(new Error('Non-Ethereum browser detected. You should consider trying MetaMask!'));
      }
    });
  });
};

export default getWeb3;

