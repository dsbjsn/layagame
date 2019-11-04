import StaticData from "../../data/StaticData";
import CoinModle from "../../modle/CoinModle";
import SkinModle from "../../modle/SkinModle";
import SkinConfig from "../../config/CarSkinConfig";
import TipsUtil from "../../utils/TipsUtil";
import ConfigData from "../../config/ConfigData";
import LeadOutUtil from "../../utils/LeadOutUtil";
import WxADUtil from "../../utils/WxADUtil";
import GameManage from "../GameManage";
import BaseDialogManage from "../dialogManage/BaseDialogManage";

export default class ShopManage extends BaseDialogManage {
    private bg: Laya.Sprite;
    private showCarSpr: Laya.Sprite;
    private showEggSpr: Laya.Sprite;

    private homeImg: Laya.Image;
    private carBox: Laya.Box;

    private eggTabSpr: Laya.Sprite;
    private eggLb: Laya.Label;
    private carTabSpr: Laya.Sprite;
    private carLb: Laya.Label;

    private carList: Laya.List;
    private eggList: Laya.List;

    private havntSpr: Laya.Sprite;
    private hadSpr: Laya.Sprite;

    private freeSpr: Laya.Sprite;
    private buySpr: Laya.Sprite;
    private buyCoinLb: Laya.Label;

    private carItem = Laya.Box;
    private eggItem = Laya.Box;

    private selectCarId;
    private selectEggId;

    private showTab = 0;

    private eggLocation = [{ x: 353, y: 268 }, { x: 331, y: 280 }, { x: 345, y: 309 }, { x: 363, y: 259 }];

    private static _instance: ShopManage;

    onEnable(): void {
        super.onEnable();
        this.selectCarId = SkinModle.selectCarSkinID;
        this.selectEggId = SkinModle.selectEggSkinID;

        this.bg = this.owner.getChildByName("bgImg") as Laya.Sprite;
        this.showCarSpr = this.owner.getChildByName("showCarSpr") as Laya.Sprite;
        this.showEggSpr = this.owner.getChildByName("showEggSpr") as Laya.Sprite;

        this.homeImg = this.owner.getChildByName("homeImg") as Laya.Image;

        // this.carBox=this.owner.getChildByName("carBox") as Laya.Box;

        this.eggTabSpr = this.owner.getChildByName("eggTabSpr") as Laya.Sprite;
        this.eggLb = this.eggTabSpr.getChildAt(0) as Laya.Label;
        this.carTabSpr = this.owner.getChildByName("carTabSpr") as Laya.Sprite;
        this.carLb = this.carTabSpr.getChildAt(0) as Laya.Label;

        this.carList = this.owner.getChildByName("carList") as Laya.List;
        this.eggList = this.owner.getChildByName("eggList") as Laya.List;
        this.initCarList();
        this.initEggList();

        this.hadSpr = this.owner.getChildByName("hadSpr") as Laya.Sprite;

        this.havntSpr = this.owner.getChildByName("havntSpr") as Laya.Sprite;
        this.freeSpr = this.havntSpr.getChildByName("freeSpr") as Laya.Sprite;
        this.buySpr = this.havntSpr.getChildByName("buySpr") as Laya.Sprite;
        this.buyCoinLb = this.buySpr.getChildByName("buyCoinLb") as Laya.Label;


        this.bg.height = StaticData.gameHeight;

        this.homeImg.y += StaticData.offY - 5;

        this.eggTabSpr.y += StaticData.offY - 5;
        this.carTabSpr.y += StaticData.offY - 5;
        this.carList.y += StaticData.offY - 5;
        this.eggList.y += StaticData.offY - 5;

        this.havntSpr.y += StaticData.offY - 5;
        this.hadSpr.y += StaticData.offY - 5;

        this.showCarSpr.y += StaticData.offY - 5;
        this.showEggSpr.y += StaticData.offY - 5;

        if (StaticData.isIphoneX) {
            this.bg.loadImage("images/shop_bg.png");
        }

        this.bindEvent();

        this.showEgg();
    }

