'use strict';
const Base = require('../../helpers/route');
const P = require('bluebird');
const { initializeApp, applicationDefault, cert, getApps, getApp } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { v4: uuidv4 } = require('uuid');
const errors = require('http-errors');
const _ = require('lodash');

const ACCOUNT = require('../../../credentials/logbook-avolar-testing-firebase-adminsdk-ks9ys-626cd2d7a3.json');

class Route extends Base{

     validate(req){
          return P.resolve();
     }

     handler(req){

          const context = {
               idUser: req.params.id,
          }
          
          return P.bind(this)
               .then(() => this.getStore(context))
               .then(() => this.getData(context))
     }

     getStore(context){
          !getApps().length && initializeApp({credential: cert(ACCOUNT)});
          context.db = getFirestore();             
     }

     getData(context){
          const logbookRef = context.db.collection('users').doc(context.idUser).collection('logbook');
          console.log("logbookRef: ", logbookRef);

          return logbookRef.get()
               .then((snapshot) => {
                    if(!snapshot.docs.length){
                         return [];
                    }
                    return snapshot.docs.map((doc) => doc.data());
               });
     }

}

module.exports = new Route().handlerize();