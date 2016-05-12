'use strict';
/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );

const runtimeNode43Vandium = require( '../../lib/RuntimeNode43Vandium' );

// class stub
class RuntimeNode43 {

}

describe( 'RuntimeNode43Vandium', function() {

    it( 'normal operation', function() {

        let serverless = {

            classes: {

                RuntimeNode43
            },

            utils: {

                writeFile: sinon.stub().returns( Promise.resolve( 'writeFile!' ) )
            }
        };

        let pluginClass = runtimeNode43Vandium( serverless );

        expect( pluginClass.name ).to.equal( 'RuntimeNode43Vandium' );
        expect( pluginClass.getName() ).to.equal( 'nodejs4.3-vandium' );

        let plugin = new pluginClass();

        expect( plugin ).to.be.an.instanceof( RuntimeNode43 );

        expect( plugin.getName( 'aws' ) ).to.equal( 'nodejs4.3' );

        expect( plugin.getName( 'other' ) ).to.equal( 'nodejs4.3-vandium' );

        let func = {

            save: sinon.stub().returns( Promise.resolve( 'save!' ) ),

            getRootPath: sinon.stub().returnsArg( 0 )
        };

        return plugin.scaffold( func )
            .then( function( results ) {

                expect( results.length ).to.equal( 3 );
                expect( results ).to.eql( [ 'save!', 'writeFile!', 'writeFile!' ] );

                expect( func.save.calledOnce ).to.be.true;
                expect( func.save.withArgs().calledOnce ).to.be.true;

                expect( serverless.utils.writeFile.calledTwice ).to.be.true;
                expect( serverless.utils.writeFile.firstCall.args[0] ).to.equal( 'handler.js' );
                expect( serverless.utils.writeFile.firstCall.args[1] ).to.be.instanceof( Buffer );
                expect( serverless.utils.writeFile.withArgs( 'event.json', {} ).calledOnce ).to.be.true;
            });
    })
})
