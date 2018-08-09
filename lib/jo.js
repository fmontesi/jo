/*
   Copyright 2018 Fabrizio Montesi <famontesi@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

(function() {
	function toJson( response )
	{
		return response.json();
	}

	function genError( response )
	{
		if( response.ok ) {
			return Promise.resolve( response );
		} else {
			let error = new Error( response.statusText );
			return response.json().then( json => {
				error.isFault = true;
				error.fault = json.error;
				throw error;
			} );
		}
	}

	function jolieFetch( operation, params )
	{
		if ( typeof params.service === 'undefined' ) {
			operation = '/' + operation;
		} else {
			if ( !params.service.startsWith( '/' ) ) {
				params.service = '/' + params.service;
			}
			operation = '/!' + params.service + '!/' + operation;
		}
		params.headers = { "Content-Type": "application/json" };
		params.body = JSON.stringify( params.data );

		if ( typeof params.method === 'undefined' ) {
			params.method = 'POST';
		}

		return fetch( operation, params ).then( genError ).then( toJson );
	}

	var proxyBuilder = function( service ) {
		return new Proxy( {}, {
			get: function( target, prop, receiver ) {
				return function( params ) {
					params.service = service;
					return jolieFetch( prop, params );
				}
			}
		} );
	}

	window.Jo = new Proxy( proxyBuilder, {
		get: function( target, prop, receiver ) {
			return function( params ) {
				return jolieFetch( prop, params );
			}
		}
	} );

	window.JoHelp = {
		parseError: error => {
			if ( error.isFault ) {
				return Promise.reject( JSON.stringify( error.fault ) );
			} else {
				return Promise.reject( error.message );
			}
		}
	};
}());
