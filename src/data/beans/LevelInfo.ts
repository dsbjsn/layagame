class LevelInfo{
    public maxRange:number;
    public stationInfo:StationPoing;
    public awards:AwardData;
    public load:Array<number>;
    public loadFriction:number;
    public background:string;
    public hinders:Array<Hinder>;
}

class StationPoing{
    public distance:number=100;
    public x:number;
    public y:number;
    public name:string;
    public introduction:string;
}

class AwardData {
    public type: string;
    public id: number;
}

class Hinder{
    public type:number;
    public x:number;
    public y:number;
    public offset:number;
}