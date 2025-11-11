import { OutlineType } from "../../interfaces/enums/OutlineType";
import ISegmentNode from "../../interfaces/state/segments/ISegmentNode";


export default class SegmentNode implements ISegmentNode{

    constructor(
        text: string,
        key: string,
        type: OutlineType,
        isRoot: boolean,
        isLast: boolean
    ) {
        this.text = text;
        this.key = key;
        this.type = type;
        this.isRoot = isRoot;
        this.isLast = isLast;
    }

    public text: string;
    public key: string;
    public type: OutlineType;
    public isRoot: boolean;
    public isLast: boolean;
}