    bindEvent() {
        this.homeImg.on(Laya.Event.CLICK, this, this.goHome);
        this.buySpr.on(Laya.Event.CLICK, this, this.buy);
        this.freeSpr.on(Laya.Event.CLICK, this, this.freeGet);
        this.hadSpr.on(Laya.Event.CLICK, this, this.startGame);
        this.eggTabSpr.on(Laya.Event.CLICK, this, this.showEgg);
        this.carTabSpr.on(Laya.Event.CLICK, this, this.showCar);
    }


    initCarList() {
        this.carList.array = SkinModle.getCarSkins();
        this.carList.renderHandler = Laya.Handler.create(this, this.updateCarItem, null, false);
        this.carList.scrollBar.hide = true;
        this.carList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        this.carList.scrollBar.elasticDistance = 20;//设置橡皮筋极限距离。
    }

    buy() {
        if (this.showTab == 1) {
            this.buyEgg();
        } else {
            this.buyCar();
        }
    }

    updateCarItem(cell, index) {
        let skinImg = cell.getChildByName("skinSpr") as Laya.Sprite;
        let skinBean: SkinBean = this.carList.array[index];

        skinImg.loadImage(SkinConfig.getCarSkinSmall(skinBean.id));

        let maskSpr = cell.getChildByName("maskSpr") as Laya.Sprite;
        maskSpr.visible = !skinBean.hadBuy;

        let isUsed = SkinModle.selectCarSkinID == skinBean.id;
        let usedSpr = cell.getChildByName("usedSpr") as Laya.Sprite;
        usedSpr.visible = isUsed;

        let isSelect = (this.selectCarId == skinBean.id);
        let bgSpr = cell.getChildByName("bgSpr") as Laya.Sprite;
        bgSpr.loadImage(isSelect ? "images/shop_select.png" : "images/shop_unselect.png");

        cell.on(Laya.Event.CLICK, this, function () {
            if (skinBean.hadBuy) {
                this.selectCarId = skinBean.id;
                SkinModle.setSelectCarSkinID(this.selectCarId);

                this.carList.refresh();
                this.showCarSkin();
            } else {
                this.selectCarId = skinBean.id;
                this.carList.refresh();
                this.showCarSkin();
            }
        });
    }

    showCarSkin() {
        let skin = SkinModle.getCarSkinById(this.selectCarId);
        this.showCarSpr.loadImage(SkinConfig.getCarSkinBig(skin.id));

        let offY = StaticData.offY;


        switch (skin.skinModle) {
            case 1:
                this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                break;
            case 2:
                this.showEggSpr.pos(this.eggLocation[1].x, this.eggLocation[1].y + offY);
                break;
            case 3:
                this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                break;
            case 4:
                this.showEggSpr.pos(this.eggLocation[2].x, this.eggLocation[2].y + offY);
                break;
            case 5:
                this.showEggSpr.pos(this.eggLocation[3].x, this.eggLocation[3].y + offY);
                break;
            default:
                this.showEggSpr.pos(this.eggLocation[0].x, this.eggLocation[0].y + offY);
                break;

        }

        if (skin.hadBuy) {
            this.havntSpr.visible = false;
            this.hadSpr.visible = true;
        } else {
            this.havntSpr.visible = true;
            this.hadSpr.visible = false;


            if (skin.getWay == "sign") {
                this.buySpr.loadImage("images/get_by_sign.png");
                this.buyCoinLb.visible = false;
            } else if (skin.getWay == "coin") {
                this.buySpr.loadImage("images/btn_32.png");
                this.buyCoinLb.visible = true;
                this.buyCoinLb.text = skin.coin;
            }
        }
    }

    buyCar() {
        let skin = SkinModle.getCarSkinById(this.selectCarId);
        if (skin.getWay == "coin") {
            if (CoinModle.getCoin() >= skin.coin) {
                TipsUtil.msg("购买成功");
                CoinModle.reduceCoin(skin.coin);
                SkinModle.addCarSkin(skin.id);
                SkinModle.setSelectCarSkinID(this.selectCarId);

                this.carList.refresh();
                this.showCarSkin();
            } else {
                TipsUtil.msg("金币不足");
            }
        } else if (skin.getWay == "sign") {
            Laya.Dialog.open(ConfigData.SignDialog);
        }
    }




    /////////////////   egg   ///////////////////////////

