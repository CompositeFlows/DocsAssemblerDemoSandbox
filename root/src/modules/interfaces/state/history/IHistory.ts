import { navigationDirection } from "../../enums/navigationDirection";
import IHistoryUrl from "./IHistoryUrl";


export default interface IHistory {

    historyChain: Array<IHistoryUrl>;
    direction: navigationDirection;
    currentIndex: number;
}

