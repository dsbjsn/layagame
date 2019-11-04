import BaseDialogManage from "./BaseDialogManage";
import SkinModle from "../../modle/SkinModle";
import SkinConfig from "../../config/CarSkinConfig";
import WxADUtil from "../../utils/WxADUtil";
import StaticData from "../../data/StaticData";
import AldUtil from "../../utils/AldUtil";
import GameManage from "../../manages/GameManage";

export default class SkinFreeDialogManage extends BaseDialogManage {
    titleLb: Laya.Label;
    midleBg: Laya.Sprite;
    freeSkinList: Laya.List;

    freeSkins: number[];

    findView() {
        this.titleLb = this.contentSpr.getChildByName("titleLb") as Laya.Label;
        this.midleBg = this.contentSpr.getChildByName("midleBg") as Laya.Sprite;
        this.freeSkinList = this.contentSpr.getChildByName("freeSkinList") as Laya.List;
    }

    initView() {
        StaticData.carOrEggFree = !StaticData.carOrEggFree;
        this.freeSkins = [];
        let go = true;
        while (go) {
            let skinId;

            if (StaticData.carOrEggFree) {
                skinId = Math.round((Math.random() * 9)) + 2;
                skinId = Math.min(11, skinId);
                skinId = Math.max(2, skinId);
                if (skinId == 9) {
                    skinId = 8;
                }
            } else {
                skinId = Math.round((Math.random() * 7)) + 2;
                skinId = Math.min(9, skinId);
                skinId = Math.max(2, skinId);
            }

            if (String(skinId) != SkinModle.selectCarSkinID) {
                let isAdd = false;
                for (let id of this.freeSkins) {
                    if (id == skinId) {
                        isAdd = true;
                        break;
                    }
                }

                if (!isAdd) {
                    this.freeSkins.push(skinId);
                }

                if (this.freeSkins.length == 4) {
                    go = false;
                }
            }
        }

        this.freeSkinList.array = this.freeSkins;
        this.freeSkinList.renderHandler = Laya.Handler.create(this, this.updateItem, null, false);
    }

    updateItem(call, index) {
        let item = this.freeSkins[index]

        if (item != null) {
            let carSkinSpr = call.getChildByName("carSkinSpr") as Laya.Sprite;
            let eggSkinSpr = call.getChildByName("eggSkinSpr") as Laya.Sprite;
            let userBtn = call.getChildByName("userBtn") as Laya.Sprite;

            if (StaticData.carOrEggFree) {
                carSkinSpr.loadImage(SkinConfig.getCarSkinBig(item));
            } else {
                eggSkinSpr.loadImage(SkinConfig.getEggSkinBig(item));
            }

            userBtn.on(Laya.Event.CLICK, this, () => {
                AldUtil.upload(CustomAction.FreeSkinDialog_Yes);
                    WxADUtil.adOrShare({
                        success: () => {
                            if (StaticData.carOrEggFree) {
                                SkinModle.freeCarSkinID = String(item);
                            } else {
                                SkinModle.freeEggSkinID = String(item);
                            }

                            //TODO 刷新皮肤
                            this.owner.close();
                        },
                        fail: () => {
                            this.owner.close();
                        }
                    });
            });
        } else {
            call.visible = false;
        }
    }

    adapterWindow() {
        super.adapterWindow();

        this.titleLb.y += 222 * StaticData.heightOffsetScale;
        this.midleBg.y += 222 * StaticData.heightOffsetScale;
        this.freeSkinList.y += 222 * StaticData.heightOffsetScale;
    }

    yesAction() {
        AldUtil.upload(CustomAction.FreeSkinDialog_Yes);
        WxADUtil.adOrShare({
            success: () => {
                let freeId = String(this.freeSkins[Math.round(Math.random() * 3)]);
                if (StaticData.carOrEggFree) {
                    SkinModle.freeCarSkinID = freeId;
                } else {
                    SkinModle.freeEggSkinID = freeId;
                }

                 //TODO 刷新皮肤
                this.owner.close();
            },
            fail: () => {
                this.owner.close();
            }
        })
    }

    noAction() {
        AldUtil.upload(CustomAction.FreeSkinDialog_No);
        this.owner.close();
    }

    onDisable() {
        super.onDisable();
        WxADUtil.hideBannerAd();
        GameManage.manageOwner.gameStart(false);
    }
}