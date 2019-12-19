/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
//const qr = require('qr-image');
// const sendEmailConfirmationFunction = require('./sendEmailConfirmation');
// const sendGuestEmailFunction = require('./sendGuestEmail');

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

   exports.sendUserConfirmation = functions.database.ref('/orders/{reference}').onWrite((change) => {
    const snapshot = change.after;
    const val = snapshot.val();
  
    const mailOptions = {
      from: '"JaylaShop" <noreply@firebase.com>',
      to: val.user.email,
      //cc: val.ccemail
    };
   
      const reference = 'Reference number: ' + val.reference;
    
      var title = 'Hi ' + val.user.firstname;
     
      var message1 = 'This is confirmation of your order for ' + val.totalitems  + ' item(s) of RudeBoyz merch.'
      var message2 = 'Total value of R' + String(val.purchasevalue) + '.00';
      var message3 = 'Delivery fee of R' + String(val.deliveryfee) + '.00';
      var message4 = 'You paid a total of R' +  String(val.totalpaid) + '.00';
       
      const from = 'With love from the JaylaShop xx'
    
      // Building Email message.
    
      mailOptions.subject = 'JaylaShop Order confirmation, reference number: ' + val.reference;
          mailOptions.html = '<br><strong>' + title +'</strong><br><strong>' + reference +'</strong><br><p>' + message1 +'</p><p>' + message2 +'</p><p>' + message3 +'</p><p>' + message4 +'</p><br><p>' + from +'</p>';
          // mailOptions.attachments = [  
          //    {
          //     filename: 'ticket.png',
          //     content: imageData,
          //     encoding: 'base64'
          //   }
          // ]
    
      return mailTransport.sendMail(mailOptions);
     
  });

  //exports.handler = function(mailTransport,change) {
    exports.sendOrderEmail = functions.database.ref('/orders/{reference}').onWrite((change) => {
    const snapshot = change.after;
    const val = snapshot.val();
  
    const mailOptions = {
      from: '"JaylaShop" <noreply@firebase.com>',
      to: 'info@jadeayla.com',
    };
    
     var subject = 'RudeBoyz order reference number: ' + val.reference;
     var title = 'Bought by ' + val.user.firstname + ' ' + val.user.surname + ' at  ' + val.user.email;
     var reference = 'Order refrence number: ' + val.reference;
    
    var message1 =  val.totalitems + ' item(s) bought to the value of ' + String(val.purchasevalue) + ' and delivery fee of R' + String(val.deliveryfee) + '.00, total paid R' + String(val.totalpaid) + '.00';
     var addressline1 = val.user.address.addressline2 == "" ? val.user.address.addressline1 : val.user.address.addressline1 + ', ' + val.user.address.addressline2
     let address = addressline1 + ', ' + val.user.address.suburb + ', ' + val.user.address.city + ', ' + val.user.address.region + ', ' + val.user.address.country + ', ' + val.user.address.postalcode
     
     let items = ""
     val.items.forEach(item => {
      items += JSON.stringify(item, null, 2) + '\n '
     })
    // let items = JSON.stringify(val.items, null, 2)
    
      mailOptions.subject = subject;
      mailOptions.html = '<strong>' + reference +'</strong><br><strong>' + title +'</strong><br><p>' + message1 +'</p><p>' + address +'</p><p>' + items +'</p><br><strong>Love, me xxx</strong>';
        
       
      return mailTransport.sendMail(mailOptions);
     
  });