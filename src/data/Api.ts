import GamePlatform from "../adapter/GamePlatform";

export default class Api {
    public static misleadUrl: string = Api.getRootUrl() + "/index.php?act=user";
    public static loginUrl: string = Api.getRootUrl() + "/index.php?act=userinfo";
    public static gameListUrl: string = Api.getRootUrl() + "/index.php?act=gamelist";
    public static startGameUrl: string = Api.getRootUrl() + "/index.php?act=index";
    public static endGameUrl: string = Api.getRootUrl() + "/index.php?act=end";
    public static leadOutUrl: string = Api.getRootUrl() + "/index.php?act=game";
    public static leadOutSuccessUrl: string = Api.getRootUrl() + "/index.php?act=cgame";

    private static getRootUrl(): string {
        if (GamePlatform.platformName == GamePlatform.QQ) {
            return "https://qq.xyxapi.com/home/lxdd";
        } else {
            return "https://lxdd.xyxapi.com";
        }
    }
}
