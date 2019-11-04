export default class LeftRightPrefabRunTime extends Laya.Sprite {
    private run_time=2000;
    private delay_time=2000;
    private off_x=150;
    private bigen_x;
    onAwake() {
        this.bigen_x = this.x;
    }

    public startAnim() {
        Laya.Tween.clearAll(this);
        this.right();
    }

    right(){
        Laya.Tween.to(this, { x: this.bigen_x + this.off_x }, this.run_time, null, Laya.Handler.create(this, () => {
            Laya.timer.once(this.delay_time,this,()=>{this.left();}) 
        }));
    }

    left(){
        Laya.Tween.to(this, { x: this.bigen_x }, this.run_time, null, Laya.Handler.create(this, () => {
            Laya.timer.once(this.delay_time,this,()=>{this.startAnim();})                       
        }));
    }

    onDisable(){
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }

    public setOffset(offset){
        this.off_x=offset;
        this.run_time=this.off_x/150*2000;
        if(this!=null){
            Laya.Tween.clearAll(this);
            this.once(Laya.Event.TRIGGER_ENTER,this,(other)=>{
                Laya.timer.once(1000,this,()=>{this.startAnim();});
            })
        }
    }

    
}