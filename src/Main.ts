import GameConfig from "./GameConfig";
import StaticData from "./data/StaticData";
import ConfigData from "./config/ConfigData";
import GameHttp from "./data/GameHttp";
import SkinModle from "./modle/SkinModle";
import LocalStorageUtil from "./utils/LocalStorageUtil";
import SoundUtil from "./utils/SoundUtil";
import StartGameInitModle from "./modle/StartGameInitModle";
import GamePlatform from "./adapter/GamePlatform";

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;

		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}
}

//激活启动类
new Main();

GamePlatform.init();
