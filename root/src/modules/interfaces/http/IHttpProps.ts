import IState from "../state/IState";
import IStateAnyArray from "../state/IStateAnyArray";
import IHttpOptions from "./IHttpOptions";


export default interface IHttpProps {
    
    url: string;
    parseType?: string;
    options: IHttpOptions;
    response: string;
    action: (state: IState, response: any) => IStateAnyArray;
    error: any;
}
