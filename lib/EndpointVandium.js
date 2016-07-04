'use strict';

module.exports = function( S ) {

    return class EndpointVandium extends S.classes.Endpoint {

        constructor( data, func ) {

            super( data, func );

            let _this = this;

            if( func.runtime === 'nodejs4.3-vandium' ) {

                _this.responses[ '403' ] = {

                    selectionPattern: 'authentication.*',
                    statusCode: '403'
                };

            }
        }
    }
}
