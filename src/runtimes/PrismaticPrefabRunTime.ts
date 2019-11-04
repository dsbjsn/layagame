export default class PrismaticPrefabRunTime extends Laya.Sprite {

    private joint: Laya.PrismaticJoint;

    private down_time=300;
    private up_time=1000;
    private off_y=100;
    private bigen_y;
    onAwake() {
        this.bigen_y = this.y;

        this.startAnim();
    }

    startAnim() {
        Laya.Tween.clearAll(this);
        Laya.Tween.to(this, { y: this.bigen_y + this.off_y }, this.down_time, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this, { y: this.bigen_y }, this.up_time, null, Laya.Handler.create(this, () => {
                Laya.timer.once(2000,this,()=>{
                    this.startAnim();
                });  
            }));
        }));
    }
}