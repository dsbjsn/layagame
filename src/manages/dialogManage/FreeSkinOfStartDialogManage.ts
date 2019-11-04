import BaseDialogManage from "./BaseDialogManage";
import StaticData from "../../data/StaticData";
import GameManage from "../GameManage";
import WxADUtil from "../../utils/WxADUtil";
import SkinModle from "../../modle/SkinModle";
import EnumSkinUtil from "../../data/EnumHttp";
import AldUtil from "../../utils/AldUtil";

export default class FreeSkinOfStartDialogManage extends BaseDialogManage {
    private skinType;
    private skinId;

    textSpr: Laya.Sprite;

    findView() {
        this.textSpr = this.contentSpr.getChildByName("textSpr") as Laya.Sprite;
    }

    initView() {
        this.skinType = Math.random();
        if (this.skinType <= 0.7) {
            this.textSpr.loadImage("images/freeCarSkin.png");
        } else {
            this.textSpr.loadImage("images/freeEggSkin.png");
        }

        this.horizontalLeadOutSpr.setAldPois(CustomAction.SkinFreeDialog_DC);
        this.horizontalLeadOutSpr.init(true);
    }

    adapterWindow(){
        super.adapterWindow();
        this.textSpr.y+=StaticData.offY;
    }

    initData() {
        let skinId;
        if (this.skinType <= 0.7) {
            skinId = Math.round((Math.random() * 9)) + 2;
            skinId = Math.min(11, skinId);
            skinId = Math.max(2, skinId);
            if (skinId == 9) {
                skinId = 8;
            }
            SkinModle.freeCarSkinID = String(skinId);
        } else {
            skinId =  Math.round((Math.random() * 7)) + 2;
            skinId = Math.min(9, skinId);
            skinId = Math.max(2, skinId);
            SkinModle.freeEggSkinID = String(skinId);
        }
    }


    yesAction() {
        AldUtil.upload(CustomAction.SkinFreeDialog_Yes);
        WxADUtil.adOrShare({
            success: () => {
               
            },
            fail: () => {
                this.noAction();
            
            },
            error: () => {
                this.noAction();  
            }
        })
    }

    noAction() {
        AldUtil.upload(CustomAction.SkinFreeDialog_No);
        SkinModle.freeCarSkinID = "0";
        SkinModle.freeEggSkinID = "0";
    }
}