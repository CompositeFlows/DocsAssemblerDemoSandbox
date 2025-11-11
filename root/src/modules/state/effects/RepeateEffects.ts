import IRepeatEffects from "../../interfaces/state/effects/IRepeatEffects";
import IHttpEffect from "../../interfaces/state/effects/IHttpEffect";
import IAction from "../../interfaces/state/IAction";


export default class RepeateEffects implements IRepeatEffects {

    public shortIntervalHttp: Array<IHttpEffect> = [];
    public reLoadGetHttpImmediate: Array<IHttpEffect> = [];
    public runActionImmediate: Array<IAction> = [];
}
