import ISettings from "./user/ISettings";
import IHistory from "./history/IHistory";
import IUser from "./user/IUser";
import IRepeatEffects from "./effects/IRepeatEffects";
import IRenderState from "./IRenderState";


export default interface IState {

    loading: boolean;
    debug: boolean;
    genericError: boolean;
    nextKey: number;
    settings: ISettings;
    user: IUser;

    // state
    renderState: IRenderState;
    
    repeatEffects: IRepeatEffects;

    stepHistory: IHistory;
}

