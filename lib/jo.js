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
	"use strict";

	function toJson( response )
	{
		return response.json();
	}

	function genError( response )
	{
		if( response.ok ) {
			return Promise.resolve( response );
		} else {
			const error = new Error( response.statusText );
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

		if ( typeof params.method === 'undefined' ) {
			params.method = 'POST';
		}

		if ( typeof params.data !== 'undefined' ) {
			if ( params.method === 'GET' || params.method === 'HEAD' ) {
				operation += "?" + JSON.stringify( params.data );
			} else {
				params.body = JSON.stringify( params.data );
			}
		}

		return fetch( operation, params ).then( genError ).then( toJson );
	}

	function initParams( data, params )
	{
		if ( typeof params === 'undefined' ) {
			params = {};
		}
		if ( typeof data !== 'undefined' ) {
			params.data = data;
		}
		return params;
	}

	const proxyBuilder = ( service ) => {
		return new Proxy( {}, {
			get: ( target, prop, receiver ) => {
				return ( data, params ) => {
					params = initParams( data, params );
					params.service = service;
					return jolieFetch( prop, params );
				}
			}
		} );
	}

	const buildHttpVerbs = ( buildFetch ) => { return {
		get: ( data, params ) => {
			return buildFetch( data, params, 'GET' );
		},
		post: ( data, params ) => {
			return buildFetch( data, params, 'POST' );
		},
		delete: ( data, params ) => {
			return buildFetch( data, params, 'DELETE' );
		},
		head: ( data, params ) => {
			return buildFetch( data, params, 'HEAD' );
		},
		patch: ( data, params ) => {
			return buildFetch( data, params, 'PATCH' );
		},
		options: ( data, params ) => {
			return buildFetch( data, params, 'OPTIONS' );
		},
		put: ( data, params ) => {
			return buildFetch( data, params, 'PUT' );
		}
	} };

	const resourceProxyBuilder = ( service ) => {
		return new Proxy( {}, {
			get: ( target, prop, receiver ) => {
				const buildFetch = ( data, params, method ) => {
					params = initParams( data, params );
					params.service = service;
					params.method = method;
					return jolieFetch( prop, params );
				};
				return buildHttpVerbs( buildFetch );
			}
		} )
	}

	window.Jo = new Proxy( proxyBuilder, {
		get: ( target, prop, receiver ) => {
			return ( data, params ) => {
				params = initParams( data, params );
				return jolieFetch( prop, params );
			}
		}
	} );

	window.Jor = new Proxy( resourceProxyBuilder, {
		get: ( target, prop, receiver ) => {
			return ( data, params ) => {
				const buildFetch = ( data, params, method ) => {
					params = initParams( data, params );
					params.method = method;
					return jolieFetch( prop, params );
				};
				return buildHttpVerbs( buildFetch );
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
