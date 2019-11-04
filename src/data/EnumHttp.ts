import SkinModle from "../modle/SkinModle";

export default class EnumSkinUtil {
    static getUseCarSkin() {
        let skin = SkinModle.getSelectCarSkin();
        let ald_skin_use;
        switch (skin.id) {
            case "1":
                ald_skin_use = CarSkin_Use.CarSkin_1;
                break;
            case "2":
                ald_skin_use = CarSkin_Use.CarSkin_2;
                break;
            case "3":
                ald_skin_use = CarSkin_Use.CarSkin_3;
                break;
            case "4":
                ald_skin_use = CarSkin_Use.CarSkin_4;
                break;
            case "5":
                ald_skin_use = CarSkin_Use.CarSkin_5;
                break;
            case "6":
                ald_skin_use = CarSkin_Use.CarSkin_6;
                break;
            case "7":
                ald_skin_use = CarSkin_Use.CarSkin_7;
                break;
            case "8":
                ald_skin_use = CarSkin_Use.CarSkin_8;
                break;
            case "10":
                ald_skin_use = CarSkin_Use.CarSkin_10;
                break;
            case "11":
                ald_skin_use = CarSkin_Use.CarSkin_11;
                break;
            default:
                ald_skin_use = CarSkin_Use.CarSkin_1;
                break;
        }
        return ald_skin_use;
    }


    static getUseEggSkin() {
        let skin = SkinModle.getSelectEggSkin();
        let ald_skin_use;
        switch (skin.id) {
            case "1":
            ald_skin_use = EggSkin_Use.EggSkin_1;
                break;
            case "2":
            ald_skin_use = EggSkin_Use.EggSkin_2;
                break;
            case "3":
            ald_skin_use = EggSkin_Use.EggSkin_3;
                break;
            case "4":
            ald_skin_use = EggSkin_Use.EggSkin_4;
                break;
            case "5":
            ald_skin_use = EggSkin_Use.EggSkin_5;
                break;
            case "6":
            ald_skin_use = EggSkin_Use.EggSkin_6;
                break;
            case "7":
            ald_skin_use = EggSkin_Use.EggSkin_7;
                break;
            case "8":
            ald_skin_use = EggSkin_Use.EggSkin_8;
                break;
            case "9":
            ald_skin_use = EggSkin_Use.EggSkin_9;
                break;
            default:
            ald_skin_use = EggSkin_Use.EggSkin_1;
                break;
        }
        return ald_skin_use;
    }


    static getBuyCarSkin(id) {
        let emun_car;
        switch (id) {
            case "1":
                emun_car = CarSkin_Buy.CarSkin_1;
                break;
            case "2":
                emun_car = CarSkin_Buy.CarSkin_2;
                break;
            case "3":
                emun_car = CarSkin_Buy.CarSkin_3;
                break;
            case "4":
                emun_car = CarSkin_Buy.CarSkin_4;
                break;
            case "5":
                emun_car = CarSkin_Buy.CarSkin_5;
                break;
            case "6":
                emun_car = CarSkin_Buy.CarSkin_6;
                break;
            case "7":
                emun_car = CarSkin_Buy.CarSkin_7;
                break;
            case "8":
                emun_car = CarSkin_Buy.CarSkin_8;
                break;
            case "10":
                emun_car = CarSkin_Buy.CarSkin_10;
                break;
            case "11":
                emun_car = CarSkin_Buy.CarSkin_11;
                break;
            default:
                emun_car = CarSkin_Buy.CarSkin_1;
                break;
        }
        return emun_car;
    }


    static getBuyEggSkin(id) {
        let emun_egg;
        switch (id) {
            case "1":
            emun_egg = EggSkin_Buy.EggSkin_1;
                break;
            case "2":
            emun_egg = EggSkin_Buy.EggSkin_2;
                break;
            case "3":
            emun_egg = EggSkin_Buy.EggSkin_3;
                break;
            case "4":
            emun_egg = EggSkin_Buy.EggSkin_4;
                break;
            case "5":
            emun_egg = EggSkin_Buy.EggSkin_5;
                break;
            case "6":
            emun_egg = EggSkin_Buy.EggSkin_6;
                break;
            case "7":
            emun_egg = EggSkin_Buy.EggSkin_7;
                break;
            case "8":
            emun_egg = EggSkin_Buy.EggSkin_8;
                break;
            case "9":
            emun_egg = EggSkin_Buy.EggSkin_9;
                break;
            default:
            emun_egg = EggSkin_Buy.EggSkin_1;
                break;
        }
        return emun_egg;
    }
}