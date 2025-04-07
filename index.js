import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import chalk from 'chalk';
import express from 'express';

const credentials = [
  { username: 'OK2307964', merchantcode: '745596917413339762307964OKCT9434CA02A4A6BB20C21BF6E86FCEB569', name: 'Elzy'}, // Elzy
  { username: 'OK2302797', merchantcode: '636099017404593512302797OKCT92E23EF79F155ACD5FCEF1F3407AE774', name: 'Canny' }, // Canny
  { username: 'OK2320842', merchantcode: '224598717422079872320842OKCT541A1B6BA772214292DAA7B103AC7AF6', name: 'Lau Store'}, // Lau Store
  { username: 'OK1666484', merchantcode: '863463217401195201666484OKCT0C35E392D85B6D4587E5D4153963E8B7', name: 'Roy' }, // 
  { username: 'OK2246540', merchantcode: '669040117377193032246540OKCTEC2622AB8B400DEDD09F773150DAF3A8' },
  { username: 'user6', merchantcode: 'code6' },
];

let currentIndex = 0;

const app = express();
const port = process.env.PORT || 3000;

async function fetch() {
  const { username, merchantcode } = credentials[currentIndex];
  try {
    const response = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${username}/${merchantcode}`);
    const data = response.data;
    const fileName = `mutasi_${currentIndex + 1}.json`;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    const currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(
      chalk.green.bold('INFO ') +
      chalk.green.bold(`[`) +
      chalk.white.bold(`${currentTime}`) +
      chalk.green.bold(`]: `) +
      chalk.cyan(`Data saved to ${fileName}`)
    );
  } catch (error) {
    console.error(chalk.red(`Error fetching for ${username}:`, error));
  }

  currentIndex = (currentIndex + 1) % credentials.length;
  setTimeout(fetch, 10000); // 10 detik interval
}

fetch();

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.get('/mutasi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 1 && id <= 6) {
    const filePath = `${process.cwd()}/mutasi_${id}.json`;
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } else {
    res.status(400).send('Invalid ID. Use 1 to 6.');
  }
});

app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});