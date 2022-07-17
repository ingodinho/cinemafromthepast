const express = require('express');
const cors = require('cors');
const {v4: uuid} = require('uuid');
const {readJSON, writeJSON} = require('./modules/fileSystem');

const app = express();
const PORT = 9000;
const seatsPath = 'data/seats.json';
const pricesPath = 'data/prices.json';

/*
Plan:
Object with Seats, ids, status, price-class -> choose price in frontend
----done---- get seats -> send json with data
----done---- get dashboard -> send json with data, calc free seats, calc gross, send prices
----done---- put reservation-> send id, change-status
----done---- put price-> change prices, store in another json?
*/

// Middlewares
app.use(cors());
app.use(express.json());

// Logger
app.use((req,_,next)  => {
  console.log('New Request', req.method, req.url);
  next();
})

app.get('/', (_,res) => {
  res.send('it works');
})

app.get('/seatallocation', async (_,res) => {
  try {
    const seatsArray = await readJSON(seatsPath);
    res.json(seatsArray);
  }
  catch (error) {
    res.send(error);
  }
})

app.get('/dashboard', async (_,res) => {
  try {
    const [seatsArray, prices] = await Promise.all([readJSON(seatsPath), readJSON(pricesPath)]);
    const freeSeats = seatsArray.filter(seat => seat.reserved === false).length;
    // Anzahl besetzter Plätze Loge * Preis Loge
    const grossLodge = seatsArray.filter(seat => seat.class === 'lodge' && seat.reserved === true).length * prices.lodge;
    // Anzahl besetzter Plätze Parkett * Preis Parket
    const grossParquet = seatsArray.filter(seat => seat.class === 'parquet' && seat.reserved === true).length * prices.parquet;
    const grossTotal = grossLodge + grossParquet;
    res.json({freeSeats, grossTotal, grossLodge, grossParquet});
  }
  catch(error) {
    res.send(error);
  }
})

app.get('/prices', async (_,res) => {
  try {
    const currentPrices = await readJSON(pricesPath);
    res.json(currentPrices);
  }
  catch (error) {
    res.send(error);
  }
})

app.put('/seatreservation/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const seatsArray = await readJSON(seatsPath);
    const updatedArray = seatsArray.map(seat => {
      if(seat.id === id) {
        seat.reserved = !seat.reserved;
      }
      return seat;
    })
    await writeJSON(seatsPath, updatedArray);
    res.json(updatedArray);
  }
  catch(error) {
    res.send(error);
  }
})

app.put('/priceupdate', async (req,res) => {
  const newPrices = req.body;
  try {
    await writeJSON(pricesPath, newPrices);
    res.json(newPrices);
  }
  catch(err) {
    res.send(err);
  }
})

app.put('/resetseats', async (_,res) => {
  try {
    const seats = await readJSON(seatsPath);
    const resettedSeats = seats.map(el => {
      el.reserved = false;
      return el;
    })
    await writeJSON(seatsPath, resettedSeats);
    res.json(resettedSeats);
  }
  catch (error) {
    res.send(error);
  }
})

app.use((_,res) => {
  res.status(404).send('Sorry, Page not Found - 404')
})

app.listen(PORT, ()=> console.log('Server starts listening on Port: ', PORT));