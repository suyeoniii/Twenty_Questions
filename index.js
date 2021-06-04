const express = require('./express');

const port = 3000;
express().listen(port);

console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`)