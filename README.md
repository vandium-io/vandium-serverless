# vandium-serverless

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

This plugin allows you to create new NodeJS 4.3 functions in Serverless automatically wrapped with Vandium (www.vandium.io)

## Installation

* Run ```npm install vandium-serverless --save``` in the root folder of your Serverless project.

* Edit your s-project.json to include the 'vandium-serverless' plugin.

```
{
  "name": "yourprojectname",
  "custom": {},
  "plugins": [ "vandium-serverless" ]
}
```

## Usage

The purpose of this plugin is to create Lambda functions pre-wrapped with Vandium.

* Run 'serverless function create' to create a new function, as you would normally.

* When prompted to select a runtime for the new function select 'nodejs4.3-vandium'.

```
Serverless: Please, select a runtime for this new Function
    nodejs4.3
    python2.7
  > nodejs4.3-vandium
    nodejs (v0.10, soon to be deprecated)
```

## Writing Code

Your newly created function is a standard NodeJS 4.3 function wrapped with Vandium.  Vandium offers features such as input validation, SQL Injection detection, and JWT authentication.  For a full list of features and instructions on how to use them check out www.vandium.io.

## Dependencies

In order to use the Vandium wrapper, Vandium must be installed as a 3rd party dependency.  The ```require( 'vandium' )``` is already included at the top of the template Lambda function code.  How you handle 3rd party dependencies in your Serverless project is up to you, however here are several options based on the Serverless documentation: docs.serverless.com/docs/function-configuration.

* Create a 'package.json' file for each Lambda function, and run ```npm install vandium --save``` in each function directory.  This option results in smaller Lambda functions, but multiple 'node_modules' and 'package.json' paths to maintain.

* Use the 'package.json' in the root directory of your Serverless project, and run ```npm install vandium --save``` there.  To use this option you will have to modify the 'handler' property in the 's-function.json' files to include the full path to the function handler starting from the subdirectory in the project root directory.  It will look something like ```functionName/handler.handler``` or ```lib/functionName/handler.handler``` depending on how you store your functions.  This option will result in larger Lambda functions, since everything will be included in the Lambda function packaging, however there will only be one location for all dependencies ('node_modules' and 'package.json').

* You can store your dependencies anywhere you decide to place an additional 'node_modules' and 'package.json'.  Just remember your handler property path must start with a location that's parent directory is where the dependencies are stored, and that everything in that parent directory will get packaged into each Lambda function.
