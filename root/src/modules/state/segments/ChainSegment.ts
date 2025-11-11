import IDisplaySection from "../../interfaces/state/display/IDisplaySection";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import IChainSegment from "../../interfaces/state/segments/IChainSegment";
import ISegmentNode from "../../interfaces/state/segments/ISegmentNode";


export default class ChainSegment implements IChainSegment {

    constructor(
        index: number,
        start: ISegmentNode,
        end: ISegmentNode
    ) {
        this.index = index;
        this.start = start;
        this.end = end;
        this.text = `${start.text}${end?.text ?? ''}`;
    }

    public index: number;
    public text: string;
    public outlineNodes: Array<IRenderOutlineNode> = [];
    public outlineNodesLoaded: boolean = false;

    public start: ISegmentNode;
    public end: ISegmentNode;

    public segmentInSection: IDisplaySection | null = null;
    public segmentSection: IDisplaySection | null = null;
    public segmentOutSection: IDisplaySection | null = null;
}

