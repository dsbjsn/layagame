import SingtonClass from "../utils/SingtonClass";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import TipsUtil from "../utils/TipsUtil";
import CoinModle from "./CoinModle";
import SkinModle from "./SkinModle";
import BaseModle from "./BaseModle";

export default class SignModle extends BaseModle {
    private static KEY_SignDays = "KEY_SignDays";
    private static KEY_LastSignDate = "KEY_LastSignDate";
    private static KEY_LastSignMonth = "KEY_LastSignMonth";
    private static KEY_hadCarAward = "KEY_hadCarAward";

    private static signDays: number = 0;
    private static lastSignDate: number = 0;
    private static lastSignMonth: number = 0;

    private static todaySigned = false;

    //是否领取了车子奖励，1：以后都改为金币
    public static hadCarAward = 0;

    public static coinNum=[50,80,120,180,280,400,600];

    public static carAward={"id":8,"name":"爱心踏板车","img":"images/carSkin/carSkinBig/car_skin_8.png","x":253,"y":44};
    static init() {
        SignModle.lastSignDate = LocalStorageUtil.getNumber(SignModle.KEY_LastSignDate);
        SignModle.lastSignMonth = LocalStorageUtil.getNumber(SignModle.KEY_LastSignMonth);

        SignModle.hadCarAward= LocalStorageUtil.getNumber(SignModle.KEY_hadCarAward);

        let date = new Date();
        let today_date = date.getDate();
        let today_month = date.getMonth() + 1;

        SignModle.todaySigned = (SignModle.lastSignDate == today_date && SignModle.lastSignMonth == today_month);   

        SignModle.signDays = LocalStorageUtil.getNumber(SignModle.KEY_SignDays);
        // SignModle.signDays=6;
        // SignModle.todaySigned=false;

        if( SignModle.signDays==7 && !SignModle.todaySigned){
            SignModle.signDays=0;
            LocalStorageUtil.add(SignModle.KEY_SignDays, SignModle.signDays);
        }

        // console.log("签到信息 签到次数：", SignModle.signDays, "签到时间：", SignModle.lastSignMonth, SignModle.lastSignDate);
        // console.log("今天是否签到：",SignModle.todaySigned);
        // console.log("车子奖励是否领取：",SignModle.hadCarAward);  
    }

    static getSignDays(): number {
        return SignModle.signDays;
    }

    static getLastSignDate(): number {
        return SignModle.lastSignDate;
    }

    static getTodaySigned(){
        return SignModle.todaySigned;
    }

    static sign(doubleAward:boolean) {
        if(SignModle.signDays==6){
            if(SignModle.hadCarAward==0){
                SkinModle.addCarSkin(SignModle.carAward.id)
                SignModle.hadCarAward =1;
                LocalStorageUtil.add(SignModle.KEY_hadCarAward,SignModle.hadCarAward);
            }else{
                let coinNum=SignModle.coinNum[SignModle.signDays];
                if(doubleAward){
                    CoinModle.addCoin(coinNum*2);
                }else{
                    CoinModle.addCoin(coinNum);
                }     
            }
        }else{
            let coinNum=SignModle.coinNum[SignModle.signDays];
            if(doubleAward){
                CoinModle.addCoin(coinNum*2);
            }else{
                CoinModle.addCoin(coinNum);
            }
            
        }

        SignModle.signDays+=1;
        LocalStorageUtil.add (SignModle.KEY_SignDays, SignModle.signDays);

        let date = new Date();
        SignModle.lastSignMonth = date.getMonth() + 1;
        SignModle.lastSignDate = date.getDate();
        LocalStorageUtil.add(SignModle.KEY_LastSignMonth, SignModle.lastSignMonth);
        LocalStorageUtil.add(SignModle.KEY_LastSignDate, SignModle.lastSignDate);

        SignModle.todaySigned=true;
        // console.log("签到成功 签到次数：", SignModle.signDays, "签到时间：", SignModle.lastSignMonth, SignModle.lastSignDate);
    }

    private static isLastDay(today_date, today_month): boolean {
        if (today_month == SignModle.lastSignMonth + 1 || (today_month == 1 && SignModle.lastSignMonth == 12)) {
            if ((SignModle.lastSignMonth == 1
                || SignModle.lastSignMonth == 3
                || SignModle.lastSignMonth == 5
                || SignModle.lastSignMonth == 7
                || SignModle.lastSignMonth == 8
                || SignModle.lastSignMonth == 10
                || SignModle.lastSignMonth == 12)
                && SignModle.lastSignDate == 31) {
                return true;
            }

            else if ((SignModle.lastSignMonth == 4
                || SignModle.lastSignMonth == 6
                || SignModle.lastSignMonth == 9
                || SignModle.lastSignMonth == 11)
                && SignModle.lastSignDate == 30) {
                return true;
            }

            else if (SignModle.lastSignMonth == 2
                && (SignModle.lastSignDate == 28 || SignModle.lastSignDate == 29)) {
                return true;
            }

            else {
                return false;
            }
        }
    }
}