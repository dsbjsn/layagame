export default class InvisiblePrefabRunTime extends Laya.Sprite {
    private time=2000;
    private delay_time=2000;

    private rigid:Laya.RigidBody;

    onAwake() {
        this.rigid=this.getComponent(Laya.RigidBody) as Laya.RigidBody;
        this.startAnim();
    }

    startAnim() {
        Laya.Tween.clearAll(this);
        this.show();
    }

    show(){
        Laya.Tween.to(this, { alpha: 1}, this.time, null, Laya.Handler.create(this, () => {
            (this.getComponent(Laya.BoxCollider) as Laya.BoxCollider).y=0;
            Laya.timer.once(this.delay_time,this,()=>{this.hide();}) 
        }));
    }

    hide(){
        Laya.Tween.to(this, {alpha: 0.1 }, this.time, null, Laya.Handler.create(this, () => {
            (this.getComponent(Laya.BoxCollider) as Laya.BoxCollider).y=this.height*2;
            Laya.timer.once(this.delay_time,this,()=>{this.startAnim();})                       
        }));
    }

    onDisable(){
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }
}