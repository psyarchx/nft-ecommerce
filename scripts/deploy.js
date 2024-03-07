async function main() {
  // Obtém a instância do contrato a ser implantado
  const NFT = await ethers.getContractFactory("SimpleNFT");

  // Faz a implantação do contrato
  const nft = await NFT.deploy(); // Adicione os argumentos do construtor se houver

  await nft.deployed();

  console.log("SimpleNFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
