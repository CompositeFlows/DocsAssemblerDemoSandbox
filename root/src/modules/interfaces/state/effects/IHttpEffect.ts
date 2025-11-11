import { ParseType } from "../../enums/ParseType";
import IState from "../IState";
import IStateAnyArray from "../IStateAnyArray";

export default interface IHttpEffect {
    
    name: string;
    url: string;
    parseType: ParseType;
    actionDelegate: (state: IState, response: any) => IStateAnyArray;
}
