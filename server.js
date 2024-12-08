const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static('public'));

// Route for admin side (admin.html in views folder)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/admin.html'));
});

// Route for user side (vote-code.html in views folder)
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/vote-code.html'));
});

// Redirect root URL to /user
app.get('/', (req, res) => {
    res.redirect('/user');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