    initEggList() {
        this.eggList.array = SkinModle.getEggSkins();
        this.eggList.renderHandler = Laya.Handler.create(this, this.updateEggItem, null, false);
        this.eggList.scrollBar.hide = true;
        this.eggList.scrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间。单位为毫秒。
        this.eggList.scrollBar.elasticDistance = 20;//设置橡皮筋极限距离。
    }


    updateEggItem(cell, index) {
        let skinImg = cell.getChildByName("skinSpr") as Laya.Sprite;
        let skinBean: SkinBean = this.eggList.array[index];

        skinImg.loadImage(SkinConfig.getEggSkinBig(skinBean.id));

        let maskSpr = cell.getChildByName("maskSpr") as Laya.Sprite;
        maskSpr.visible = !skinBean.hadBuy;

        let isUsed = SkinModle.selectEggSkinID == skinBean.id;
        let usedSpr = cell.getChildByName("usedSpr") as Laya.Sprite;
        usedSpr.visible = isUsed;

        let isSelect = this.selectEggId == skinBean.id;
        let bgSpr = cell.getChildByName("bgSpr") as Laya.Sprite;
        bgSpr.loadImage(isSelect ? "images/shop_select.png" : "images/shop_unselect.png");

        cell.on(Laya.Event.CLICK, this, function () {
            if (skinBean.hadBuy) {
                this.selectEggId = skinBean.id;
                SkinModle.setSelectEggSkinID(skinBean.id);

                this.eggList.refresh();
                this.showEggSkin();
            } else {
                this.selectEggId = skinBean.id;
                this.eggList.refresh();
                this.showEggSkin();
            }
        });
    }

    showEggSkin() {
        let skin = SkinModle.getEggSkinById(this.selectEggId);
        this.showEggSpr.loadImage(SkinConfig.getEggSkinSmall(skin.id));

        if (skin.hadBuy) {
            this.havntSpr.visible = false;
            this.hadSpr.visible = true;
        } else {
            this.havntSpr.visible = true;
            this.hadSpr.visible = false;

            this.buySpr.loadImage("images/btn_32.png");
            this.buyCoinLb.visible = true;
            this.buyCoinLb.text = skin.coin;
        }
    }

    buyEgg() {
        let skin = SkinModle.getEggSkinById(this.selectEggId);
        if (CoinModle.getCoin() >= skin.coin) {
            TipsUtil.msg("购买成功");
            CoinModle.reduceCoin(skin.coin);
            SkinModle.addEggSkin(skin.id);

            SkinModle.setSelectEggSkinID(this.selectEggId);

            this.eggList.refresh();
            this.showEggSkin();
        } else {
            TipsUtil.msg("金币不足");
        }
    }


    showEgg() {
        if (this.showTab == 1) {
            return;
        }
        this.showTab = 1;

        this.carList.visible = false;
        this.eggList.visible = true;

        this.eggTabSpr.loadImage("images/shop_btn_bg.png");
        this.carTabSpr.loadImage("images/shop_btn_s_bg.png");

        this.carLb.alpha = 0.3;
        this.eggLb.alpha = 1;


        this.showCarSkin();
        this.showEggSkin();
    }

    showCar() {
        if (this.showTab == 2) {
            return;
        }

        this.showTab = 2;

        this.carList.visible = true;
        this.eggList.visible = false;

        this.carTabSpr.loadImage("images/shop_btn_bg.png");
        this.carLb.alpha = 1.0;

        this.eggTabSpr.loadImage("images/shop_btn_s_bg.png");
        this.eggLb.alpha = 0.3;

        this.showCarSkin();
        this.showEggSkin();
    }

    goHome() {
        this.owner.close();
        Laya.Dialog.open(ConfigData.StartGameDialog);
    }

    startGame() {
        this.owner.close();
        //TODO 刷新皮肤
        GameManage.manageOwner.gameStart(true);
    }

    freeGet() {
        WxADUtil.adOrShare({
            success: () => {
                this.getFree();
            }
        });
    }

    getFree() {
        if (this.showTab == 1) {
            SkinModle.freeEggSkinID = this.selectEggId;
        } else {
            SkinModle.freeCarSkinID = this.selectCarId;
        }
        this.owner.close();

        //TODO 刷新皮肤
        GameManage.manageOwner.gameStart(true);
    }
}