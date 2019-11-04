import StaticData from "../data/StaticData";

export default class BaseScript extends Laya.Script {
    onAwake() {
        if(this.owner instanceof  Laya.Dialog){
            this.owner.height = StaticData.gameHeight;
        }else{
            this.owner.scene.height = StaticData.gameHeight;
        }
    }
}