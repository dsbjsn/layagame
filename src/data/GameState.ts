import SingtonClass from "../utils/SingtonClass";

export default class GameState extends SingtonClass{
    public static  NOT_START=0;
    public static START=1;
    public static PUASE=2;
    public static FINISH=3;
    public static OVER=4;
}