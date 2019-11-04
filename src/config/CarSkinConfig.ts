export default class SkinConfig {
    private static carSkinBig = "images/carSkin/carSkinBig/car_skin_";
    private static carSkinSmall = "images/carSkin/carSkinSmall/car_skin_";
    private static lunzi = "images/carSkin/lunzi/lunzi_"
    private static carBody = "images/carSkin/carBody/carBody_"

    private static eggSmall = "images/eggSkin/eggSkinSmall/egg_skin_"
    private static eggBig = "images/eggSkin/eggSkinBig/egg_skin_"



    public static getEggSkinBig(point) {
        return SkinConfig.eggBig + point + ".png"
    }

    public static getEggSkinSmall(point) {
        return SkinConfig.eggSmall + point + ".png"
    }


    public static getCarSkinBig(point) {
        return SkinConfig.carSkinBig + point + ".png"
    }

    public static getCarSkinSmall(point) {
        return SkinConfig.carSkinSmall + point + ".png"
    }

    public static getCarBodySkin(point) {
        return SkinConfig.carBody + point + ".png"
    }

    public static getLunziSkin(point, b?) {
        return SkinConfig.lunzi + point + ".png"
    }


    private static game_bg = "images/game_bg/bg/bg_img_x_";
    private static game_fg = "images/game_bg/fg/fg_img_x_"
    private static game_bot = "images/game_bg/bot/bot_img_x_"

    public static getGameBg(point) {
        return SkinConfig.game_bg + point + ".png"
    }

    public static getGameFg(point) {
        return SkinConfig.game_fg + point + ".png"
    }
    
    public static getGameBot(point) {
        return SkinConfig.game_bot + point + ".png"
    }

    public static getGameLoadColor(point) {
        let p=Number(point)-1;
        return SkinConfig.loadColor[p<0?0:p];
    }

    private static loadColor=["#FFDCBF","#DFDEFF","#DEE1FF","#96cafa","#A5CAE9","#C798B2"];
}