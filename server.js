const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const routes = require('./routes/index');

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the React app's build directory
console.log(__dirname)
app.use(express.static(path.join(__dirname, 'split_wisely_react/build')));

// Define routes
app.use('/', routes);

// Catch-all handler to send back the React app's index.html file for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'split_wisely_react/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


  