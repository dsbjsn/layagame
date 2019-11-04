import ConfigData from "../../config/ConfigData";
import LeadOutGrid2RunTime from "../../runtimes/LeadOutGrid2RunTime";
import BaseDialogManage from "../dialogManage/BaseDialogManage";
import StaticData from "../../data/StaticData";

export default class OthersGameDialog extends BaseDialogManage {
    bgSpr:Laya.Sprite;
    close:Laya.Sprite;
    leadOut:LeadOutGrid2RunTime

    findView(){
        this.close=this.contentSpr.getChildByName("_close") as Laya.Sprite;
        this.leadOut=this.contentSpr.getChildByName("listSpr2") as LeadOutGrid2RunTime;
        this.bgSpr=this.contentSpr.getChildByName("bgSpr") as Laya.Sprite;
    }

    initView(){
        this.close.on(Laya.Event.CLICK,this,()=>{
            this.owner.close();
            Laya.Dialog.open(ConfigData.StartGameDialog); 
        })

        this.leadOut.setAldPois(CustomAction.OthersGamesDialog_Dc);
    }

    adapterWindow(){
        super.adapterWindow();
        this.close.y+=StaticData.offY;
        this.leadOut.y+=StaticData.offY;
        this.bgSpr.y+=StaticData.offY;
    }
}