import IUser from "../../interfaces/state/user/IUser";


export default class User implements IUser {

    public key: string = `0123456789`;
    public r: string = "-1";
    public useVsCode: boolean = true;
    public authorised: boolean = false;
    public raw: boolean = true;
    public logoutUrl: string = "";
    public showMenu: boolean = false;
    public name: string = "";
    public sub: string = "";
}
