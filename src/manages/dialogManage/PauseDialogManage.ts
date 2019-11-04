import WxADUtil from "../../utils/WxADUtil";
import GameManage from "../GameManage";
import ConfigData from "../../config/ConfigData";
import SoundUtil from "../../utils/SoundUtil";
import LeadOutListRunTime from "../../runtimes/LeadOutListRunTime";
import BaseDialogManage from "../dialogManage/BaseDialogManage";
import StaticData from "../../data/StaticData";
import SkinModle from "../../modle/SkinModle";
import CoinModle from "../../modle/CoinModle";

export default class PauseDialogManage extends BaseDialogManage { 
     continueSpr:Laya.Sprite
     replay:Laya.Sprite
     goHome:Laya.Sprite
     voiceSpr:Laya.Sprite

    findView(){
        this.continueSpr=this.contentSpr.getChildByName("continueSpr") as Laya.Sprite;
        this.goHome=this.contentSpr.getChildByName("goHome") as Laya.Sprite;
        this.voiceSpr=this.contentSpr.getChildByName("voiceSpr") as Laya.Sprite;
        this.replay=this.contentSpr.getChildByName("replay") as Laya.Sprite;
    }

    initView(){
        this.continueSpr.on(Laya.Event.CLICK,this,()=>{this.owner.close();});

        this.replay.on(Laya.Event.CLICK,this,()=>{
            this.owner.close();
            GameManage.getManage().restart();
        });
  
        this.goHome.on(Laya.Event.CLICK,this,()=>{
            SkinModle.freeCarSkinID = "0";
            SkinModle.freeEggSkinID = "0";
            CoinModle.doubleCoin(false);
            
            GameManage.manageOwner.refreshUI();
            Laya.Dialog.open(ConfigData.StartGameDialog);
        });

        this.voiceSpr.on(Laya.Event.CLICK,this,()=>{
            if(SoundUtil.isPlayMusic){
                this.voiceSpr.loadImage("images/no_voice.png");
                SoundUtil.stopMusic();
            }else{
                this.voiceSpr.loadImage("images/voice.png");
                SoundUtil.playMusic();  
            }
        });

        if(SoundUtil.isPlayMusic){
            this.voiceSpr.loadImage("images/voice.png");
        }else{
            this.voiceSpr.loadImage("images/no_voice.png");
        }

        this.horizontalLeadOutSpr.setAldPois(CustomAction.PauseDialog_Dc);
        this.horizontalLeadOutSpr.init(false);
    }

    adapterWindow(){
        super.adapterWindow();

        this.continueSpr.y+=StaticData.offY;
        this.goHome.y+=StaticData.offY;
        this.voiceSpr.y+=StaticData.offY;
        this.replay.y+=StaticData.offY;
        this.horizontalLeadOutSpr.y+=StaticData.offY;
        WxADUtil.showBannerAd();
    }
}