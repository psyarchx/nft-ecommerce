require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    try {
        const NFT = await ethers.getContractFactory("contracts/mintNFT.sol:PhysicalProduct");
        const nft = await NFT.deploy();

        const parsedJSON = JSON.parse(fs.readFileSync("demonio.json"));
        const tokenURI = parsedJSON.URI;
        
        
        console.log(tokenURI);

        console.log(tokenURI);

        const recipientAddress = process.env.RECIPIENT_ADDRESS;

        
        if (!recipientAddress) {
            throw new Error("O endereço do destinatário não está definido no arquivo .env");
        }
        
        const tx = await nft.mintNFT(recipientAddress, tokenURI, { gasLimit: 1000000, blockGasLimit: 9000000000000000 });
        await tx.wait();
    } catch (error) {
        console.error("Erro durante o mint do NFT:", error);
        throw error;
    }
} ;

main().then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});