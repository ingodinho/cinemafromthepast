const {writeJSON} = require('./fileSystem');
const path = __dirname + '/../data/seats.json';

const createSeatsJSON = (rowSeats, rows, parquetRows) => {
  const seatsArray = [];
  for(let i = 1; i <= rows; i++) {
    for(let n = 1; n <= rowSeats; n++ ) {
      const seat = {
        id: `${i.toString().padStart(2, '0')}-${n.toString().padStart(2,'0')}`,
        row: i,
        rowSeat: n,
        class: i <= parquetRows ? 'parquet' : 'lodge',
        reserved: false
      }
      seatsArray.push(seat);
    }
  }
  writeJSON(path, seatsArray);
}

createSeatsJSON(6, 4, 2);

module.exports = {
  createSeatsJSON
}