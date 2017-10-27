//{{{ the opensource libs under the project
var assert = require('assert');
var Hapi   = require('hapi');
var Joi    = require('joi');
var Vision = require('vision');
var server = new Hapi.Server({ debug: {"request": ["error", "uncaught"]} })
var validator = require('validator'); // github.com/chriso/validator.js
//}}}
//{{{ jos handlers
var register_fields = {
  name  : Joi.string().required(),
  email : Joi.string().email().required()
};
//}}}
//{{{ error handler using jos
/**
 * extract_validation_error does what its name suggests
 * given that the error is not in a very useable format we
 * need to extract it into a simple set of key:value pairs
 * @param {Object} error see: http://git.io/vcwiU
 * @returns {Object} err - the simplified error object
 */
function extract_validation_error(error){
  var key = error.data.details[0].path;
  err = {}
  err[key] = {
    class   : 'input-error',                // css class
    message : error.data.details[0].message // Joi error message
  }
  return err;
}
//}}}
//{{{ the return errors which pop up in use cases
/**
 * return_values extracts the values the person submitted if they
 * submitted the form with incomplete or invalid data so that
 * the form is not "wiped" each time it gets valdiated!
 * @param {Object} error - see: http://git.io/vciZd
 * @returns {Object} values - key:value pairs of the fields
 * with the value sent by the client.
 */
function return_form_input_values(error) {
  var values = {};
  var keys = Object.keys(error.data._object)
  keys.forEach(function(k){
    values[k] = validator.escape(error.data._object[k]);
  });
  return values;
}
//}}}
//{{{ map handler to plot the points
/**
 * register_handler is a dual-purpose handler that initially renders
 * the registration form but is re-used to display the form with any
 * Joi validation errors to the client until they input valid info
 * @param {Object} request - the hapi request object
 * @param {Object} reply - the standard hapi reply object
 * @param {String} source - source of the invalid field e.g: 'payload'
 * @param {Object} error - the error object prepared for the client
 * response (including the validation function error under error.data
 */

function map_handler(request , reply , source , error) {
// show the map canvas and all the functions on the map.
 if( !request.payload || request.payload && error){
   var errors,values;
   if(error && error.data){
     errors = extract_validation_error(error);
     values = return_form_input_values(error);
   }
   return reply.view('map',{
     title :'Map'+request.server.version,
     error : errors,
     values : values
   	  }).code( error ? 400 : 200);
   }
   else {
   	 return reply.view( 'register_vehicle',{
		 map : validator.escape(request.payload.map),
	 })
 }
}
//}}}
//{{{ registration of vehicles into the system
function register_vehicle_handler(request , reply , source , error) {
// show the map canvas and all the functions on the map.
 if( !request.payload || request.payload && error){
   var errors,values;
   if(error && error.data){
     errors = extract_validation_error(error);
     values = return_form_input_values(error);
   }
   return reply.view('register_vehicle',{
     title :'Map service:'+request.server.version,
     error : errors,
     values : values
   	  }).code( error ? 400 : 200);
   }
   else {
   	 return reply.view( 'register_vehicle',{
		 name : validator.escape(request.payload.name),
		 code : validator.escape(request.payload.alphanumric),
		 imei : validator.escape(request.payload.name),
		 phone: validator.escape(request.payload.name)
	 })
 }
}
//}}}
//{{{ registration of driver into the system
function register_driver_handler(request , reply , source , error) {
// show the map canvas and all the functions on the map.
 if( !request.payload || request.payload && error){
   var errors,values;
   if(error && error.data){
     errors = extract_validation_error(error);
     values = return_form_input_values(error);
   }
   return reply.view('register_vehicle',{
     title :'Map service:'+request.server.version,
     error : errors,
     values : values
   	  }).code( error ? 400 : 200);
   }
   else {
   	 return reply.view( 'register_driver',{
		 name : validator.escape(request.payload.name),
		 code : validator.escape(request.payload.alphanumric),
		 imei : validator.escape(request.payload.name),
		 phone: validator.escape(request.payload.name)
	 })
 }
}
//}}}
//{{{ simple register handler to register into the system
function register_handler(request, reply, source, error) {
  // show the registration form until its submitted correctly
  if(!request.payload || request.payload && error) {
    var errors, values; // return empty if not set.
    if(error && error.data) { // means the handler is dual-purpose
      errors = extract_validation_error(error); // the error field + message
      values = return_form_input_values(error); // avoid wiping form data
    }
    return reply.view('registration-form', {
      title  : 'Please Register to optana :' + request.server.version,
      error  : errors, // error object used in html template
      values : values  // (escaped) values displayed in form inputs
    }).code(error ? 400 : 200); // HTTP status code depending on error
  }
  else { // once successful, show welcome message!
    return reply.view('welcome-message', {
      name   : validator.escape(request.payload.name),
      email  : validator.escape(request.payload.email)
    })
  }
}
//}}}
//{{{ vechile handler for the system
function vac_handler(request, reply, source, error){
   var errors, values;
   if(error && error.data)
   if(!request.payload || request.payload && error) {
     errors = extract_validation_error(error);
     values = return_form_input_valuse(error);
   }
   return reply.view('vac',{
    title   : 'Short Gist of data :'+request.server.version,
    error   : errors,
    values  : valuses
   }).code(error ? 400 : 200);

}
//}}}
//{{{ server connection and the routes which are defined above
server.connection({ port: process.env.PORT || 8000 });
server.register(Vision, function (err) {
  assert(!err, 'Failed to load plugin: ', err); // FATAL ERROR!

  server.views({
      engines: { html: require('handlebars') },
      path: __dirname +'/'
  });

  server.route([{
    method: 'GET',
    path: '/',
    handler: register_handler
  },{
     method: 'GET',
     path: '/vac',
     handler: vac_handler
  },{
    method: 'GET' ,
    path: '/vcr',
    handler: register_vehicle_handler
  },{
    method: 'GET' ,
    path: '/vdr',
    handler: register_driver_handler
  },{
    method: 'GET',
    path: '/map',
    handler: map_handler
  },{
    method: '*',
    path: '/register',
    config: {
      validate: {
        payload : register_fields,
        failAction: register_handler
      }
    },
    handler: register_handler
  }]);
});
//}}}
//{{{ starting the server
server.start(function() {
  console.log('Visit: http://127.0.0.1:'+server.info.port);
});

module.exports = server;
//}}}
