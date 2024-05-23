import express from 'express';
import multer from 'multer';
import { NFTStorage, File } from 'nft.storage';
import cors from 'cors';
import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { Blob } from 'buffer';

const require = createRequire(import.meta.url);
const { exec } = require("child_process");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, 'imgs', 'phone.png');
const app = express();
const upload = multer({ dest: 'uploads/' });
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENjNEE5Y2RiMjIxN2IyMDAwNTE0NWUyMjUxNzg2N0IyQzlDMTE5RDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMTk0NjMxMjAyMSwibmFtZSI6ImlmcHMifQ.QvBbYA6rDaAHz6QELCeC5T_F70mpUY8AWlPfphoDW-M';
app.use(cors());

app.post('/api/mint', upload.single('image'), async (req, res) => {
    const { name, description } = req.body;
    const content = await fs.readFile(imagePath);
    
    try {
      // In Node.js environment, use Blob for NFT.Storage
      
      const imageFile = new File([content], 'phoneImage.png', { type: 'image/png' });
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
      const metadata = await nftstorage.store({
        name: req.body.name,
        description: req.body.description,
        image: imageFile,
        properties: {
          serial: req.body.serialNumber,
          owner: req.body.owner,
        }
      })

      var metadataURI = metadata.url.replace('ipfs://', 'https://ipfs.io/ipfs/');
      console.log('Metadata uploaded to:', metadataURI);

      const metadataJSON = { URI: metadataURI};
      fss.writeFileSync("demonio.json", JSON.stringify(metadataJSON));

      const command = `npx hardhat run scripts/mint-nft.cjs --network sepolia`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Error during NFT minting:", error);
            res.status(500).json({ success: false, message: 'Error minting NFT' });
            return;
        }
        if (stderr) {
            console.error('Error output from command:', stderr);
            res.status(500).json({ success: false, message: 'Error minting NFT' });
            return;
        }
        console.log('NFT minting successful!');
        res.json({ success: true, message: 'NFT minted successfully', metadataURI });
    });
    } catch (error) {
      console.error('Error during NFT minting or uploading:', error);
      res.status(500).json({ success: false, message: 'Error during NFT minting or uploading' });
    }
  });

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
