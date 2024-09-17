// scripts/pinataIntegration.js

const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const pinataJwt = process.env.PINATA_JWT;
const pinataGateway = process.env.GATEWAY_URL;

async function uploadToPinata() {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream("./hello-world.txt"));

    const response = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${pinataJwt}`
      }
    });

    console.log("Uploaded File:", response.data);
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

async function fetchFromPinata(ipfsHash) {
  try {
    const response = await axios.get(`https://${pinataGateway}/ipfs/${ipfsHash}`);
    console.log("Fetched File Data:", response.data);
  } catch (error) {
    console.error("Error fetching file:", error);
  }
}

// Example usage
(async () => {
  const ipfsHash = await uploadToPinata();
  if (ipfsHash) {
    await fetchFromPinata(ipfsHash);
  }
})();