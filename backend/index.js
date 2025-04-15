import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('backend running');
});

app.listen(PORT, () => {
    console.log(`backend running at http://localhost:${PORT}`);
});