'use strict';

const Promise = require( 'bluebird' );

const fs = Promise.promisifyAll( require( 'fs' ) );

const path = require( 'path' );

module.exports = function( S ) {

    return class RuntimeNode43Vandium extends S.classes.RuntimeNode43 {

        static getName() {

            return 'nodejs4.3-vandium';
        }


        getName( providerName ) {

            if( providerName === 'aws' ) {

                return 'nodejs4.3';
            }
            else {

                return RuntimeNode43Vandium.getName();
            }
        }

        /**
        * Scaffold
        * - Create scaffolding for new Node.js function
        */
        scaffold( func ) {

            const handlerPath = path.resolve( __dirname, '..', 'templates', 'handler.js' );

            func.handler = 'handler.handler';

            return fs.readFileAsync( handlerPath )
                .then( function( handlerJs ) {

                    return  Promise.all([

                        func.save(),
                        S.utils.writeFile( func.getRootPath( 'handler.js' ), handlerJs ),
                        S.utils.writeFile( func.getRootPath( 'event.json' ), {} )
                    ])
                });
        }

    }
}
