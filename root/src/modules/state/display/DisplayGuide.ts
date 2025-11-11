import IDisplayGuide from "../../interfaces/state/display/IDisplayGuide";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderGuide from "../../interfaces/state/render/IRenderGuide";
import IRenderOutline from "../../interfaces/state/render/IRenderOutline";
import RenderFragment from "../render/RenderFragment";


export default class DisplayGuide implements IDisplayGuide {

    constructor(
        linkID: number,
        guide: IRenderGuide,
        rootID: string
    ) {
        this.linkID = linkID;
        this.guide = guide;

        this.root = new RenderFragment(
            rootID,
            "guideRoot",
            this,
            0
        );
    }

    public linkID: number;
    public guide: IRenderGuide;
    public outline: IRenderOutline | null = null;
    public root: IRenderFragment;
    public current: IRenderFragment | null = null;
}
