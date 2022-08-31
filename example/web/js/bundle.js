/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../dist/jo.js":
/*!*********************!*\
  !*** ../dist/jo.js ***!
  \*********************/
/***/ ((module) => {

eval("(()=>{\"use strict\";var e={};(()=>{var t=e;function r(e){return e.json()}function o(e){return e.ok?Promise.resolve(e):e.json().then((t=>{const r={name:e.statusText,message:e.statusText,isFault:!0,fault:t.error};throw r.fault=t.error,r}))}function n(e,t){return void 0===t.service?e=\"/\"+e:(t.service.startsWith(\"/\")||(t.service=\"/\"+t.service),e=\"/!\"+t.service+\"!/\"+e),t.headers={\"Content-Type\":\"application/json\"},void 0===t.method&&(t.method=\"POST\"),void 0!==t.data&&(\"GET\"===t.method||\"HEAD\"===t.method?e+=\"?\"+JSON.stringify(t.data):t.body=JSON.stringify(t.data)),fetch(e,t).then(o).then(r)}function s(e,t){return void 0===t&&(t={}),void 0!==e&&(t.data=e),t}Object.defineProperty(t,\"__esModule\",{value:!0}),t.JoHelp=t.Jor=t.Jo=void 0;const i=e=>({get:(t,r)=>e(t,r,\"GET\"),post:(t,r)=>e(t,r,\"POST\"),delete:(t,r)=>e(t,r,\"DELETE\"),head:(t,r)=>e(t,r,\"HEAD\"),patch:(t,r)=>e(t,r,\"PATCH\"),options:(t,r)=>e(t,r,\"OPTIONS\"),put:(t,r)=>e(t,r,\"PUT\")});t.Jo=new Proxy((e=>new Proxy({},{get:(t,r,o)=>(t,o)=>((o=s(t,o)).service=e,n(r.toString(),o))})),{get:(e,t,r)=>(e,r)=>{const o=s(e,r);return n(t.toString(),o)}}),t.Jor=new Proxy((e=>new Proxy({},{get:(t,r,o)=>i(((t,o,i)=>{const a=s(t,o);return a.service=e,a.method=i,n(r.toString(),a)}))})),{get:(e,t,r)=>(e,r)=>i(((e,r,o)=>{const i=s(e,r);return i.method=o,n(t.toString(),i)}))}),t.JoHelp={parseError:e=>e.isFault?Promise.reject(JSON.stringify(e.fault)):Promise.reject(e.message)}})(),module.exports=e})();\n\n//# sourceURL=webpack://example/../dist/jo.js?");

/***/ }),

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("// import { Jo,JoHelp } from \"../../dist/jo.js\";\nconst jo = __webpack_require__(/*! ../../dist/jo */ \"../dist/jo.js\")\nconsole.log(\"hello from js/index.js\")\n// Call operation search on the exposed service ChuckNorris\nconsole.log(jo)\njo.Jo(\"ChuckNorris\").search({ query: \"Computer\" })\n    .then(response => {\n        // Pick a random joke\n        // api.chucknorris.io returns jokes in a \"result\" array subelement\n        if (response.result) {\n            for (const joke of response.result) {\n                console.log(response.result)\n                console.log(joke)\n                const li = document.createElement(\"li\")\n                const text = document.createTextNode(joke.value)\n                li.appendChild(text)\n                document.getElementById('hello-jo').appendChild(li)\n            }\n        }\n    })\n    .catch(jo.JoHelp.parseError).catch(alert);\ndocument.getElementById('hello-webpack').innerText = 'Hello from webpack!'\n\n//# sourceURL=webpack://example/./js/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/index.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;