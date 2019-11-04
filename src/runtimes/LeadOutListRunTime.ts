import StaticData from "../data/StaticData";
import LeadOutUtil from "../utils/LeadOutUtil";
import ConfigData from "../config/ConfigData";
import GamePlatform from "../adapter/GamePlatform";

export default class LeadOutListRunTime extends Laya.Sprite {

    private static _instance: LeadOutListRunTime;

    private gameList: Laya.Box;

    private hadLoadGameList = false;

    private gl: Array<any>;

    constructor() {
        super();
        LeadOutListRunTime._instance = this;
    }

    public static getInstance() {
        return LeadOutListRunTime._instance;
    }

    onEnable() {
        this.visible = false;
        this.gameList = this.getChildByName("gameList") as Laya.Box;
    }

    private scroll = 0;
    private offScroll = -2;

    public init(isBottom) {
        if (GamePlatform.platformName == GamePlatform.WX) {
            if (isBottom) {
                this.y = StaticData.gameHeight - this.height;
                if (StaticData.isIphoneX) {
                    this.y -= 50;
                }
            }
            this.initData();
        } else {
            this.visible = false;
        }  
    }

    private loadTime = 0;

    public initData() {
        this.loadTime++;
        if (this.loadTime > 10) {
            this.visible = false;
            return;
        }


        this.gl = StaticData.getGameListRadom(StaticData.getGameListSize());
        if (this.gl != null && this.gl.length > 0) {

            if (this.show) {
                this.visible = true;
            }

            this.hadLoadGameList = true;
            var path: Array<any>;

            let cmaskSpr = new Laya.Sprite();
            cmaskSpr.width = 138;
            cmaskSpr.height = 138;
            cmaskSpr.loadImage("images/leadout_icon_bg.png");

            for (let i = 0; i < this.gl.length; i++) {
                let itemDate = this.gl[i];
                let itemView = this.gameList.getChildAt(i) as Laya.Box;

                let gameIcon = itemView.getChildByName("gameIcon") as Laya.Sprite;
                let gameName = itemView.getChildByName("gameName") as Laya.Label;

                if (gameIcon != null) {
                    gameIcon.loadImage(itemDate.img, Laya.Handler.create(this, () => {
                        gameIcon.mask = cmaskSpr;
                    }));
                }

                gameName.text = itemDate.title;
                itemView.on(Laya.Event.CLICK, this, function () {
                    LeadOutUtil.leadOut(itemDate, this.ald_pois);
                });
            }

            Laya.timer.frameLoop(2, this, () => {
                this.scroll += this.offScroll;
                if (this.scroll <= (-this.gameList.width + StaticData.gameWidth)) {
                    this.offScroll *= -1;
                } else if (this.scroll >= 0) {
                    this.offScroll *= -1;
                }
                this.gameList.x = this.scroll;
            });
        } else {
            this.hadLoadGameList = false;
            Laya.timer.clearAll(this);
            Laya.timer.once(1000, this, this.initData)
        }
    }


    private ald_pois;
    public setAldPois(pois) {
        this.ald_pois = pois;
        console.log("LeadOutListRunTime 阿拉丁代号：",pois);   
    }

    private show = true;;
    public isShow(isShow: boolean) {

        this.show = isShow;
        this.visible = isShow;

        // console.log("leadout isShow:",isShow);
    }
} 