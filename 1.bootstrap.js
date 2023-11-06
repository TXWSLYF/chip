(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var chip8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chip8 */ \"./node_modules/chip8/chip8.js\");\n/* harmony import */ var chip8_chip8_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chip8/chip8_bg.wasm */ \"./node_modules/chip8/chip8_bg.wasm\");\n/* harmony import */ var _keyMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keyMap */ \"./keyMap.js\");\n\n\n\n\nconst videoWidth = chip8__WEBPACK_IMPORTED_MODULE_0__[\"Chip8\"].video_width();\nconst videoHeight = chip8__WEBPACK_IMPORTED_MODULE_0__[\"Chip8\"].video_height();\nconst fileInputEl = document.getElementById(\"file-input\");\nconst screenEl = document.getElementById(\"screen\");\nconst screenContext = screenEl.getContext(\"2d\");\n\nconst drawScreenToCanvas = (screenData, width, height) => {\n  const imageData = new ImageData(width, height);\n\n  for (let i = 0; i < screenData.length; i++) {\n    const dataIndex = i * 4;\n\n    if (screenData[i] === 0) {\n      imageData.data[dataIndex] = 0;\n      imageData.data[dataIndex + 1] = 0;\n      imageData.data[dataIndex + 2] = 0;\n      imageData.data[dataIndex + 3] = 255;\n    } else if (screenData[i] === 1) {\n      imageData.data[dataIndex] = 255;\n      imageData.data[dataIndex + 1] = 255;\n      imageData.data[dataIndex + 2] = 255;\n      imageData.data[dataIndex + 3] = 255;\n    }\n  }\n\n  screenContext.putImageData(imageData, 0, 0);\n};\n\nfileInputEl.addEventListener(\"change\", (e) => {\n  const file = e.target.files && e.target.files[0];\n  if (file) {\n    const reader = new FileReader();\n\n    reader.onload = (e) => {\n      const result = e.target.result;\n      const rom = new Uint8Array(result);\n      const chip8 = chip8__WEBPACK_IMPORTED_MODULE_0__[\"Chip8\"].new();\n      chip8.load_rom(rom);\n\n      window.addEventListener(\"keydown\", (e) => {\n        const key = e.key;\n        const index = _keyMap__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findIndex((i) => i === key);\n\n        if (index !== -1) {\n          chip8.set_keypad(index, true);\n        }\n      });\n\n      window.addEventListener(\"keyup\", (e) => {\n        const key = e.key;\n        const index = _keyMap__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findIndex((i) => i === key);\n\n        if (index !== -1) {\n          chip8.set_keypad(index, false);\n        }\n      });\n\n      const renderLoop = () => {\n        const chipScreenPtr = chip8.screen();\n        const chipScreen = new Uint8Array(\n          chip8_chip8_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer,\n          chipScreenPtr,\n          videoWidth * videoHeight\n        );\n        drawScreenToCanvas(chipScreen, videoWidth, videoHeight);\n\n        for (let i = 0; i < 12; i++) {\n          chip8.cycle();\n        }\n\n        chip8.update_timers();\n        requestAnimationFrame(renderLoop);\n      };\n\n      renderLoop();\n    };\n\n    reader.readAsArrayBuffer(file);\n  }\n});\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./keyMap.js":
/*!*******************!*\
  !*** ./keyMap.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n 1 2 3 4\n Q W E R\n A S D F\n Z X C V \n*/\n\nconst keyMap = [\n  \"1\", \"2\", \"3\", \"4\",\n  \"q\", \"w\", \"e\", \"r\",\n  \"a\", \"s\", \"d\", \"f\",\n  \"z\", \"x\", \"c\", \"v\",\n];\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (keyMap);\n\n\n//# sourceURL=webpack:///./keyMap.js?");

/***/ })

}]);