const express = require("express")
require("dotenv").config()
const cors = require("cors")
// Import Moralis
const Moralis = require("moralis").default
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils")
const app = express()
const port = 3001
const chain = EvmChain.ETHEREUM

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

async function getDemoData(address) {
  // Get native balance
  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  })

  // Format the native balance formatted in ether via the .ether getter
  const native = nativeBalance.result.balance.ether

  // Get token balances
  const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  })

  // Format the balances to a readable output with the .display() method
  const tokens = tokenBalances.result.map((token) => token.display())

  // Get the nfts
  const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain,
  })

  // Format the output to return name, amount and metadata
  const nfts = nftsBalances.result.map((nft) => ({
    name: nft.result.name,
    amount: nft.result.amount,
    metadata: nft.result.metadata,
  }))

  return { native, tokens, nfts }
}

app.post("/getdata", async (req, res) => {
  const { wallet } = req.body

  try {
    // Get and return the crypto data
    const data = await getDemoData(wallet)
    res.status(200).send(data)
  } catch (error) {
    // Handle errors
    console.error(error)
    res.status(500)
    res.json({ error: error.message })
  }
})

// Add this a startServer function that initialises Moralis
const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  })

  app.listen(port, () => console.log("server start"))
}

// Call startServer()
startServer()
