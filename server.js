const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/saveData', (req, res) => {
  const { name, text } = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let jsonData = JSON.parse(data);
    
    // Generate a new ID (assuming IDs are integers)
    const newId = jsonData.voices.length + 1;

    // Append the new ID to the name
    const newName = `${name}new${newId}`;

    // Add the new voice entry to the array
    jsonData.voices.push({ id: newId, name: newName, text });

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
