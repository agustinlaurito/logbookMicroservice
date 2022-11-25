'use strict';
const Base = require('../../helpers/route');
const P = require('bluebird');
const { initializeApp, applicationDefault, cert, getApps, getApp } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { v4: uuidv4 } = require('uuid');

const ACCOUNT = require('../../../credentials/logbook-avolar-testing-firebase-adminsdk-ks9ys-626cd2d7a3.json');

class Route extends Base{

     validate(req){
          return P.resolve();
     }

     handler(req){

          const context = {
               idUser: req.params.id,
               date: req.body.date,
               depTime: req.body.depTime,
               arrTime: req.body.arrTime,
               from: req.body.from,
               to: req.body.to,
               purpose: req.body.purpose,
               aircraft: req.body.aircraft,
               computed: req.body.computed,
               landings: req.body.landings
          }
          
          return P.bind(this)
               .then(() => this.getStore(context))
               .then(() => this.getDocRef(context))
               .then(() => this.save(context));
     }

     getStore(context){
          !getApps().length && initializeApp({credential: cert(ACCOUNT)});
          context.db = getFirestore();             
     }

     getDocRef(context){
          context.docRef = context.db.collection('users').doc(context.idUser).collection('logbook').doc(uuidv4());
     }

     save(context){
          const data = {
               date: context.date,
               depTime: context.depTime,
               arrTime: context.arrTime,
               from: context.from,
               to: context.to,
               purpose: context.purpose,
               aircraft: context.aircraft,
               computed: context.computed,
               landings: context.landings
          }
          return context.docRef.set(data); 
     }
}

module.exports = new Route().handlerize();