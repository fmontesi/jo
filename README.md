# Jo

Jo (pronounced "Yo!") is a JavaScript library for web pages to (asynchronously) call the originating [Jolie](https://www.jolie-lang.org/) service.

# Usage

## Invoking an operation from the server

Syntax: `Jo.operation( data [, params] )` where `data` is a JSON object and the optional `params` are parameters for the underlying `fetch` operation (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Suppose the originating Jolie service has an operation `greet` that returns a string given a tree with subnode `name`, as follows.
(Nanoservices are great for examples, not so much in production: do this at home!)

```Jolie
greet( request )( response ) {
	response = "Hello " + request.name
}
```

You can invoke it with Jo as follows.

```javascript
Jo.greet( { name: "Homer" } )
	.then( response => console.log( response.$ ) ) // Jo uses promises
	.catch( error => {	// an error occurred
		if ( error.isFault ) {	// It's an application error
			console.log( JSON.stringify( error.fault ) );
		} else { // It's a middleware error
			console.log( error.message );
		}
	} );
```

## Catching errors, v2.0

Distinguishing application and middleware errors might be boring.
Use `JoHelp.parseError` (pronounced "Yo! Help!") to get the error message, if it is a middleware error, or a JSON.stringify of the carried data, if it is an application error.

```javascript
Jo.greet( { name: "Homer" } )
	.then( response => console.log( response.$ ) ) // Jo uses promises
	.catch( JoHelp.parseError ).catch( console.log );
```

## Redirections

Jo supports [redirection](https://jolielang.gitbook.io/docs/architectural-composition/redirection), the Jolie primitive to build API gateways.

Suppose that the originating Jolie service has a redirection table as follows.
```jolie
Greeter => GreeterService
```

If `GreeterService` has our operation `greet`, we can invoke it as follows.

```javascript
Jo("Greeter").greet( { name: "Homer" } )
	.then( response => console.log( response.$ ) ) // Jo uses promises
	.catch( error => {	// an error occurred
		if ( error.isFault ) {	// It's an application error
			console.log( JSON.stringify( error.fault ) );
		} else { // It's a middleware error
			console.log( error.message );
		}
	} );
```

If your API gateway points to another API gateway, you can nest them!

```javascript
Jo("SubGateway1/SubGateway2/Greeter").greet( { name: "Homer" } )
	.then( response => console.log( response.$ ) ) // Jo uses promises
	.catch( error => {	// an error occurred
		if ( error.isFault ) {	// It's an application error
			console.log( JSON.stringify( error.fault ) );
		} else { // It's a middleware error
			console.log( error.message );
		}
	} );
```

## What's that response.$ ?

Jolie supports having basic values (strings, booleans, integers, etc.) in nodes, _in addition_ to a subtree, for example: `"Hey" { .name = "Homer" }`.
If you receive that in variable `x`, you can access the `"Hey"` in JavaScript as `x.$`.

# Installation

```
<script type="text/javascript" src="https://cdn.rawgit.com/fmontesi/jo/master/lib/jo.js"></script>
```

Or, download Jo (https://cdn.rawgit.com/fmontesi/jo/master/lib/jo.js) and use it locally.

Pull requests with better ways to distribute Jo are welcome.

# Dependencies

None. (I don't like dependencies.) Jo is based on [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is natively supported by modern browsers.
If you want to use Jo with older browsers, use a [polyfill for fetch](https://github.com/github/fetch).
