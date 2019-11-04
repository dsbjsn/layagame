/**
 * 单例基类
 */
export default class SingtonClass {
    //构造函数
    public constructor() {}

    
    /**
     * 获取一个单例
     * @returns {any}
     */
    public static Instance(...param: any[]): any {
        let Class:any = this;
        if (!Class._instance) {
            Class._instance = new Class(...param);
        }
        return Class._instance;
    }
}