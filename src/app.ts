import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
app.use(express.static(path.join(__dirname, './ui/dist/ui')));
app.use('*', (req, res) => {
    const indexPath = path.join(__dirname, './ui/dist/ui/index.html');
    res.sendFile(indexPath);
});
app.listen(port, () => console.log(`API server is listening on ${port}`));