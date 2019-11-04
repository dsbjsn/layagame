
import StaticData from "../../src/data/StaticData"
import GameState from "../data/GameState";
import TipsUtil from "../utils/TipsUtil";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import AwardType from "../data/beans/AwardType";
import AwardDialogManage from "./dialogManage/AwardDialogManage";
import ConfigData from "../config/ConfigData";
import CoinModle from "../modle/CoinModle";
import BaseScript from "../modle/BaseScript";
import SkinModle from "../modle/SkinModle";
import SoundUtil from "../utils/SoundUtil";
import GameHttp from "../data/GameHttp";
import SkinConfig from "../config/CarSkinConfig";
import LeftRightPrefabRunTime from "../runtimes/LeftRightPrefabRunTime";
import UpDownPrefabRunTime from "../runtimes/UpDownPrefabRunTime";
import InvisiblePrefabRunTime from "../runtimes/InvisiblePrefabRunTime";
import AldUtil from "../utils/AldUtil";
import LeadOutListRunTime from "../runtimes/LeadOutListRunTime";
import GamePlatform from "../adapter/GamePlatform";
import DialogModle from "../modle/DialogModle";
import ViewUtil from "../utils/ViewUtil";

export default class GameManage extends BaseScript {
    owner: Laya.Scene;
    leadOut: LeadOutListRunTime;
    pauseSpr: Laya.Sprite;
    background: Laya.Sprite;
    gameBox: Laya.Box;

    name: string;
    gameState: number;
    reliveTime: number = 0;

    static manageOwner: GameManage;

    /**
     * ui部分
     */
    constructor() {
        super();
        this.name = "GameManage";
        GameManage.manageOwner = this;
    }

    public static getManage() {
        return GameManage.manageOwner;
    }

    onEnable() {
        this.findView();
        this.initView();

        //跟据 getCoinDate==null  判断是不是新用户，再显示福利弹窗
        Laya.Dialog.open(ConfigData.StartGameDialog, true, null, Laya.Handler.create(this, (dialog) => {
            let getCoinDate = LocalStorageUtil.getString("getCoinDate");
            let date = new Date();
            let today_date = String(date.getDate());
            if (getCoinDate && getCoinDate != today_date) {
                let d = dialog as Dialog;
                Laya.timer.once(500, this, () => {
                    if (d && !d.destroyed && d.visible) {
                        Laya.Dialog.open(ConfigData.FLBoxDialog);
                        LocalStorageUtil.add("getCoinDate", today_date);
                    }
                })
            } else if (getCoinDate == null) {
                LocalStorageUtil.add("getCoinDate", today_date);
            }
        }));
    }

    onUpdate() {
        if (DialogModle.getDialogCount() > 0) {
            ViewUtil.goneViews([this.leadOut, this.pauseSpr]);
        } else {
            ViewUtil.visibleViews([this.leadOut, this.pauseSpr]);
        }
    }

    findView() {
        this.leadOut = this.owner.getChildByName("bottomLeadOut") as LeadOutListRunTime;
        this.pauseSpr = this.owner.getChildByName("pauseSpr") as Laya.Sprite;
        this.gameBox=this.owner.getChildByName("gameBox") as Laya.Box;

    }

    initView() {
        this.pauseSpr.on(Laya.Event.CLICK, this, this.clickAction)
        this.leadOut.setAldPois(CustomAction.GameSence_Dc);
        this.leadOut.init(true);

        Laya.Physics.I.worldRoot = this.gameBox;
    }

    adapterWindow() {
        ViewUtil.adapterPositionJL(this.pauseSpr);
    }

    ///////////////////////////  游戏生命周期  /////////////////////

    /**
     * 开始游戏
     * isNewGame：是否是新游戏标识
     * startAction:开始游戏时执行的动作
     */
    public gameStart(isNewGame: boolean, startAction?: string) {
        console.log("开始游戏");

        if (isNewGame) {
            GameHttp.Instance.startGame();
            AldUtil.stageStart();

            if (startAction != null) {
                switch (startAction) {
                    case ConfigData.FreeSkinOfStartDialog:
                        Laya.Dialog.open(ConfigData.FreeSkinOfStartDialog, false);
                        break;
                    default:
                        break;
                }
            } else {
                SoundUtil.playStartGame();
                this.gameState = GameState.START;
            }
        } else {
            this.gameState = GameState.START;
        }
    }

    /**
     * 暂停游戏
     */
    public gamePause() {
        console.log("暂停游戏");
        this.gameState = GameState.PUASE;
    }

    /**
     * 游戏关卡完成
     */
    public gameFinish() {
        console.log("游戏关卡完成");
        this.gameState = GameState.FINISH;

        if (StaticData.level >= StaticData.levels.length - 1) {
            TipsUtil.msg("恭喜完成全部关卡");
        } else {
            Laya.Dialog.open(ConfigData.AwardDialog);
            this.reliveTime = 0;
        }
    }


    /**
     * 游戏结束
     */
    private gameOverLocation: Laya.Point;
    public gameOver() {
        //当前状态是GameState.OVER 或 GameState.FINISH 时，不再执行游戏结束操作
        if (this.gameState == GameState.OVER || this.gameState == GameState.FINISH) {
            return;
        }

        console.log("游戏结束");

        if (StaticData.allowDie) {
                this.gameState = GameState.OVER;
                if (this.reliveTime >= ConfigData.MaxReLiveTime) {
                    this.reliveTime = 0;
                    Laya.Dialog.open(ConfigData.GetCoinTimesDialog);
                } else {
                    Laya.Dialog.open(ConfigData.GameOverDialog);
                }
            }
    }

    /**
     * 重新开始游戏
     * showDialog:是否显示免费皮肤弹窗
     */
    public restart(showDialog?) {
        console.log("重新开始");
        this.refreshUI();
        this.reliveTime = 0;
        if (showDialog) {
            this.gameStart(true, ConfigData.FreeSkinOfStartDialog);
        } else {
            this.gameStart(true);
        }
    }

    /**
     * 重置游戏场景
     */
    public refreshUI() {
        console.log("刷新界面");
    }

    /**
   * 开始下一关游戏
   */
    public nextLevel() {
        console.log("开始下一关游戏");
        this.gameStart(true);
    }

    public reLive() {
        console.log("reLive");
        this.reliveTime++;
        this.gameStart(false);
    }


    /**
     * 鼠标点击，通过判断是按下还是松开
     * @param e 
     */
    mouseHandle(e: Event) {
        switch (e.type) {
            case Laya.Event.MOUSE_DOWN:
                break;
            case Laya.Event.MOUSE_UP:
                break;
        }
    }

    clickAction(e) {
        switch (e.target.name) {
            case "pauseSpr":
                Laya.Dialog.open(ConfigData.PauseDialog);
                break;
            default:
                break;
        }
    }
}