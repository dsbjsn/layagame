// require('utils/ald-game.js')

"undefined"!=typeof swan && "undefined"!=typeof swanGlobal?(require("swan-game-adapter.js"),

require("libs/laya.bdmini.js")):"undefined"!=typeof wx &&(require("weapp-adapter.js"),
require("libs/laya.wxmini.js")),

window.loadLib=require,

require("index.js");