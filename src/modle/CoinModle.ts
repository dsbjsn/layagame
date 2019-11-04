import BaseModle from "./BaseModle";
import StaticData from "../data/StaticData";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import TipsUtil from "../utils/TipsUtil";
import SoundUtil from "../utils/SoundUtil";
import StartGameManage from "../manages/dialogManage/StartDialogManage";
import ShopManage from "../manages/dialogManage/ShopManage";
import BaseDialogManage from "../manages/dialogManage/BaseDialogManage";

export default class CoinModle extends BaseModle{
    public static isDoubleCoin = false;
    private static COIN="COIN";
    private static coin:number=0;
    static init(debugNum?){
        if(debugNum){
            this.coin=debugNum;
        }else{
          //记录金币
             this.coin=LocalStorageUtil.getNumber(this.COIN);
        }
    }

    static doubleCoin(isDouble: boolean) {
        this.isDoubleCoin = isDouble;
    }

    static addCoin(addNum:number){
        this.coin+=addNum;
        LocalStorageUtil.add(this.COIN,this.coin);
        TipsUtil.msg("获得"+addNum+"金币");
        BaseDialogManage.getInstance().refreshCoin();
        SoundUtil.playCoin();
    }

    // static addCoin(addNum:number){
    //     this.coin+=addNum;
    //     LocalStorageUtil.add(this.COIN,this.coin);
    //     TipsUtil.msg("获得"+addNum+"金币");

    //     try {
    //         if(StartGameManage.getInstance()!=null)
    //         StartGameManage.getInstance().owner.initCoin();

    //         if(ShopManage.getInstance()!=null)
    //         ShopManage.getInstance().owner.initCoin();
    //     } catch (error) {
            
    //     }

    //     SoundUtil.playCoin();
    // }

    static  reduceCoin(reduceNum:number){
        if(this.coin<reduceNum){
            TipsUtil.msg("金币不足");
        }else{
            this.coin-=reduceNum;
            LocalStorageUtil.add(this.COIN,this.coin);
            if(BaseDialogManage.getInstance()!=null){
                BaseDialogManage.getInstance().refreshCoin();
            }
        }
    }

    static getCoin(){
        return this.coin;
    }
}