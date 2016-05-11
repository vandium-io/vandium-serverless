'use strict';
/*jshint expr: true*/

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );

const DEFAULT_MESSAGE = 'Your Vandium wrapped Serverless function ran succesfully!!!';

describe( 'hanlder.js', function() {


    let handlerModule;

    let vandiumStub;

    before( function() {

        vandiumStub = sinon.stub().returnsArg( 0 );

        handlerModule = proxyquire( '../../templates/handler.js', {

            'vandium': vandiumStub
        });
    });

    it( 'normal operation', function() {

        let event = {};

        let context = {};

        let callback = sinon.stub();

        handlerModule.handler( event, context, callback );

        expect( callback.calledOnce ).to.be.true;
        expect( callback.withArgs( null, DEFAULT_MESSAGE ).calledOnce ).to.be.true;
    });
});
