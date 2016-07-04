'use strict';
/*jshint expr: true*/

const sinon = require( 'sinon' );

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;

describe( 'index.js', function() {

    let runtimeNode43VandiumStub;

    let endpointVandiumStub;

    let indexModule;

    beforeEach( function() {

        runtimeNode43VandiumStub = sinon.stub().returns( 'runtimeNode43VandiumStub' );

        endpointVandiumStub = sinon.stub().returns( 'endpointVandiumStub' );

        indexModule = proxyquire( '../index', {

            './lib/RuntimeNode43Vandium': runtimeNode43VandiumStub,
            './lib/EndpointVandium': endpointVandiumStub
        });
    });

    it( 'set the serverless classes to our new classes', function() {

        let serverlessStub = {

            classes: {

                    Plugin: class Plugin {}
                }
            }

        indexModule( serverlessStub );

        expect( serverlessStub.classes ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.equal( 'runtimeNode43VandiumStub' );
        expect( serverlessStub.classes.Endpoint ).to.exist;
        expect( serverlessStub.classes.Endpoint ).to.equal( 'endpointVandiumStub' );
    });

    it( 'create a new instance of our plugin', function() {

        // TODO expect the constructor to name our plugin
    });

    it( 'add our plugin as a hook after the function create action has run', function() {

        // TODO expect that addHook has been called with our plugin
    });

    it( 'run our plugin hook method', function() {

        // TODO expect that we read the s-function.json and wrote it again with the runtime (and the vandium removed)
    });
});
