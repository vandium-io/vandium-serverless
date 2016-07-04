'use strict';

const Promise = require( 'bluebird' );

module.exports = function( S ) {

    S.classes.RuntimeNode43Vandium = require( './lib/RuntimeNode43Vandium' ) ( S ) ;
    S.classes.Endpoint = require( './lib/EndpointVandium' ) ( S ) ;

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


                if( evt.options.runtime === 'nodejs4.3-vandium' ) {

                    evt.options.runtime = 'nodejs4.3';
                }

                const filePath = S.getProject().getRootPath( evt.options.path, 's-function.json' );

                const funcData = {

                    name: S.utils.readFileSync( filePath).name ,
                    runtime: evt.options.runtime
                };

                new S.classes.Function( funcData, filePath ).save();

                return resolve( evt );

            });
        }
    }
}
