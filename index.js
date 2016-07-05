'use strict';

const Promise = require( 'bluebird' );

const AUTHENTICATION_FAILURE_CODE = '403';

const VALIDATION_FAILURE_CODE = '422';

module.exports = function( S ) {

    S.classes.RuntimeNode43Vandium = require( './lib/RuntimeNode43Vandium' ) ( S ) ;
    // S.classes.Endpoint = require( './lib/EndpointVandium' ) ( S ) ;

    return class VandiumServerless extends S.classes.Plugin {

        constructor() {

            super();
            this.name = 'VandiumServerless';
        }

        registerHooks() {

            S.addHook( this._hookPost.bind( this ), {

                action: 'functionCreate',
                event:  'post'
            });

            return Promise.resolve();
        }

        _hookPost( evt ) {

            return new Promise( function( resolve, reject ) {

                const filePath = S.getProject().getRootPath( evt.options.path, 's-function.json' );

                let savedFunction = S.utils.readFileSync( filePath );

                if( savedFunction.runtime === 'nodejs4.3-vandium' ) {

                    if( savedFunction.endpoints.length > 0 ) {

                        if( !savedFunction.endpoints[ 0 ].responses ) {

                            savedFunction.endpoints[ 0 ].responses = {};
                        }

                        savedFunction.endpoints[ 0 ].responses[ AUTHENTICATION_FAILURE_CODE ] = {

                            selectionPattern: '^authentication error.*',
                            statusCode: AUTHENTICATION_FAILURE_CODE
                        };

                        savedFunction.endpoints[ 0 ].responses[ VALIDATION_FAILURE_CODE ] = {

                            selectionPattern: '^validation error.*',
                            statusCode: VALIDATION_FAILURE_CODE
                        }
                    }

                    savedFunction.runtime = 'nodejs4.3';
                }

                S.utils.writeFileSync( filePath, savedFunction );

                return resolve( evt );

            });
        }
    }
}
