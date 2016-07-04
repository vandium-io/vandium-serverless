'use strict';

const sinon = require( 'sinon' );

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;

describe( 'index.js', function() {

    let runtimeNode43VandiumStub;

    let endpointVandiumStub;

    let indexModule;

    before( function() {

        runtimeNode43VandiumStub = sinon.stub().returns( 'runtimeNode43VandiumStub' );

        endpointVandiumStub = sinon.stub().returns( 'endpointVandiumStub' );

        indexModule = proxyquire( '../index', {

            './lib/RuntimeNode43Vandium': runtimeNode43VandiumStub,
            './lib/EndpointVandium': endpointVandiumStub
        });
    });

    it( 'normal operation', function() {

        let serverlessStub = {

            classes: {

                }
            }

        indexModule( serverlessStub );

        let classes = {

            RuntimeNode43Vandium: 'runtimeNode43VandiumStub',
            Endpoint: 'endpointVandiumStub'
        };

        expect( serverlessStub ).to.eql( { classes } );
    });
});
