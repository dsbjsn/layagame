import SingtonClass from "../utils/SingtonClass";

export default class DialogModle  {
    private static dialogList:string[]=[];

    public static addDialog(dialogTag){
        this.dialogList.push(dialogTag);
    }

    public static popDialog(){
        if(this.dialogList.length>0){
            this.dialogList.pop();
        }
    }

    public static getDialogCount(){
        return this.dialogList.length;
    }
}