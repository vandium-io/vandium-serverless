'use strict';

const AUTHENTICATION_CODE = '403';

const VALIDATION_CODE = '422';

module.exports = function( S ) {

    return class EndpointVandium extends S.classes.Endpoint {

        constructor( data, func ) {

            super( data, func );

            let _this = this;

            if( func.runtime === 'nodejs4.3-vandium' ) {

                _this.responses[ AUTHENTICATION_CODE ] = {

                    selectionPattern: 'authentication.*',
                    statusCode: AUTHENTICATION_CODE
                };

                _this.responses[ VALIDATION_CODE ] = {

                    selectionPattern: 'validation.*',
                    statusCode: VALIDATION_CODE
                }

            }
        }
    }
}
