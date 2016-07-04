'use strict';
/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const endpointVandium = require( '../../lib/EndpointVandium' );


class Endpoint {

    constructor() {

        this.responses = {};
    }
}


describe( 'EndpointVandium', function() {

    let serverless = {

        classes: {

            Endpoint
        }
    };

    it( 'nodejs4.3-vandium runtime', function() {

        let pluginClass = endpointVandium( serverless );

        expect( pluginClass.name ).to.equal( 'EndpointVandium' );

        let func = { runtime: 'nodejs4.3-vandium' };

        let plugin = new pluginClass( {}, func );

        let http403 = {

            selectionPattern: 'authentication.*',
            statusCode: '403'
        };

        let http422 = {

            selectionPattern: 'validation.*',
            statusCode: '422'
        };

        expect( plugin ).to.be.an.instanceof( Endpoint );
        expect( plugin.responses ).to.exist;
        expect( plugin.responses[ '403' ]).to.exist;
        expect( plugin.responses[ '403' ]).to.eql( http403 );
        expect( plugin.responses[ '422' ]).to.exist;
        expect( plugin.responses[ '422' ]).to.eql( http422 );
    });

    it( 'other runtime', function() {

        let pluginClass = endpointVandium( serverless );

        expect( pluginClass.name ).to.equal( 'EndpointVandium' );

        let func = { runtime: 'nodejs4.3' };

        let plugin = new pluginClass( {}, func );

        expect( plugin ).to.be.an.instanceof( Endpoint );
        expect( plugin.responses ).to.exist;
        expect( plugin.responses[ '403' ]).to.not.exist;
        expect( plugin.responses[ '422' ]).to.not.exist;
    });
});
