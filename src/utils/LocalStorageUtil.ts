import SingtonClass from "./SingtonClass";

export default class LocalStorageUtil extends SingtonClass {
    private static rootPath = "motor"
    public constructor() {
        super();
    }

    public static add(key, val) {
        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, val);
    }

    public static remove(key) {
        Laya.LocalStorage.removeItem(LocalStorageUtil.rootPath + key);
    }

    public static getString(key) {
        return Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
    }

    public static getNumber(key) {
        let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        if (val == null || val == "") {
            return 0;
        } else {
            return Number(val);
        }
    }


    /**
     * 
     * @param key :key
     * @param df :初始值
     */
    public static getBoolean(key:string,df=false) {
        let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        console.log("val=",val);
        
        if (val!=null && val!="") {
            return val == "1";
        } else {
            return df;
        }
    }

    /**
     * 
     * @param key :key
     * @param is :value
     */
    public static setBoolean(key: string, is: boolean) {
        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, is ? "1" : "0");
    }
}