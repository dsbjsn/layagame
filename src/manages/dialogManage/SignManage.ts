import SignModle from "../../modle/SignModle";
import ConfigData from "../../config/ConfigData";
import WxADUtil from "../../utils/WxADUtil";
import CoinModle from "../../modle/CoinModle";
import StaticData from "../../data/StaticData";
import BaseDialogManage from "../dialogManage/BaseDialogManage";

export default class SignManage extends BaseDialogManage {

    private day1: Laya.Sprite
    private day2: Laya.Sprite
    private day3: Laya.Sprite
    private day4: Laya.Sprite
    private day5: Laya.Sprite
    private day6: Laya.Sprite
    private day7: Laya.Sprite

    private daySprs: Array<any>;

    private isChecked = true;
    private checkBox: Laya.Sprite;
    private checkLb: Laya.Label;


    onEnable(): void {
        super.onEnable();
        this.contentSpr.y+=StaticData.offY;

        let cancelSpr = this.contentSpr.getChildByName("cancelSpr") as Laya.Sprite;
        let doSign = this.contentSpr.getChildByName("doSign") as Laya.Sprite;
        let signBox = this.contentSpr.getChildByName("signBox") as Laya.Box;

        cancelSpr.on(Laya.Event.CLICK, this, () => {
            this.owner.close();
        });

        doSign.on(Laya.Event.CLICK, this, () => {
            if (SignModle.getTodaySigned()) {
                this.owner.close();
            } else {
                if (this.isChecked) {
                    WxADUtil.adOrShare({
                        success: () => {
                            SignModle.sign(true);
                            this.owner.close();
                        },
                        fail: () => {
                            SignModle.sign(false);
                            this.owner.close();
                        }
                    });
                } else{
                    SignModle.sign(false);
                    this.owner.close();
                }
            }
        });  
        this.initSignDay();
        if (SignModle.getTodaySigned()) {
            doSign.loadImage("images/sign_tomorrow.png");
        }

        this.checkBox = this.contentSpr.getChildByName("checkBox") as Laya.Sprite;
        this.checkLb = this.contentSpr.getChildByName("checkLb") as Laya.Label;

        this.checkBox.visible = !SignModle.getTodaySigned();
        this.checkLb.visible = !SignModle.getTodaySigned();

        this.checkBox.on(Laya.Event.CLICK, this, this.checkAction);
        this.checkLb.on(Laya.Event.CLICK, this, this.checkAction);

    }
    checkAction() {
        this.isChecked = !this.isChecked;
        if (this.isChecked) {
            this.checkBox.loadImage("images/box_select.png");
        } else {
            this.checkBox.loadImage("images/box_unselect.png");
        }
    }


    initSignDay() {
        let signBox = this.contentSpr.getChildByName("signBox") as Laya.Box;
        this.day1 = signBox.getChildByName("day1") as Laya.Sprite;
        this.day2 = signBox.getChildByName("day2") as Laya.Sprite;
        this.day3 = signBox.getChildByName("day3") as Laya.Sprite;
        this.day4 = signBox.getChildByName("day4") as Laya.Sprite;
        this.day5 = signBox.getChildByName("day5") as Laya.Sprite;
        this.day6 = signBox.getChildByName("day6") as Laya.Sprite;
        this.day7 = signBox.getChildByName("day7") as Laya.Sprite;

        this.daySprs = [this.day1, this.day2, this.day3, this.day4, this.day5, this.day6, this.day7];

        this.setSignData();
    }

    setSignData() {
        for (let i = 0; i < this.daySprs.length; i++) {
            if (i < 6) {
                let daySignedBgSpr = this.daySprs[i].getChildByName("daySignedBgSpr") as Laya.Sprite;
                let dayBgSpr = this.daySprs[i].getChildByName("dayBgSpr") as Laya.Sprite;
                let dayLb = this.daySprs[i].getChildByName("dayLb") as Laya.Label;
                let coinLb = this.daySprs[i].getChildByName("coinLb") as Laya.Label;
                let maskSpr = this.daySprs[i].getChildByName("maskSpr") as Laya.Sprite;

                dayLb.text = "第" + (i + 1) + "天"
                coinLb.text = String(SignModle.coinNum[i]);

                if (i < SignModle.getSignDays()) {
                    daySignedBgSpr.visible = true;
                    maskSpr.visible = true;
                    dayBgSpr.visible = false;
                } else if (i == SignModle.getSignDays() && SignModle.getSignDays() < 5 && !SignModle.getTodaySigned()) {
                    daySignedBgSpr.visible = true;
                    maskSpr.visible = false;
                    dayBgSpr.visible = false;
                } else {
                    daySignedBgSpr.visible = false;
                    maskSpr.visible = false;
                    dayBgSpr.visible = true;
                }
            } else {
                let signAwardLb = this.daySprs[i].getChildByName("signAwardLb") as Laya.Label;
                let imgSpr = this.daySprs[i].getChildByName("imgSpr") as Laya.Sprite;
                let maskSpr = this.daySprs[i].getChildByName("maskSpr") as Laya.Sprite;
                if (SignModle.hadCarAward == 0) {
                    signAwardLb.text = SignModle.carAward.name;
                    imgSpr.loadImage(SignModle.carAward.img);
                    imgSpr.pos(SignModle.carAward.x, SignModle.carAward.y);
                } else {
                    signAwardLb.text = String(SignModle.coinNum[i])+" 金币";
                    imgSpr.loadImage("images/award_coin.png");
                }

                if (SignModle.getSignDays()==7 && SignModle.getTodaySigned()) {
                    maskSpr.visible=true;      
                }  else {
                    maskSpr.visible=false;  
                }
            }
        }
    }

    onDisable(): void {
        super.onDisable();
        Laya.Dialog.open(ConfigData.StartGameDialog);
    }
}