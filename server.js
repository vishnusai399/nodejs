const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
app.use(bodyParser.json());

const port = 8000;

app.post('/process-single', (req, res) => {
  // Check if request body exists and contains the 'toSort' property
  if (!req.body || !req.body.toSort) {
    return res.status(400).json({ message: 'Missing required data in request body' });
  }

  const { toSort } = req.body;

  const startTime = process.hrtime();
  const sortedArrays = toSort.map(subArray => [...subArray].sort((a, b) => a - b));
  const endTime = process.hrtime();

  const timeTaken = Math.floor((endTime[0] * 1e9 + endTime[1]) - (startTime[0] * 1e9 + startTime[1])) / 1000000;

  res.json({
    sortedArrays,
    timeTaken,
  });
});

app.post('/process-concurrent', (req, res) => {
  // Check if request body exists and contains the 'toSort' property
  if (!req.body || !req.body.toSort) {
    return res.status(400).json({ message: 'Missing required data in request body' });
  }

  const { toSort } = req.body;

  const startTime = process.hrtime();
  const promises = toSort.map(subArray => new Promise((resolve) => resolve([...subArray].sort((a, b) => a - b))));

  Promise.all(promises).then((sortedSubArrays) => {
    const endTime = process.hrtime();

    const timeTaken = Math.floor((endTime[0] * 1e9 + endTime[1]) - (startTime[0] * 1e9 + startTime[1])) / 1000000;

    res.json({
      sortedArrays: sortedSubArrays,
      timeTaken,
    });
  });
});

http.createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
