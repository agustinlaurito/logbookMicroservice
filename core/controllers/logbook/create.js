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

          if(_.isEmpty(req.body.date)){
               throw new errors.BadRequest('Bad request. Please set date.');
          }
          if(_.isDate(req.body.date)){
               throw new errors.BadRequest('Bad request. Please set a valid date.');
          }
          if(_.isEmpty(req.body.departureDate)){
               throw new errors.BadRequest('Bad request. Please set departureDate.');
          }
          if(_.isEmpty(req.body.arrivalDate)){
               throw new errors.BadRequest('Bad request. Please set arrivalDate.');
          }
          if(_.isEmpty(req.body.departureAirport)){
               throw new errors.BadRequest('Bad request. Please set from.');
          }
          if(_.isEmpty(req.body.arrivalAirport)){
               throw new errors.BadRequest('Bad request. Please set to.');
          }
          if(_.isEmpty(req.body.purpose)){
               throw new errors.BadRequest('Bad request. Please set purpose.');
          }
          if(_.isEmpty(req.body.aircraft)){
               throw new errors.BadRequest('Bad request. Please set aircraft.');
          }
          if(_.isEmpty(req.body.times)){
               throw new errors.BadRequest('Bad request. Please set times.');
          }
          if(_.isEmpty(req.body.landings)){
               throw new errors.BadRequest('Bad request. Please set landings.');
          }
          console.log(req.body);
          return P.resolve();
     }

     handler(req){

          const context = {
               idUser: req.params.id,
               date: req.body.date,
               departureDate: req.body.departureDate,
               arrivalDate: req.body.arrivalDate,
               departureAirport: req.body.departureAirport,
               arrivalAirport: req.body.arrivalAirport,
               purpose: req.body.purpose,
               aircraft: req.body.aircraft,
               times: req.body.times,
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
               departureDate: context.departureDate,
               arrivalDate: context.arrivalDate,
               departureAirport: context.departureAirport,
               arrivalAirport: context.arrivalAirport,
               purpose: context.purpose,
               aircraft: context.aircraft,
               times: context.times,
               landings: context.landings,
               createdAt: Timestamp.now(),   
          }
          return context.docRef.set(data)
               .then((res) => {
                    return {...data, ...res};
               });
     }
}

module.exports = new Route().handlerize();