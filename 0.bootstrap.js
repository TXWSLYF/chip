(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./node_modules/chip8/chip8.js":
/*!*************************************!*\
  !*** ./node_modules/chip8/chip8.js ***!
  \*************************************/
/*! exports provided: __wbg_set_wasm, Chip8, __wbg_random_9f310ce86e57ad05, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _chip8_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chip8_bg.wasm */ \"./node_modules/chip8/chip8_bg.wasm\");\n/* harmony import */ var _chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chip8_bg.js */ \"./node_modules/chip8/chip8_bg.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_set_wasm\", function() { return _chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_set_wasm\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Chip8\", function() { return _chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"Chip8\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_random_9f310ce86e57ad05\", function() { return _chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_random_9f310ce86e57ad05\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return _chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_throw\"]; });\n\n\n\nObject(_chip8_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_set_wasm\"])(_chip8_bg_wasm__WEBPACK_IMPORTED_MODULE_0__);\n\n\n\n//# sourceURL=webpack:///./node_modules/chip8/chip8.js?");

/***/ }),

/***/ "./node_modules/chip8/chip8_bg.js":
/*!****************************************!*\
  !*** ./node_modules/chip8/chip8_bg.js ***!
  \****************************************/
/*! exports provided: __wbg_set_wasm, Chip8, __wbg_random_9f310ce86e57ad05, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_set_wasm\", function() { return __wbg_set_wasm; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Chip8\", function() { return Chip8; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_random_9f310ce86e57ad05\", function() { return __wbg_random_9f310ce86e57ad05; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return __wbindgen_throw; });\nlet wasm;\nfunction __wbg_set_wasm(val) {\n    wasm = val;\n}\n\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachedUint8Memory0 = null;\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nfunction passArray8ToWasm0(arg, malloc) {\n    const ptr = malloc(arg.length * 1, 1) >>> 0;\n    getUint8Memory0().set(arg, ptr / 1);\n    WASM_VECTOR_LEN = arg.length;\n    return ptr;\n}\n\nfunction notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }\n/**\n*/\nclass Chip8 {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(Chip8.prototype);\n        obj.__wbg_ptr = ptr;\n\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_chip8_free(ptr);\n    }\n    /**\n    * @returns {Chip8}\n    */\n    static new() {\n        const ret = wasm.chip8_new();\n        return Chip8.__wrap(ret);\n    }\n    /**\n    * @returns {number}\n    */\n    static video_width() {\n        const ret = wasm.chip8_video_width();\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    static video_height() {\n        const ret = wasm.chip8_video_height();\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    memory() {\n        const ret = wasm.chip8_memory(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * @returns {number}\n    */\n    screen() {\n        const ret = wasm.chip8_screen(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    */\n    cycle() {\n        wasm.chip8_cycle(this.__wbg_ptr);\n    }\n    /**\n    */\n    update_timers() {\n        wasm.chip8_update_timers(this.__wbg_ptr);\n    }\n    /**\n    * @param {Uint8Array} data\n    */\n    load_rom(data) {\n        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.chip8_load_rom(this.__wbg_ptr, ptr0, len0);\n    }\n    /**\n    * @param {number} index\n    * @param {boolean} value\n    */\n    set_keypad(index, value) {\n        wasm.chip8_set_keypad(this.__wbg_ptr, index, value);\n    }\n}\n\nconst __wbg_random_9f310ce86e57ad05 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');\n\nfunction __wbindgen_throw(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./node_modules/chip8/chip8_bg.js?");

/***/ }),

/***/ "./node_modules/chip8/chip8_bg.wasm":
/*!******************************************!*\
  !*** ./node_modules/chip8/chip8_bg.wasm ***!
  \******************************************/
/*! exports provided: memory, __wbg_chip8_free, chip8_new, chip8_video_width, chip8_video_height, chip8_memory, chip8_screen, chip8_cycle, chip8_update_timers, chip8_load_rom, chip8_set_keypad, __wbindgen_malloc */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./chip8_bg.js */ \"./node_modules/chip8/chip8_bg.js\");\n\n\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///./node_modules/chip8/chip8_bg.wasm?");

/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?");

/***/ })

}]);