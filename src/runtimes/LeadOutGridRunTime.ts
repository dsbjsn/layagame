import StaticData from "../data/StaticData";
import LeadOutUtil from "../utils/LeadOutUtil";
import ConfigData from "../config/ConfigData";
import GamePlatform from "../adapter/GamePlatform";

export default class LeadOutGridRunTime extends Laya.Sprite {

    private static _instance: LeadOutGridRunTime;

    private gameList: Laya.List;

    private gl: Array<any>;

    constructor() {
        super();
        LeadOutGridRunTime._instance = this;
    }

    public static getInstance() {
        if (LeadOutGridRunTime.prototype == null) {
            LeadOutGridRunTime._instance = new LeadOutGridRunTime();
        }
        return LeadOutGridRunTime._instance;
    }

    onAwake() {
        this.gameList = this.getChildByName("gameList") as Laya.List;
        if (GamePlatform.platformName == GamePlatform.WX) {
            this.initData();
        } else {
            this.visible = false;
        }
    }

    public initData() {
        this.gl = StaticData.getGameListRadom(6);
        if (this.gl != null && this.gl.length > 0) {
            this.gameList.array = this.gl;
            this.gameList.renderHandler = Laya.Handler.create(this, this.updateItem,null,false);
        }
    }

    updateItem(call, index) {
        let item = this.gl[index];

        if (item != null) {
            let gameIcon = call.getChildByName("gameIcon") as Laya.Sprite;
            let gameName = call.getChildByName("gameName") as Laya.Label;
            
            if (gameIcon != null) {
                gameIcon.loadImage(item.img, Laya.Handler.create(this, () => {
                    let cmaskSpr = new Laya.Sprite();
                    cmaskSpr.width = gameIcon.width;
                    cmaskSpr.height = gameIcon.height;
                    cmaskSpr.loadImage("images/leadout_icon_bg.png");
                    gameIcon.mask = cmaskSpr;
                }));
            }

            gameName.text = item.title;

            call.on(Laya.Event.CLICK, this, function () {
                LeadOutUtil.leadOut(item, this.ald_pois);
            });
        } else {
            call.visible = false;
        }
    }

    private ald_pois;
    public setAldPois(pois) {
        this.ald_pois = pois;
        console.log("LeadOutGridRunTime 阿拉丁代号：",pois);   
    }
} 