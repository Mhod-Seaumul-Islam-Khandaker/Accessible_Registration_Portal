const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Step 5: Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running!`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
});