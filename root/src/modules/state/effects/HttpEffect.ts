import { ParseType } from "../../interfaces/enums/ParseType";
import IHttpEffect from "../../interfaces/state/effects/IHttpEffect";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";


export default class HttpEffect implements IHttpEffect {

    constructor(
        name: string,
        url: string,
        parseType: ParseType,
        actionDelegate: (state: IState, response: any) => IStateAnyArray) {

        this.name = name;
        this.url = url;
        this.parseType = parseType;
        this.actionDelegate = actionDelegate;
    }

    public name: string;
    public url: string;
    public parseType: ParseType;
    public actionDelegate: (state: IState, response: any) => IStateAnyArray;
}
