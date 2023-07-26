import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [wallet, setWallet] = useState("")
  const [nfts, setNfts] = useState([])
  const [tokens, setTokens] = useState([])
  const [Balance, setBalance] = useState([])

  async function requestConnect() {
    console.log("requestConnect")
    if (window.ethereum) {
      console.log("there's eth wallet")

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setWallet(accounts[0])
        const { data } = await axios.post("http://localhost:3001/getdata", {
          wallet: accounts[0],
        })
        setBalance(data.native)
        setTokens(data.tokens)
        setNfts(data.nfts)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log("there's no eth wallet")
    }
  }

  return (
    <div className='App'>
      {!wallet && <button onClick={requestConnect}>Connect To Metamask</button>}

      {wallet && <h3>Your Wallet address is {wallet}</h3>}
      {wallet && Balance.length > 0 && (
        <div>
          <h2>Your Balance</h2>
          <p>{Balance}</p>
          <h2>Your Tokens Are</h2>
          {tokens.map((token) => (
            <p key={token}>{token}</p>
          ))}
          <h2>Your Nfts Are</h2>
          {nfts.map((nfts, index) => (
            <p key={index}>
              Collection {nfts.name}: Name {nfts.metadata.name}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
