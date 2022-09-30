from protocols.http import DefaultOperationHttpRequest
from console import Console
from string-utils import StringUtils
from @jolie.leonardo import WebFiles

/// Operations offered through the web interface
interface WebInterface {
RequestResponse:
	/// Generic GET request
	get( DefaultOperationHttpRequest )( undefined )
}

service Main {
	execution: concurrent

	embed Console as console
	embed WebFiles as webFiles
	embed StringUtils as stringUtils

	// Output port to contact api.chucknorris.io
	outputPort Chuck {
	Location: "socket://api.chucknorris.io:443/" // Use TCP/IP, port 443
	Protocol: https {
		.osc.search.method = "get"; // HTTP method for operation search
		.osc.search.alias = "jokes/search?query=%{query}" // URI template for operation search
	}
	RequestResponse: search // Request-response operation declaration (search)
	}

	inputPort WebInput {
		location: "socket://localhost:8080"
		protocol: http {
			format -> httpParams.format
			contentType -> httpParams.contentType
			cacheControl.maxAge -> httpParams.cacheControl.maxAge
			redirect -> redirect
			statusCode -> statusCode
			default.get = "get"
		}
		Redirects:
			ChuckNorris => Chuck
		interfaces: WebInterface
	}

	init {
		global.wwwDir = "web"
		format = "html"

		println@console( "Server started at " + global.inputPorts.WebInput.location )()
	}

	main {
		get( request )( response ) {
			scope( get ) {
				install(
					FileNotFound =>
						statusCode = 404,
					MovedPermanently =>
						redirect = get.MovedPermanently
						statusCode = 301
				)
				get@webFiles( {
					target = request.operation
					wwwDir = global.wwwDir
				} )( getResult )
				httpParams -> getResult.httpParams
				response -> getResult.content
			}
		}
	}
}
