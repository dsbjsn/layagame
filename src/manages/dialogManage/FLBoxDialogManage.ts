import BaseDialogManage from "./BaseDialogManage";
import StaticData from "../../data/StaticData";
import WxADUtil from "../../utils/WxADUtil";
import CoinModle from "../../modle/CoinModle";

export default class FLBoxDialogManage extends BaseDialogManage{
    onAwake(){
        let bg = this.owner.getChildByName("bg") as Laya.Sprite;
        bg.graphics.clear();
        // bg.graphics.drawRect(0,0,StaticData.gameWidth,StaticData.gameHeight - (1334 - 1107),"#000000");
        bg.graphics.drawRect(0,0,StaticData.gameWidth,StaticData.gameHeight,"#000000");
        bg.alpha=0.8;
    }
   
    yesAction(){
        WxADUtil.adOrShare({
            success: () => {
                CoinModle.addCoin(100);
            }
        })
    }
}