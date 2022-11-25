'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const allowlist = ['avolarapp.com.ar', 'localhost:3000'];


const contains = (arr,str) => {
  let contains = false;
  arr.forEach(element => {
    if(!str) return contains;
    if (str.indexOf(element) > -1) {
      contains = true;
    }

  });
  return contains;

}


const app = express();


app.enable('trust proxy');
app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => {
    if(origin === undefined) {
      callback(new Error('Not allowed by CORS'));
    }
    if(contains(allowlist, origin)) {
      callback(null, true);
    }else{
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

module.exports = app;