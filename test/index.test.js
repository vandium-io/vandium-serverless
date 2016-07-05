'use strict';
/*jshint expr: true*/


const sinon = require( 'sinon' );

const proxyquire = require( 'proxyquire' );

const expect = require( 'chai' ).expect;


describe( 'index.js', function() {

    let runtimeNode43VandiumStub;

    let indexModule;

    let addHookStub = sinon.stub();

    let readFileSyncStub = sinon.stub().returns( { runtime: 'nodejs4.3' } );

    let writeFileSyncStub = sinon.stub();

    let getRootPathStub = sinon.stub().returns( '/this/is/a/full/path' );

    const evt = { options: { path: '/this/is/a/path' } };

    let serverlessStub = {

        classes: {

            Plugin: class Plugin {}
        },

        addHook: addHookStub,

        utils: {

            readFileSync: readFileSyncStub,
            writeFileSync: writeFileSyncStub
        },

        getProject: function() {

            return {

                getRootPath: getRootPathStub
            }
        }
    };


    beforeEach( function() {

        runtimeNode43VandiumStub = sinon.stub().returns( 'runtimeNode43VandiumStub' );

        indexModule = proxyquire( '../index', {

            './lib/RuntimeNode43Vandium': runtimeNode43VandiumStub
        });
    });


    it( 'set the serverless classes to our new classes', function() {

        indexModule( serverlessStub );

        expect( serverlessStub.classes ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.exist;
        expect( serverlessStub.classes.RuntimeNode43Vandium ).to.equal( 'runtimeNode43VandiumStub' );
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


    it( 'run our plugin hook method without vandium', function() {

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        vandiumServerless._hookPost( evt );

        expect( getRootPathStub.calledOnce ).to.be.true;
        expect( getRootPathStub.firstCall.args[ 0 ] ).to.equal( evt.options.path );
        expect( getRootPathStub.firstCall.args[ 1 ] ).to.equal( 's-function.json' );
        expect( readFileSyncStub.calledOnce ).to.be.true;
        expect( readFileSyncStub.firstCall.args[ 0 ] ).to.equal( '/this/is/a/full/path' );

        expect( writeFileSyncStub.lastCall.args[ 1 ] ).to.eql( { runtime: 'nodejs4.3' } );
    });


    it( 'run our plugin hook method with vandium but no endpoint', function() {

        serverlessStub.utils.readFileSync = sinon.stub().returns( { runtime: 'nodejs4.3-vandium', endpoints: [] } );

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        vandiumServerless._hookPost( evt );

        expect( writeFileSyncStub.lastCall.args[ 1 ] ).to.eql( { runtime: 'nodejs4.3', endpoints: [] } );
    });


    it( 'run our plugin hook method with vandium and an endpoint', function() {

        serverlessStub.utils.readFileSync = sinon.stub().returns( {

            runtime: 'nodejs4.3-vandium',
            endpoints: [ {
                responses: {
                    '400': {
                        statusCode: '400'
                    }
                }
            }]
        });

        let http403 = {

            selectionPattern: '^authentication error.*',
            statusCode: '403'
        };

        let http422 = {

             selectionPattern: '^validation error.*',
             statusCode: '422'
        };

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        vandiumServerless._hookPost( evt );

        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ] ).to.exist;
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses ).to.exist;
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses[ '400' ] ).to.eql( { statusCode: '400' } );
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses[ '403' ] ).to.eql( http403 );
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses[ '422' ] ).to.eql( http422 );
    });

    it( 'run our plugin hook method with vandium and a empty endpoint', function() {

        serverlessStub.utils.readFileSync = sinon.stub().returns( {

            runtime: 'nodejs4.3-vandium',
            endpoints: [ {} ]
        });

        let http403 = {

            selectionPattern: '^authentication error.*',
            statusCode: '403'
        };

        let http422 = {

             selectionPattern: '^validation error.*',
             statusCode: '422'
        };

        let vandiumServerless = new ( indexModule( serverlessStub ) ) ();

        vandiumServerless._hookPost( evt );

        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ] ).to.exist;
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses ).to.exist;
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses[ '403' ] ).to.eql( http403 );
        expect( writeFileSyncStub.lastCall.args[ 1 ].endpoints[ 0 ].responses[ '422' ] ).to.eql( http422 );
    });
});
