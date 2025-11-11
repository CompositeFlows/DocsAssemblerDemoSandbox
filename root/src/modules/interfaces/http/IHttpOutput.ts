

export default interface IHttpOutput {
    
    ok: boolean;
    url: string;
    authenticationFail: boolean;
    parseType: string;
    status?: number;
    type?: string;
    redirected?: boolean;
    callID?: string;
    contentType?: string;
    responseNull?: boolean;
    textData?: string;
    jsonData?: any;
    error?: any;
}
