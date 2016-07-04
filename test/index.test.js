'use strict';
/*jshint expr: true*/

const sinon = require( 'sinon' );

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;

describe( 'index.js', function() {

    let runtimeNode43VandiumStub;

    let endpointVandiumStub;

    let indexModule;

    let addHookStub = sinon.stub();

    let readFileSyncStub = sinon.stub().returns( { name: 'MyLambdaFunction' } );

    let getRootPathStub = sinon.stub().returns( '/this/is/a/full/path' );

    let saveStub = sinon.stub();

    let FunctionStub = sinon.stub().returns( {

        save: saveStub
    });


    let serverlessStub = {

        classes: {

            Plugin: class Plugin {},
            Function: FunctionStub
        },

        addHook: addHookStub,

        utils: {

            readFileSync: readFileSyncStub
        },

        getProject: function() {

            return {

                getRootPath: getRootPathStub
            }
        }
    };

    beforeEach( function() {

        runtimeNode43VandiumStub = sinon.stub().returns( 'runtimeNode43VandiumStub' );

        endpointVandiumStub = sinon.stub().returns( 'endpointVandiumStub' );

        indexModule = proxyquire( '../index', {

            './lib/RuntimeNode43Vandium': runtimeNode43VandiumStub,
            './lib/EndpointVandium': endpointVandiumStub
        });
    });

    it( 'set the serverless classes to our new classes', function() {

        indexModule( serverlessStub );

        expect( serverlessStub.classes ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.equal( 'runtimeNode43VandiumStub' );
        expect( serverlessStub.classes.Endpoint ).to.exist;
        expect( serverlessStub.classes.Endpoint ).to.equal( 'endpointVandiumStub' );
    });

    it( 'create a new instance of our plugin', function() {

        let vandiumServerless =  new ( indexModule( serverlessStub ) ) ();

        expect( vandiumServerless.name ).to.equal( 'VandiumServerless' );
    });

    it( 'add our plugin as a hook after the function create action has run', function( done ) {

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        vandiumServerless.registerHooks();

        expect( addHookStub.calledOnce ).to.be.true;
        expect( addHookStub.firstCall.args[ 1 ] ).to.eql( { action: 'functionCreate', event: 'post' } );

        done();
    });

    it( 'run our plugin hook method with vandium', function() {

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        let evt = {

            options: {

                path: 'this/is/a/path',
                runtime: 'nodejs4.3-vandium'
            }
        };

        vandiumServerless._hookPost( evt );

        expect( getRootPathStub.calledOnce ).to.be.true;
        expect( getRootPathStub.firstCall.args[ 0 ] ).to.equal( evt.options.path );
        expect( getRootPathStub.firstCall.args[ 1 ] ).to.equal( 's-function.json' );
        expect( readFileSyncStub.calledOnce ).to.be.true;
        expect( readFileSyncStub.firstCall.args[ 0 ] ).to.equal( '/this/is/a/full/path' );
        expect( FunctionStub.calledOnce ).to.be.true;

        expect( FunctionStub.firstCall.args[ 0 ] ).to.eql( {

            name: 'MyLambdaFunction',
            runtime: 'nodejs4.3'
        });

        expect( FunctionStub.firstCall.args[ 1 ] ).to.equal( '/this/is/a/full/path' );
        expect( saveStub.calledOnce ).to.be.true;
        expect( evt.options.runtime ).to.equal( 'nodejs4.3' );
    });

    it( 'run our plugin hook method without vandium', function() {

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        let evt = {

            options: {

                path: '/this/is/a/path',
                runtime: 'nodejs4.3'
            }
        };

        vandiumServerless._hookPost( evt );

        expect( evt.options.runtime ).to.equal( 'nodejs4.3' );
    });
});
