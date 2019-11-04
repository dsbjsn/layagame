import SingtonClass from "../utils/SingtonClass";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import BaseModle from "./BaseModle";
import TipsUtil from "../utils/TipsUtil";
import AldUtil from "../utils/AldUtil";
import EnumSkinUtil from "../data/EnumHttp";


/**
 * freeCarSkinID、freeEggSkinID、selectCarSkinID、selectEggSkinID  都以 skin.json中的id为索引
 * 
 * 
 * 
 */
export default class SkinModle extends BaseModle {
    private static carSkinInfo: Array<SkinBean>;
    private static eggSkinInfo: Array<SkinBean>;

    public static selectCarSkinID: string = "1";
    public static selectEggSkinID: string = "1";

    public static freeCarSkinID: string = "0";
    public static freeEggSkinID: string = "0";

    public static hadBuyCarKey: string = "hadBuyCar";
    public static hadBuyEggKey: string = "hadBuyEgg";

    public static useCarSkinKey: string = "useCarSkinKey";
    public static useEggSkinKey: string = "useEggSkinKey";

    static init(skin1, skin2) {
        this.carSkinInfo = skin1;
        this.eggSkinInfo = skin2;

        let hadBuy = LocalStorageUtil.getString(this.hadBuyCarKey);
        let buyJson;

        if (hadBuy && hadBuy != null) {
            buyJson = JSON.parse(hadBuy);
        }

        for (let cs of this.carSkinInfo) {
            cs.hadBuy = cs.id == "1";
            if (buyJson != null) {
                for (let i of buyJson) {
                    if (cs.id == Number(i)) {
                        cs.hadBuy = true;
                        break;
                    }
                }
            }
        }


        let hadBuyEgg = LocalStorageUtil.getString(this.hadBuyEggKey);
        let buyEggJson;

        if (hadBuyEgg && hadBuyEgg != null) {
            buyEggJson = JSON.parse(hadBuyEgg);
        }

        for (let cs of this.eggSkinInfo) {
            cs.hadBuy = cs.id == "1";
            if (buyEggJson != null) {
                for (let i of buyEggJson) {
                    if (cs.id == Number(i)) {
                        cs.hadBuy = true;
                        break;
                    }
                }
            }
        }


        if (LocalStorageUtil.getString(this.useCarSkinKey) == null || LocalStorageUtil.getString(this.useCarSkinKey).length <= 0) {
            this.selectCarSkinID = "1";
        } else {
            this.selectCarSkinID = LocalStorageUtil.getString(this.useCarSkinKey);
        }

        if (LocalStorageUtil.getString(this.useEggSkinKey) == null || LocalStorageUtil.getString(this.useEggSkinKey).length <= 0) {
            this.selectEggSkinID = "1";
        } else {
            this.selectEggSkinID = LocalStorageUtil.getString(this.useEggSkinKey);
        }

        if (this.selectCarSkinID == "0") {
            this.selectCarSkinID = "1";
            this.setSelectCarSkinID(this.selectCarSkinID);
        }

        if (this.selectEggSkinID == "0") {
            this.selectEggSkinID = "1";
            this.setSelectCarSkinID(this.selectEggSkinID);
        }
    }


    public static setSelectCarSkinID(id) {
        this.selectCarSkinID = id;
        LocalStorageUtil.add(this.useCarSkinKey, this.selectCarSkinID);
    }

    public static getCarSkins() {
        return this.carSkinInfo;
    }

    public static getCarSkinById(id: string): SkinBean {
        if (this.carSkinInfo != null && this.carSkinInfo.length > 0) {
            for (let skin of this.carSkinInfo) {
                if (skin.id == id) {
                    return skin;
                }
            }
            return null;
        } else {
            return null;
        }
    }

    public static getCarSkin(p): SkinBean {
        if (this.carSkinInfo != null && this.carSkinInfo.length > 0) {
            return this.carSkinInfo[p];
        } else {
            return null;
        }
    }

    public static getSelectCarSkin(): SkinBean {
        if (this.freeCarSkinID != "0") {
            let skin = this.getCarSkinById(this.freeCarSkinID);
            return skin;
        } else {
            let skin = this.getCarSkinById(this.selectCarSkinID);
            return skin;
        }
    }

    public static addCarSkin(id) {
        let hadBuy = LocalStorageUtil.getString(this.hadBuyCarKey);
        let buyJson: Array<String>;

        if (hadBuy && hadBuy != null) {
            buyJson = JSON.parse(hadBuy)
        } else {
            buyJson = [];
        }

        buyJson.push(id);
        LocalStorageUtil.add(this.hadBuyCarKey, JSON.stringify(buyJson));

        AldUtil.upload(EnumSkinUtil.getBuyCarSkin(id))

        for (let cs of this.carSkinInfo) {
            if (cs.id == id) {
                TipsUtil.msg("恭喜获得新皮肤");
                cs.hadBuy = true;
                break;
            }
        }
    }



    public static setSelectEggSkinID(id) {
        this.selectEggSkinID = id;
        LocalStorageUtil.add(this.useEggSkinKey, this.selectEggSkinID);
    }

    public static getEggSkins() {
        return this.eggSkinInfo;
    }

    public static getEggSkin(p): SkinBean {
        if (this.eggSkinInfo != null && this.eggSkinInfo.length > 0) {
            return this.eggSkinInfo[p];
        } else {
            return null;
        }
    }

    public static getEggSkinById(id): SkinBean {
        if (this.eggSkinInfo != null && this.eggSkinInfo.length > 0) {
            for (let skin of this.eggSkinInfo) {
                if (skin.id == id) {
                    return skin;
                }
            }
            return null;
        } else {
            return null;
        }
    }

    public static getSelectEggSkin(): SkinBean {
        if (this.freeEggSkinID != "0") {
            return this.getEggSkinById(this.freeEggSkinID)
        } else {
            return this.getEggSkinById(this.selectEggSkinID)
        }
    }

    public static addEggSkin(id) {
        let hadBuy = LocalStorageUtil.getString(this.hadBuyEggKey);
        let buyJson: Array<String>;

        if (hadBuy && hadBuy != null) {
            buyJson = JSON.parse(hadBuy)
        } else {
            buyJson = [];
        }
        AldUtil.upload(EnumSkinUtil.getBuyEggSkin(id))

        buyJson.push(id);
        LocalStorageUtil.add(this.hadBuyEggKey, JSON.stringify(buyJson));

        for (let cs of this.eggSkinInfo) {
            if (cs.id == id) {
                cs.hadBuy = true;
                break;
            }
        }
    }
}