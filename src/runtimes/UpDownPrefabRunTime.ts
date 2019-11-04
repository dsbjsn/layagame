export default class UpDownPrefabRunTime extends Laya.Sprite {
    private run_time=2000;
    private delay_time=2000;
    private off_y=180;
    private bigen_y;

    onAwake() {
        this.bigen_y = this.y;
        this.startAnim();
    }

    startAnim() {
        Laya.Tween.clearAll(this);
        this.down();
    }

    down(){
     
        Laya.Tween.to(this, { y: this.bigen_y + this.off_y }, this.run_time, null, Laya.Handler.create(this, () => {
            Laya.timer.once(this.delay_time,this,()=>{this.up();}) 
        }));
    }

    up(){
        // console.log("UpDownPrefabRunTime  up",this.bigen_y);
        Laya.Tween.to(this, { y: this.bigen_y }, this.run_time, null, Laya.Handler.create(this, () => {
            Laya.timer.once(this.delay_time,this,()=>{this.startAnim();})                       
        }));
    }

    onDisable(){
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }

    public setOffset(offset){
        this.off_y=offset;
        this.run_time=this.off_y/180*2000;
        if(this!=null){
            this.startAnim();
        }
    }
}