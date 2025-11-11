import IAction from "../IAction";
import IHttpEffect from "./IHttpEffect";


export default interface IRepeatEffects {
    
    shortIntervalHttp: Array<IHttpEffect>;
    // reLoadGetHttp: Array<IHttpEffect>;
    reLoadGetHttpImmediate: Array<IHttpEffect>;
    runActionImmediate: Array<IAction>;
}
