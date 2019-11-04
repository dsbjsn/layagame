import StaticData from "../../data/StaticData";
import SoundUtil from "../../utils/SoundUtil";
import ConfigData from "../../config/ConfigData";
import GamePlatform from "../../adapter/GamePlatform";
import BaseDialogManage from "../dialogManage/BaseDialogManage";

export default class MuneDialogManage extends BaseDialogManage {
    private backSpr: Laya.Sprite;
    private bgImg: Laya.Image;
    private soundSpr: Laya.Sprite;
    private kfSpr: Laya.Sprite;
    private quanSpr: Laya.Sprite;
    private hotSpr: Laya.Sprite;
    private _back: Laya.Sprite;

    private wxbutton;
    onEnable(): void {
        super.onEnable();
        this.owner.popupEffect = new Laya.Handler(this, function (dialog: Dialog): void {
            dialog.x = -StaticData.gameWidth;
            dialog.y = 0;
            dialog.scaleX = 1;
            dialog.scaleY = 1;

            Laya.Tween.to(dialog, { x: 0, y: 0 }, 300, Laya.Ease.linearNone);
        });

        this.owner.closeEffect = new Laya.Handler(this, function (dialog: Dialog): void {
            Laya.Tween.to(dialog, { x: -StaticData.gameWidth, y: 0 }, 500, Laya.Ease.linearNone);
        });


        this.bgImg = this.owner.getChildByName("bgImg") as Laya.Image;
        this.backSpr = this.owner.getChildByName("backSpr") as Laya.Sprite;
        this.soundSpr = this.owner.getChildByName("soundSpr") as Laya.Sprite;
        this.kfSpr = this.owner.getChildByName("kfSpr") as Laya.Sprite;
        this.quanSpr = this.owner.getChildByName("quanSpr") as Laya.Sprite;
        this.hotSpr = this.owner.getChildByName("hotGameSpr") as Laya.Sprite;
        this._back = this.owner.getChildByName("_back") as Laya.Sprite;


        this.owner.y = 0;
        this.owner.height = StaticData.gameHeight;
        this.backSpr.height = StaticData.gameHeight;
        // this.bgImg.height = StaticData.gameHeight;
        
        this.backSpr.on(Laya.Event.CLICK, this, () => {
            Laya.Dialog.open(ConfigData.StartGameDialog)
            this.owner.close();
            if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin && this.wxbutton != null) {
                this.wxbutton.destroy();
            }
        });

        if (SoundUtil.isPlayMusic) {
            this.soundSpr.loadImage("images/mune_v.png");
        } else {
            this.soundSpr.loadImage("images/mune_v_n.png");
        }

        this.soundSpr.on(Laya.Event.CLICK, this, () => {
            if (SoundUtil.isPlayMusic) {
                SoundUtil.stopMusic();
                this.soundSpr.loadImage("images/mune_v_n.png");
            } else {
                SoundUtil.playMusic();
                this.soundSpr.loadImage("images/mune_v.png");
            }
        });

        this.kfSpr.on(Laya.Event.CLICK, this, () => {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                GamePlatform.platform.openCustomerServiceConversation({});
            }
        });

        this.hotSpr.on(Laya.Event.CLICK, this, () => {
            Laya.Dialog.open(ConfigData.OthersGamesDialog);
        });

        this._back.on(Laya.Event.CLICK, this, () => {
            Laya.Dialog.open(ConfigData.StartGameDialog)
            this.owner.close();
        });



        if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin) {
            let sysInfo = GamePlatform.platform.getSystemInfoSync();
            //获取微信界面大小
            let wxWidth = sysInfo.screenWidth;
            let wxHeight = sysInfo.screenHeight;

            let xPercent = this.quanSpr.x / StaticData.gameWidth;
            let yPercent = this.quanSpr.y / StaticData.gameHeight;
            let wPercent = this.quanSpr.width / StaticData.gameWidth;
            let hPercent = this.quanSpr.height / StaticData.gameHeight;

            this.wxbutton = GamePlatform.platform.createGameClubButton({
                type: "image",
                image: 'images/mune_q.png',
                icon: "white",
                style: {
                    left: wxWidth * xPercent,
                    top: wxHeight * yPercent,
                    width: wxWidth * wPercent,
                    height: wxHeight * hPercent,
                }
            });
        };

        if (GamePlatform.platformName != GamePlatform.WX) {
            this.kfSpr.visible = false;
            this.quanSpr.visible = false;
            this.hotSpr.visible = false;
        }
    }

    onDisable() {
        super.onDisable();
        if (GamePlatform.platformName == GamePlatform.WX && Laya.Browser.onWeiXin && this.wxbutton != null) {
            this.wxbutton.destroy();
        }
    }
}