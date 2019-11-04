import { roundRectPath } from "./common";
import SingtonClass from "./SingtonClass";

/**
 * 提示工具类
 */
export default class TipsUtil extends SingtonClass {
    //提示消息根容器
    public root: Laya.Sprite = null;
    //构造函数
    public constructor() {
        super();
        if (!this.root) {
            this.root = Laya.stage.addChild(new Laya.Sprite()) as Laya.Sprite;
            this.root.zOrder = 1001;
        }
    }
    //普通信息框 [静态方法]
    public static alert(content: string, options: any = {}, yes: Function = null) {
        TipsUtil.Instance().alert(content, options, yes);
    }
    //普通信息框
    public alert(content: string, options: any = {}, yes: Function = null) { }
    //提示框 [静态方法]
    public static msg(content: string, options: any = {}, end: Function = null) {
        TipsUtil.Instance().msg(content, options, end);
    }
    //提示框
    public msg(content: string, options: any = { time: 1500 }, end: Function = null) {
        let box: Laya.Box = this.root.addChild(new Laya.Box()) as Laya.Box;
        let bg: Laya.Sprite = box.addChild(new Laya.Sprite()) as Laya.Sprite;
        let txt: Laya.Label = box.addChild(new Laya.Label()) as Laya.Label;
        txt.text = content;
        txt.font = "SimHei";
        txt.color = "#ffffff";
        txt.padding = "15,15,15,15";
        txt.fontSize = 30;
        box.width = bg.width = txt.width;
        box.height = bg.height = txt.height;
        bg.graphics.drawPath(0, 0, roundRectPath(0, 0, txt.width, txt.height, 10), { fillStyle: "#000000" });
        bg.alpha = 0.5;
        box.x = (Laya.stage.width - box.width) / 2;
        box.y = (Laya.stage.height - box.height) / 2;
        setTimeout(() => {
            box.removeSelf();
            if (end) end();
        }, options.time || 1500);
    }
    //询问框 [静态方法]
    public static confirm(content: string, options: any = {}, yes: Function = null, cancel: Function = null) {
        TipsUtil.Instance().confirm(content, options, yes, cancel);
    }
    //询问框
    public confirm(content: string, options: any = {}, yes: Function = null, cancel: Function = null) {
        let box: Laya.Box = this.root.addChild(new Laya.Box()) as Laya.Box;
        let imgBg: Laya.Sprite = box.addChild(new Laya.Sprite()) as Laya.Sprite;
        let txtContent: Laya.Label = box.addChild(new Laya.Label()) as Laya.Label;
        let txtTitle: Laya.Label = box.addChild(new Laya.Label()) as Laya.Label;
        let txtBtnCancel: Laya.Label = box.addChild(new Laya.Label()) as Laya.Label;
        let txtBtnYes: Laya.Label = box.addChild(new Laya.Label()) as Laya.Label;
        txtTitle.dataSource = txtBtnCancel.dataSource = txtBtnYes.dataSource = txtContent.dataSource = {
            padding: "20,20,20,20",
            font: "SimHei",
            fontSize: 30,
            width: Laya.stage.width * 0.6,
            color: "#000000",
            align: "center",
            x: 0,
            y: 0,
            text: "提示",
            overflow: "hidden",
        };
        txtContent.dataSource = {
            padding: "20,20,40,20",
            overflow: "",
            fontSize: 25,
            wordWrap: true,
            text: content,
            color: options.contentColor || "#5A5A5A",
            y: txtTitle.height,
        };
        txtBtnCancel.dataSource = {
            text: options.cancelText || '否',
            width: txtTitle.width / 2,
            y: txtTitle.height + txtContent.height,
        };
        txtBtnYes.dataSource = {
            text: options.yesText || '是',
            width: txtTitle.width / 2,
            color: "#169C24",
            y: txtTitle.height + txtContent.height,
            x: txtTitle.width / 2,
        };
        box.dataSource = {
            width: Laya.stage.width * 0.6,
            height: txtTitle.height + txtContent.height + txtBtnYes.height,
            x: Laya.stage.width * 0.2,
            y: (Laya.stage.height - txtTitle.height - txtContent.height - txtBtnYes.height) / 2,
        };
        imgBg.graphics.drawPath(0, 0, roundRectPath(0, 0, box.width, box.height, 10), { fillStyle: "#FFFFFF" });
        imgBg.graphics.drawLine(0, txtTitle.height + txtContent.height, box.width, txtTitle.height + txtContent.height, "#D2D2D2", 1);
        imgBg.graphics.drawLine(box.width / 2, txtTitle.height + txtContent.height, box.width / 2, box.height, "#D2D2D2", 1);
        txtBtnCancel.on(Laya.Event.CLICK, this, (e: Laya.Event) => { box.removeSelf(); if (cancel) cancel(); })
        txtBtnYes.on(Laya.Event.CLICK, this, (e: Laya.Event) => { box.removeSelf(); if (yes) yes(); })
    }
    //显示加载层 [静态方法]
    public static showLoading() { TipsUtil.Instance().showLoading(); }
    //显示加载层 [静态方法]
    public static hideLoading() { TipsUtil.Instance().hideLoading(); }
    LoadingBox: Laya.Box = null;
    LoadingTimer: any = null;
    //显示加载层
    public showLoading() {
        if (!this.LoadingBox) {
            let arr: any[] = [
                { x: Math.SQRT1_2, y: Math.SQRT1_2 }, { x: 0, y: 1 },
                { x: -Math.SQRT1_2, y: Math.SQRT1_2 }, { x: -1, y: 0 },
                { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 0, y: -1 },
                { x: Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 1, y: 0 },
            ]
            this.LoadingBox = this.root.addChild(new Laya.Box()) as Laya.Box;
            this.LoadingBox.width = this.LoadingBox.height = 120;
            this.LoadingBox.anchorX = this.LoadingBox.anchorY = 0.5;
            this.LoadingBox.x = Laya.stage.width / 2;
            this.LoadingBox.y = Laya.stage.height / 2;
            for (let i: number = 0; i < 8; i++) {
                this.LoadingBox.graphics.drawCircle(arr[i].x * 60 + 60, arr[i].y * 60 + 60, 14 - i, "rgba(255,255,255," + (1 - 0.05 * i) + ")");
            }
        }
        this.LoadingBox.visible = true;
        this.LoadingTimer && clearInterval(this.LoadingTimer);
        this.LoadingTimer = setInterval(() => {
            this.LoadingBox.rotation -= 2;
        }, 30);
    }
    //显示加载层
    public hideLoading() {
        this.LoadingTimer && clearInterval(this.LoadingTimer);
        this.LoadingBox.visible = false;
    }
}
