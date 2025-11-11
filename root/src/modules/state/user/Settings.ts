import ISettings from "../../interfaces/state/user/ISettings";


export default class Settings implements ISettings {

    public key: string = "-1";
    public r: string = "-1";

    // Authentication
    public userPath: string = `user`;
    public defaultLogoutPath: string = `logout`;
    public defaultLoginPath: string = `login`;
    public returnUrlStart: string = `returnUrl`;

    private baseUrl: string = (window as any).ASSISTANT_BASE_URL ?? '';
    public linkUrl: string = (window as any).ASSISTANT_LINK_URL ?? '';
    public subscriptionID: string = (window as any).ASSISTANT_SUBSCRIPTION_ID ?? '';

    public apiUrl: string = `${this.baseUrl}/api`;
    public bffUrl: string = `${this.baseUrl}/bff`;
    public fileUrl: string = `${this.baseUrl}/file`;
}
