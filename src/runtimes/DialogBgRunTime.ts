import StaticData from "../data/StaticData";

export default class DialogBgRunTime extends Laya.Sprite {
    onAwake() {
        this.graphics.clear();
        this.graphics.drawRect(0, 0, StaticData.gameWidth, StaticData.gameHeight, "#000000");
        this.alpha = 0.8;
    }
}