# vandium-serverless

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

[Serverless](https://www.serverless.com) plugin allowing you to create new NodeJS 4.3 functions automatically wrapped with [vandium](http://vandium.io).

## Features

* Creates Serverless functions pre-wrapped with vanidum
* No need to remember wrap your Serverless functions in vandium manually
* Easy to use
* Integrates with Serverless Framework for AWS Lambda
* Supports Node JS 4.3.2

## Installation

* Install via npm in the root folder of your Serverless project.

```
npm install vandium-serverless --save
```

* Edit your ```s-project.json``` to include the ```vandium-serverless``` plugin.

```json
{
  "name": "yourprojectname",
  "custom": {},
  "plugins": [ "vandium-serverless" ]
}
```

## Getting Started

Run ```serverless function create``` to create a new function, as you would normally do with Serverless.

When prompted to select a runtime for the new function select 'nodejs4.3-vandium'.

```
Serverless: Please, select a runtime for this new Function
    nodejs4.3
    python2.7
  > nodejs4.3-vandium
    nodejs (v0.10, soon to be deprecated)
```

Your newly created function is a standard NodeJS 4.3 function wrapped with vandium.

```js
'use strict';

const vandium = require( 'vandium' );

/*
vandium.validation( {

    // your validation code here
    // firstName: vandium.types.string().min( 4 ).max( 80 ).required(),
    // lastName: vandium.types.string().min( 4 ).max( 80 ).required(),
    // age: vandium.types.number().integer().min( 0 ).max( 120 )
});
*/

module.exports.handler = vandium( function( event, context, callback ) {

    // your code goes here

    callback( null, 'Your Vandium wrapped Serverless function ran succesfully!!!' );
});
```
Vandium offers features such as input validation, SQL Injection detection, and JWT authentication. For a full list of features and instructions visit the  [vandium](http://vandium.io) project page.

## Packaging

In order to use the Vandium wrapper, Vandium must be installed as a third party dependency.  The ```require( 'vandium' )``` is already included at the top of the template Lambda function code.  How you handle third party dependencies in your Serverless project is up to you, however here are several options based on the [Serverless documentation](http://docs.serverless.com/docs/function-configuration).

* Create a ```package.json``` file for each Lambda function, and run ```npm install vandium --save``` in each function directory.  This option results in smaller Lambda functions, but multiple ```node_modules``` and ```package.json``` paths to maintain.

* Use the ```package.json``` in the root directory of your Serverless project, and run ```npm install vandium --save``` there.  To use this option you will have to modify the ```handler``` property in the ```s-function.json``` files to include the full path to the function handler starting from the subdirectory in the project root directory.  It will look something like ```functionName/handler.handler``` or ```lib/functionName/handler.handler``` depending on how you store your functions.  This option will result in larger Lambda functions, since everything will be included in the Lambda function packaging, however there will only be one location for all dependencies (```node_modules``` and ```package.json```).

* You can store your dependencies anywhere you decide to place an additional ```node_modules``` and ```package.json```. Just remember your ```handler``` property must include a path starting in the directory where the dependencies are stored. That entire directory will get packaged when your function is deployed.  As an example,

```
parent
|
|-- functionName
|   |
|   |-- event.json
|   |
|   |-- handler.js
|   |
|   +-- s-function.json
|
|-- node_modules
|
+-- package.json
```

would require the handler property in ```s-function.json``` to look like ```"handler": "functionName/handler.handler"```

## Feedback

We'd love to get feedback on how you're using vandium-serverless and things we could add to make this tool better. Feel free to contact us at ```feedback@vandium.io```

## License

[BSD-3-Clause](https://en.wikipedia.org/wiki/BSD_licenses)
