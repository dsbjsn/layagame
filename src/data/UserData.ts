import SingtonClass from "../utils/SingtonClass";
import StaticData from "./StaticData";
import GamePlatform from "../adapter/GamePlatform";

export default class UserData extends SingtonClass{
    private static _nickName:String;
    private static _sex:String;
    private static _age:String;
    private static _avatarUrl:String;
    private static _code:String;
    private static _openId:String;
    
    public static getNickName(){
        return this._nickName;
    }

    public static getSex(){
        return this._sex;
    }

    public static getAge(){
        return this._age;
    }

    public static getAvatar(){
        return this._avatarUrl;
    }


    public static initUserInfo(nickName,sex,age,avatarUrl){
        this._nickName=nickName;
        this._sex=sex;
        this._age=age;
        this._avatarUrl=avatarUrl;
    }

    public static set Code(code){
        this._code=code;
    }

    public static get Code(){
        return this._code;
    }

    public static set OpenId(id){
        this._openId=id;
    }

    public static get OpenId(){
        return this._openId;
    }

    public static isLogin(){
        return this._nickName!=null &&this._avatarUrl!=null;
    }

    public static setOpenUser(){
        if(this._openId!=null && StaticData.levels!=null){
        let open:any =GamePlatform.openDataContext.createDisplayObject();
        let stationName;
        if (StaticData.level == 0) {
            stationName="出发地";
        }else{
            stationName=StaticData.getLevelData(StaticData.level-1).stationInfo.name;
        }
        let data={command: "user",openid: this._openId,score:StaticData.level,station_name:stationName}
      
        open.postMsg(data);
        }
    }
}