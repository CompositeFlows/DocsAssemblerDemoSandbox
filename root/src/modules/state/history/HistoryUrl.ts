import IHistoryUrl from "../../interfaces/state/history/IHistoryUrl";


export default class HistoryUrl implements IHistoryUrl {

    constructor(url: string) {
        
        this.url = url;
    }

    public url: string;
}
