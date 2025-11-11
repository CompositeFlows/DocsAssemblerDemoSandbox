import { navigationDirection } from "../../interfaces/enums/navigationDirection";
import IHistory from "../../interfaces/state/history/IHistory";
import IHistoryUrl from "../../interfaces/state/history/IHistoryUrl";


export default class History implements IHistory {

    public historyChain: Array<IHistoryUrl> = [];
    public direction: navigationDirection = navigationDirection.Buttons;
    public currentIndex: number = 0;
}
