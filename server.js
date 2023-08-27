const express = require('express');
const app = express();
const port = 3000; // You can choose any available port
require('./config/mongoose');

app.use(express.urlencoded({extended: true}));
app.use('/', require('./routes'));  // server will jump to routers file . By defult it will go to index.js file
app.set('view engine', 'ejs');
app.set('views', './views'); 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
