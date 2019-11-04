import GamePlatform from "../adapter/GamePlatform";
import StaticData from "../data/StaticData";

export default class ViewUtil {
    static goneViews(views: Laya.Sprite[]) {
        if (views != null) {
            for (let spr of views) {
                if (spr != null) {
                    spr.visible = false;
                }
            }
        }
    }

    static visibleViews(views: Laya.Sprite[]) {
        if (views != null) {
            for (let spr of views) {
                if (spr != null) {
                    spr.visible = true;
                }
            }
        }
    }

    static adapterPositionJL(view: Laya.Sprite) {
        if (view != null
            && (GamePlatform.platformName == GamePlatform.WX || GamePlatform.platformName == GamePlatform.QQ)
            && (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame)) {
            let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
            let off = (data.height * StaticData.clientScale - view.height) / 2;
            view.y = data.top * StaticData.clientScale + off;
        }
    }
}