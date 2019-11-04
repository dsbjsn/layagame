export default class AwardType {
    /**
     * 消息弹窗
     * StartAward:开局奖励
     * AddExchange:增加车票
     * AddCoin:增加金币
     * 
     * 到站奖励
     * CarAward:车辆奖励
     * MapAward:车辆奖励
     * CoinAward:车辆奖励
     */
    public static CarSkinAward = 1;
    public static AddExchangeartAward = 2;
    public static AddCoin = 3;

    public static CarAward = 4;
    public static MapAward = 5;
    public static CoinAward = 6;

    constructor(awardTitle: string, awardType: number, midleIcon: string, coinNum?: any, subtitle?: string) {
        this._awardTitle = awardTitle;
        this._awardType = awardType;
        this._midleIcon = midleIcon;

        if (subtitle) {
            this._subtitle = subtitle;
        }

        if (coinNum) {
            this._coinNum = coinNum;
        }
    }


    public _awardTitle;
    public _awardType;
    public _midleIcon;
    public _subtitle;
    public _coinNum;

}

