const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../Client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Index.html'));
});

app.post('/save-log', (req, res) => {
  const { example, inputValue, result } = req.body;

  const query = `
    INSERT INTO execution_logs (example_name, input_value, result)
    VALUES (?, ?, ?)
  `;

  db.query(query, [example, inputValue, result], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save execution' });
    }
    res.json({ message: 'Execution saved successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});