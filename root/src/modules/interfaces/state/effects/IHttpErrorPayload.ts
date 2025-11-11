
export default interface IHttpErrorPayload {
    
    requestUrl: string;
    requestBody: any;
    callID: string;
    type: string;
    title: string;
    token: string | null;
    time: Date;
}
