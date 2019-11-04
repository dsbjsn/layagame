import ConfigData from "../../config/ConfigData";
import WxADUtil from "../../utils/WxADUtil";
import AldUtil from "../../utils/AldUtil";
import StaticData from "../../data/StaticData";
import BaseDialogManage from "../dialogManage/BaseDialogManage";
import GamePlatform from "../../adapter/GamePlatform";

export default class RankDiaogManage extends BaseDialogManage {

    private closeSpr: Laya.Sprite;
    private otherGame: Laya.Sprite;
    private inviteSpr: Laya.Sprite;
    private ownerItem: Laya.Sprite;
    private rankPanel: Laya.Panel;


    onEnable(): void {
        super.onEnable();
        this.closeSpr = this.contentSpr.getChildByName("close") as Laya.Sprite;
        this.otherGame = this.contentSpr.getChildByName("otherGames") as Laya.Sprite;
        this.inviteSpr = this.contentSpr.getChildByName("inviteSpr") as Laya.Sprite;
        this.ownerItem = this.contentSpr.getChildByName("ownerItem") as Laya.Sprite;

        this.rankPanel = this.contentSpr.getChildByName("rankPanel") as Laya.Panel;
        this.rankPanel.vScrollBar.hide = true;//隐藏列表的滚动条
        this.rankPanel.vScrollBar.elasticBackTime = 200;//设置橡皮筋回弹时间单位为毫秒
        this.rankPanel.vScrollBar.elasticDistance = 120;//设置橡皮筋极限距离

        this.closeSpr.on(Laya.Event.CLICK, this, this.closeAction);
        
        this.otherGame.on(Laya.Event.CLICK, this, ()=>{
            AldUtil.upload(CustomAction.RankDialog_Games);
            Laya.Dialog.open(ConfigData.OthersGamesDialog);
        });
        this.inviteSpr.on(Laya.Event.CLICK, this, ()=>{
            AldUtil.upload(CustomAction.RankDialog_Share);
            WxADUtil.share({});
        });

        this.showRankList();
      
        // this.showOwner();
        
    }

    closeAction() {
        this.owner.close();
        Laya.Dialog.open(ConfigData.StartGameDialog);
    }

    showRankList() {
        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame ) {
            let open: any = this.rankPanel.addChild(GamePlatform.openDataContext.createDisplayObject());
            open.width = this.rankPanel.width;
            open.height = 110*10;
            open.postMsg({
                command: "rank_list",
                data: { width: this.rankPanel.width, height: 110*10 }
            });
        }
    }

    showOwner(){
        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame ) {
            let open: any = this.ownerItem.addChild(GamePlatform.openDataContext.createDisplayObject());
            open.width = this.ownerItem.width;
            open.height = this.ownerItem.height;
            open.postMsg({
                command: "rank_owner",
                data: { width: this.rankPanel.width, height: this.ownerItem.height }
            });
        }
    }
}