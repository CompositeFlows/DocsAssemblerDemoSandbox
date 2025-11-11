import IRenderSnapShot from "../../interfaces/state/history/IRenderSnapShot";


export default class RenderSnapShot implements IRenderSnapShot {

    constructor(url: string) {

        this.url = url;
    }

    public url: string;
    public guid: string | null = null;
    public created: Date | null = null;
    public modified: Date | null = null;
    public expandedOptionIDs: Array<string> = [];
    public expandedAncillaryIDs: Array<string> = [];
}
