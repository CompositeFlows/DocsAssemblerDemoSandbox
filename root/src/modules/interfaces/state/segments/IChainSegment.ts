import IDisplaySection from "../display/IDisplaySection";
import IRenderOutlineNode from "../render/IRenderOutlineNode";
import ISegmentNode from "./ISegmentNode";


export default interface IChainSegment {

    index: number;
    text: string;
    outlineNodes: Array<IRenderOutlineNode>;
    outlineNodesLoaded: boolean;

    start: ISegmentNode;
    end: ISegmentNode;

    segmentInSection: IDisplaySection | null;
    segmentSection: IDisplaySection | null;
    segmentOutSection: IDisplaySection | null;
}

