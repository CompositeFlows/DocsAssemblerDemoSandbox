import IState from "../interfaces/state/IState";
import Settings from "./user/Settings";
import ISettings from "../interfaces/state/user/ISettings";
import IHistory from "../interfaces/state/history/IHistory";
import StepHistory from "./history/History";
import IUser from "../interfaces/state/user/IUser";
import User from "./user/User";
import IRepeatEffects from "../interfaces/state/effects/IRepeatEffects";
import RepeateEffects from "./effects/RepeateEffects";
import IRenderState from "../interfaces/state/IRenderState";
import RenderState from "./RenderState";


export default class State implements IState {

    constructor() {

        const settings: ISettings = new Settings();
        this.settings = settings;
    }

    public loading: boolean = true;
    public debug: boolean = true;
    public genericError: boolean = false;
    public nextKey: number = -1;
    public settings: ISettings;
    public user: IUser = new User();
    
    public renderState: IRenderState = new RenderState();

    public repeatEffects: IRepeatEffects = new RepeateEffects();

    public stepHistory: IHistory = new StepHistory();
}


