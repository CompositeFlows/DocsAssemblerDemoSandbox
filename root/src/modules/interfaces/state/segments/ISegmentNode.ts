import { OutlineType } from "../../enums/OutlineType";


export default interface ISegmentNode {

    text: string;
    key: string;
    type: OutlineType;
    isRoot: boolean;
    isLast: boolean;
}

