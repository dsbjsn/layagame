import HttpUtil from "../utils/HttpUtil";
import Api from "./Api";
import UserData from "./UserData";
import StaticData from "./StaticData";
import ConfigData from "../config/ConfigData";
import Loading from "../manages/Loading";
import StartGameManage from "../manages/dialogManage/StartDialogManage";
import GameManage from "../manages/GameManage";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import AldUtil from "../utils/AldUtil";
import GamePlatform from "../adapter/GamePlatform";

export default class GameHttp {
    private getTime = 0;
    private maxGetTime = 3;

    private loginPath;

    public static _instance: GameHttp;
    public static get Instance() {
        if (!GameHttp._instance)
            new GameHttp()
        return GameHttp._instance
    }
    //构造函数
    constructor() {
        GameHttp._instance = this
    }

    public login() {
        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
            this.getTime++;
            GamePlatform.platform.login({
                success: res => {
                    console.log("login res:",res);
                    
                    if (res.code) {
                        UserData.Code = res.code;
                        let obj = GamePlatform.platform.getLaunchOptionsSync();
                        let _AppID = "0";
                        let Sence = obj.scene;
                        if (obj.query == undefined || obj.query == null) {
                            Sence = "0";
                        } else {
                            if (obj.query.scene == undefined || obj.query == null) {
                                Sence = "0";
                            } else {
                                Sence = obj.query.scene;
                            }
                        }

                        let _Sence = decodeURIComponent(Sence);

                        this.getTime = 0;
                        this.loginPath = Api.loginUrl + "&version=" + ConfigData.version + "&code=" + res.code + "&scene=" + _Sence + "&uid=" + _AppID;
                        this.loginToService();
                    }
                },
                fail: err => {
                    if (this.getTime < this.maxGetTime) {
                        this.login();
                    } else {
                        console.log("login fail");
                    }
                }
            })
        } else {
            console.log("请在微信开发工具上调试");
        }
    }

    /**
     * 登录自己后台
     */
    private loginToService() {
        this.getTime++;
        HttpUtil.request({
            url: this.loginPath,
            method: "get",
            complete: res => {
                this.getTime = 0;
                UserData.OpenId = res.data.openid;
                UserData.setOpenUser();
                GameHttp.Instance.getLeadOut();
                GameHttp.Instance.isMislead();
                console.log("后台登录成功:",res);
            },
            error: err => {
                if (this.getTime < this.maxGetTime) {
                    this.loginToService();
                } else {
                    console.log("后台登录失败");
                }
            }
        });
    }

    private getLeadOut() {
        console.log("后台获取游戏列表");
        if (UserData.OpenId) {
            this.getTime++;
            let path = Api.gameListUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    // platform.hideLoading();
                    if (res.result_code == 1) {
                        StaticData.gameList = res.data.gamelist;
                        console.log("网络游戏列表加载成功");
                    }
                },
                error: err => {
                    if (this.getTime < this.maxGetTime) {
                        this.getLeadOut();
                    } else {
                        console.log("后台 获取游戏列表  请求失败");
                    }
                }
            });
        }
    }

    private isMisleadTime = 0;
    private isMislead() {
        if (UserData.OpenId) {
            this.isMisleadTime++;
            let path = Api.misleadUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    StaticData.isMisLead = res.data.casualClick == "1";
                    console.info("isMislead:", StaticData.isMisLead);
                },
                error: err => {
                    if (this.isMisleadTime < this.maxGetTime) {
                        this.isMislead();
                    } else {
                        console.log("后台 获取是否误点  请求失败");
                    }
                }
            });
        }
    }

    public leadOut(id) {
        if (UserData.OpenId) {
            let path = Api.leadOutUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + id;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                },
                error: err => {
                    console.info("leadOut.error", err);
                }
            });
        }
    }

    public leadOutSuccess(id) {
        if (UserData.OpenId) {
            let path = Api.leadOutSuccessUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + id;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                },
                error: err => {
                    console.info("leadOutSuccess.error", err);
                }
            });
        }
    }


    public startGame() {
        if (UserData.OpenId) {
            let path = Api.startGameUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    StaticData.game_id = res.data.id;
                },
                error: err => {
                    console.info("startGame.error", err);
                }
            });
        }
    }


    private isRequiered = false;
    public endGame() {
        if (UserData.OpenId) {
            if (!this.isRequiered) {
                console.log("requier");
                // require("../ald/ald-game.js")
                this.isRequiered = true;
            }

            let path = Api.endGameUrl + "&openid=" + UserData.OpenId + "&version=" + ConfigData.version + "&id=" + StaticData.game_id + "&level=" + (StaticData.level + 1);
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                },
                error: err => {
                    console.info("endGame.error", err);
                }
            });
        }
    }
}
