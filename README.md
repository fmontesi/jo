# Jo

Access web APIs as JavaScript objects. Jo (pronounced "Yo!") is a modest and thin library to write simpler client code.

![Chuck Norris, Jo](https://fmontesi.github.io/assets/jo-demo-chuck/joke-workflow.png)

Jo supports both verb-oriented APIs (e.g., `/getJoke?{id:1}`) and resource-oriented APIs (e.g., `/jokes/1`).
You can use both interchangeably, which is particularly useful when you have to interact with microservices that adopt different API styles.

Jo can be used with any web server. It uses JSON as data format (we plan on adding more formats in the future). It includes native support for [Jolie](https://www.jolie-lang.org/) API Gateways (AKA [Jolie redirections](https://jolielang.gitbook.io/docs/architectural-composition/redirection)).

You can find a brief tutorial for building a microservice-based web application with Jo here: [https://fmontesi.github.io/2018/08/16/jo.html](https://fmontesi.github.io/2018/08/16/jo.html).

# Usage: Verb-oriented APIs

Verb-oriented APIs can be accessed through the global `Jo` object.

## Invoking an operation from the server

Syntax: `Jo.operation( [data, params] )` where
- `operation` is the operation you want to invoke;
- the optional `data` to be sent is a JSON object;
- the optional `params` are parameters for the underlying `fetch` operation (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), for example in case you need to specify HTTP headers.

Invoking this method returns a promise.

This method uses POST as default HTTP method. To change it, use the optional parameters. For example, to use GET: `Jo.operation( data, { method: 'GET' } )`.

### Example

Suppose the originating web server offers an operation `greet` that returns a string given a tree with subnode `name`.
(Nanoservices are great for examples, not so much for production: do this at home only!)

You can invoke it as follows.

```javascript
Jo.greet( { name: "Homer" } )
	.then( response => console.log( response.greeting ) ) // Jo uses promises
	.catch( error => {		// an error occurred
		if ( error.isFault ) {	// It's an application error
			console.log( JSON.stringify( error.fault ) );
		} else {		// It's a middleware error
			console.log( error.message );
		}
	} );
```

Here is how this operation would be implemented in a Jolie service.

```jolie
greet( request )( response ) {
	response.greeting = "Hello " + request.name
}
```

## Catching errors, the alternative way

Distinguishing application and middleware errors might be boring.
Use `JoHelp.parseError` (`JoHelp` is pronounced "Yo! Help!") to get that part done for you automatically. You will get a string containing the error message, if it is a middleware error, or a JSON.stringify of the carried data, if it is an application error.

```javascript
Jo.greet( { name: "Homer" } )
	.then( response => console.log( response.greeting ) )
	.catch( JoHelp.parseError ).catch( console.log );
```

## Jolie Redirections

Jo supports [redirection](https://jolielang.gitbook.io/docs/architectural-composition/redirection) (not to be confused with HTTP redirections), the Jolie primitive to build API gateways with named subservices. (Unnamed subservices in the gateway, obtained by [aggregation](https://jolielang.gitbook.io/docs/architectural-composition/aggregation), are available as normal operations, so they can be called with the previous syntax.)

Suppose that the originating Jolie service has a redirection table as follows.
```jolie
Redirects: Greeter => GreeterService
```

If `GreeterService` has our operation `greet`, we can invoke it as follows.

```javascript
Jo("Greeter").greet( { name: "Homer" } )
	.then( response => console.log( response.greeting ) )
	.catch( JoHelp.parseError ).catch( console.log );
```

If your Jolie API gateway points to another API gateway, you can nest them!

```javascript
Jo("SubGateway1/SubGateway2/Greeter").greet( { name: "Homer" } )
	.then( response => console.log( response.greeting ) )
	.catch( JoHelp.parseError ).catch( console.log );
```

# Usage: Resource-oriented APIs

Resource-oriented APIs can be accessed through the global `Jor` object.

Syntax: `Jor.resource.http_method( data [, params] )` where
- `resource` is the name of the resource you want to access;
- `http_method` is an HTTP method (use lowercase): `get`, `post`, `delete`, `put`, `head`, `patch`, or `options`;
- the `data` to be sent is a JSON object;
- the optional `params` are parameters for the underlying `fetch` operation (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

If `resource` has a name that cannot be written in JavaScript, you can use the alternative syntax `Jor["resource"].http_method( data [, params] )`.

### Example

Suppose the web server offers a resource `/jokes`, and you want to get all of them.

```javascript
Jor.jokes.get()
	.then( response => /* handle all the jokes */ )
	.catch( JoHelp.parseError ).catch( console.log );
```

## Redirections

Redirections are supported by `Jor` just as for verb-based APIs. Suppose the server offers the `/jokes` resource through the subservice `ChuckNorris`. Then we can access it as follows.

```javascript
Jor("ChuckNorris").jokes.get()
	.then( response => /* handle all the jokes */ )
	.catch( JoHelp.parseError ).catch( console.log );
```

# Installation

```html
<script type="text/javascript" src="https://cdn.rawgit.com/fmontesi/jo/master/lib/jo.js"></script>
```

Or, download Jo (https://cdn.rawgit.com/fmontesi/jo/master/lib/jo.js) and use it locally.

Pull requests with better ways to distribute Jo are welcome.

# Dependencies

There are no dependencies on other libraries. However, Jo uses some recent features offered by web browsers.

- Jo uses [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to perform asynchronous calls. If you want to use Jo with older browsers, use a [polyfill for fetch](https://github.com/github/fetch). Check which browsers support fetch here: https://caniuse.com/#feat=fetch.

- Jo uses some modern JavaScript features. [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) is used to implement the magic of calling the operations of your Jolie server as if they were native methods (`Jo.operation`). We also use [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Check which browsers support Proxy at https://caniuse.com/#feat=proxy, and which support arrow functions at https://caniuse.com/#feat=arrow-functions. If you want to use Jo in browsers that do not support these features, you can try compiling Jo with [Babel](https://babeljs.io/).

# FAQ

## How do I handle basic values in root nodes sent by Jolie? (AKA response.$)

In JSON, an element can either be a basic value (e.g., strings, numbers), an object, or an array.
In Jolie, there are no restrictions: an element is always a tree, and each node can contain _both_ a basic value and subnodes (similarly to markup languages).
For example, this is valid Jolie: `"Homer" { .children[0] = "Bart", .children[1] = "Lisa" }`. It gives a tree containing the string `Homer` in its root node, which has an array subnode `children` with two elements. If you receive this tree using `Jo` in variable `response`, you can access the value contained in the root node (`"Homer"` in our example) by `response.$`.
