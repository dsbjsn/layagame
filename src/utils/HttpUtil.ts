import { md5 } from "./md5"

export default class HttpUtil {
    //token
    public TOKEN: string = '';
    //单例
    public static _instance: HttpUtil;
    public static get Instance() {
        if (!HttpUtil._instance)
            new HttpUtil()
        return HttpUtil._instance
    }
    //构造函数
    constructor() {
        HttpUtil._instance = this
    }
    /**
     * 发起请求[静态方法]
     * @param param 
     */
    public static request(param: any) {
        HttpUtil.Instance.request(param);
    }

    /**
     * 发起请求
     * @param param 
     */
    public request(param: any) {
        //整理请求参数
        param = this.param(param)
        let r: Laya.HttpRequest = new Laya.HttpRequest()
        //添加监听事件 完成
        r.once(Laya.Event.COMPLETE, this, () => { if (param.complete) param.complete(r.data) })
        //添加监听事件 异常
        r.once(Laya.Event.ERROR, this, err => { if (param.error) param.error(err) })
        //发起请求
        r.send(param.url, this.obj2str(param.data), param.method, param.responseType)
    }
    /**
     * 整理请求参数
     * @param param
     */
    private param(param: any = {}) {
        let d: any = param.data || {}
    
        param.data = d
        param.method = param.method || 'post'
        param.responseType = param.responseType || 'json'
        
        return param
    }
    /**
	 * 对obj的 属性名进行sort排序 
	 * 并返回属性名sort排序后的对象
	 * @param {object} param 需要进行排序的对象
	 * @return {object} newparam 排序完成的新对象
	 */
    private objSort(param: any) {
        var newkeyArray = Object.keys(param).sort();
        var newParam = {};//创建一个新的对象，用于存放排好序的键值对(Object)
        //遍历newkeyArray数组   
        for (var i = 0; i < newkeyArray.length; i++) {
            newParam[newkeyArray[i]] = param[newkeyArray[i]];//向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newParam;//返回排好序的新对象
    }
    //生成sign
    private createSign(param: any) {
        for (let i in ['sign', 'id', 'action', 'api', 'version'])
            if (typeof (param[i]) != "undefined")
                delete param[i];
        //对param进行sort排序
        var newParam = this.objSort(param);
        var signString = '';
        for (var i in newParam) {
            signString += i + newParam[i];
        }
        // signString += api.salt;//添加混淆字符串
        return new md5().hex_md5(signString)
    }
    /**
	 * 将请求参数转化字符串
	 */
    public obj2str(param) {
        let str: string = ''
        for (let k in param) {
            str += '&' + k + '=' + param[k]
        }
        return str.substring(1)
    }
}