'use strict';
const Base = require('../../helpers/route');
const P = require('bluebird');
const { initializeApp, applicationDefault, cert, getApps, getApp } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { v4: uuidv4 } = require('uuid');
const errors = require('http-errors');
const _ = require('lodash');

const ACCOUNT = require('../../../credentials/logbook-avolar-testing-firebase-adminsdk-ks9ys-626cd2d7a3.json');

class Route extends Base {

     validate(req) {

          if (_.isEmpty(req.body.code)) {
               throw new errors.BadRequest('Bad request. Please set code.');
          }
          if (_.isEmpty(req.body.registration)) {
               throw new errors.BadRequest('Bad request. Please set registration.');
          }
          if (_.isEmpty(req.body.power)) {
               throw new errors.BadRequest('Bad request. Please set power.');
          }
          if (_.isEmpty(req.body.description)) {
               throw new errors.BadRequest('Bad request. Please set description.');
          }

          return P.resolve();
     }

     handler(req) {

          const context = {
               idUser: req.params.id,
               code: req.body.code,
               registration: req.body.registration,
               power: req.body.power,
               description: req.body.description,
               image: req.body.image || null
          }
          console.log(context);
          return P.bind(this)
               .then(() => this.getStore(context))
               .then(() => this.getDocRef(context))
               .then(() => this.save(context));
     }

     getStore(context) {
          !getApps().length && initializeApp({ credential: cert(ACCOUNT) });
          context.db = getFirestore();
     }

     getDocRef(context) {
          context.docRef = context.db.collection('users').doc(context.idUser).collection('airplanes').doc(uuidv4());
     }

     save(context) {
          
          const data = {
               code: context.code,
               registration: context.registration,
               power: context.power,
               description: context.description,
               image: context.image
          }

          return context.docRef.set(data)
               .then((res) => {
                    return { ...data, ...res };
               });
     }
}

module.exports = new Route().handlerize();