const express = require('express');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors());

    //require('../routes/route')(app);

    return app;
};