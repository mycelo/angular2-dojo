//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/'));

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

// Start the app by listening on the default Heroku port
//app.listen(process.env.PORT || 8080);
const port = process.env.PORT;
app.listen(port || 8081, function () {
    console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});