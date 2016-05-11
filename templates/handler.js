'use strict';

const vandium = require( 'vandium' );

/*
vandium.validation( {

    // your validation code here
    // firstName: vandium.types.string().min( 4 ).max( 80 ).required(),
    // lastName: vandium.types.string().min( 4 ).max( 80 ).required(),
    // age: vandium.types.number().integer().min( 0 ).max( 120 )
});
*/

module.exports.handler = vandium( function( event, context, callback ) {

    // your code goes here

    callback( null, 'Your Vandium wrapped Serverless function ran succesfully!!!' );
});
