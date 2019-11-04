import LocalStorageUtil from "../utils/LocalStorageUtil";

export default class StaticData {
    //后台获取id
    public static game_id;

    /**
     * 数据存储key值
     */
    //关卡
    public static LEVEL = "LEVEL";
    //本地存储金币key
    public static COIN = "COIN";


    public static coin = 0;

    //允许失败
    public static allowDie: boolean = true;


    //关卡信息
    public static levels: Array<LevelInfo>;
    //当前关卡
    public static level: number = 1;

    public static getLevelData(p: number): LevelInfo {
        if (this.levels == null || this.levels.length <= 0 || p >= this.levels.length) {
            return null;
        }
        return this.levels[p];
    }

    //屏幕适配，是否是IphoneX
    public static isIphoneX: boolean = false;
    //屏幕缩放比例 基准大小为 750*1334
    public static clientScale = 1;
    //游戏内容实际高度缩放比例 基准高度为iphoneX 1624
    public static heightOffsetScale = 0;
    //游戏实际高度与标准高度差(1334) / 2  做为场景y轴偏移值，适配屏幕
    public static offY = 0;

    public static setIsIphoneX(is) {
        this.gameHeight = 750 * Laya.Browser.clientHeight / Laya.Browser.clientWidth;
        this.clientScale = this.gameHeight / Laya.Browser.clientHeight;
        this.heightOffsetScale = (this.gameHeight - 1334) / (1624 - 1334);

        if (this.gameHeight - 1334 > 0) {
            this.offY = (this.gameHeight - 1334) / 2;
        }

        this.isIphoneX = is;

        if (!is) {
            if (Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                this.isIphoneX = true;
            }
        }

        console.log("IsIphoneX=", this.isIphoneX);
        console.log("size Laya.Browser.client:", Laya.Browser.clientWidth, Laya.Browser.clientHeight);
        console.log("size game:", this.gameWidth, this.gameHeight);
        console.log("size stage:", Laya.stage.width, Laya.stage.height);
        console.log("size clientScale:", this.clientScale);
        console.log("size heightOffsetScale:", this.heightOffsetScale);
        console.log("size offY:", this.offY);
    }

    //场景size
    public static gameWidth = 750;
    public static gameHeight = 1334;

    //游戏导出列表相关
    public static gameList;
    public static getGameListSize() {
        if (StaticData.gameList == null) {
            return 0;
        } else {
            return StaticData.gameList.length;
        }
    }

    /**
     * 随机从导出中获取数据
     * @param num 数据数量
     */
    public static getGameListRadom(num) {
        if (num == 0) {
            return null;
        }

        let ids = [];
        let newGameList = [];
        if (StaticData.gameList != null && StaticData.getGameListSize() >= num) {
            let goon = true;
            while (goon) {
                let i = Number((Math.random() * (StaticData.getGameListSize() - 1)).toFixed());
                if (ids.indexOf(i) < 0) {
                    ids.push(i);
                    newGameList.push(StaticData.gameList[i]);
                }

                if (ids.length == num) {
                    goon = false;
                }
            }
            return newGameList;
        } else {
            return null;
        }
    }

    //是否开启误导
    public static isMisLead = false;

    //自动跳转到签到页
    public static AutoSkipToSign = true;
    //自动跳转到皮肤页
    public static AutoSkipToSkin = true;

    //分享好友得金币数量
    public static ChangeFriendGetCoin = 200;

    //金币获取 基数
    public static GetCoinTimesNumber = 0;
    //金币获取 翻倍数
    public static GetCoinTimes = 3;

    // 判断是试用车车还是蛋蛋 true:车车  fasle:蛋蛋
    public static carOrEggFree = false;
}
