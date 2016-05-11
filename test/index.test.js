'use strict';

const sinon = require( 'sinon' );

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;

describe( 'index.js', function() {

    let runtimeNode43VandiumStub;

    let indexModule;

    before( function() {

        runtimeNode43VandiumStub = sinon.stub().returns( 'runtimeNode43VandiumStub' );

        indexModule = proxyquire( '../index', {

            './lib/RuntimeNode43Vandium': runtimeNode43VandiumStub
        });
    });

    it( 'normal operation', function() {

        let serverlessStub = {

            classes: {

                }
            }

        indexModule( serverlessStub );

        expect( serverlessStub ).to.eql( { classes: { RuntimeNode43Vandium: 'runtimeNode43VandiumStub' } } );
    });
});
