require("dotenv").config();

async function main() {
    const NFT = await ethers.getContractFactory("SimpleNFT");
    const nft = await NFT.deploy();
  
    console.log("SimpleNFT deployed to:", nft.address);
  
    // Substitua esta URL pelo endereço onde seus metadados JSON estão hospedados
    const tokenURI = "https://psyarchx.github.io/nft-meta/nft-meta.json"
    const recipientAddress = process.env.RECIPIENT_ADDRESS;

    // Assegure-se de que recipientAddress está definido no seu arquivo .env
    if (!recipientAddress) {
        console.error("O endereço do destinatário não está definido no arquivo .env");
        process.exit(1);
    }

    const tx = await nft.mintNFT(recipientAddress, tokenURI);
    await tx.wait();
  
    console.log("NFT cunhado com sucesso.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });




    