const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static('public'));

// Dynamic route to serve any HTML file from 'views'
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'views', `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err); // Log the error
            res.status(404).send('Page not found');
        }
    });
});
// // Route for admin side (admin.html in views folder)
// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/admin.html'));
// });

// // Route for user side (vote-code.html in views folder)
// app.get('/user', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/vote-code.html'));
// });

// //
// //
// //
// //
// //
// // Route for calendar.html in views folder
// app.get('/calendar', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/calendar.html'));
// });

// // Route for create.html in views folder
// app.get('/create', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/create.html'));
// });

// // Route for liste-event.html in views folder
// app.get('/liste-event', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/liste-event.html'));
// });

// // Route for questions.html in views folder
// app.get('/questions', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/questions.html'));
// });

// // Route for ressource.html in views folder
// app.get('/ressource', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/ressource.html'));
// });

// // Route for voteur-attente.html in views folder
// app.get('/voteur-attente', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/voteur-attente.html'));
// });

// // Route for voteur-attente.html in views folder
// app.get('/voteur-event', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/voteur-event.html'));
// });

// // Route for voteur-attente.html in views folder
// app.get('/voteur-question', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views/voteur-question.html'));
// });

// Redirect root URL to /user
app.get('/', (req, res) => {
    res.redirect('/user');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
