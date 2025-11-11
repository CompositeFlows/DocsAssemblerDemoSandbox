import { OutlineType } from "../../enums/OutlineType";


export default interface IRenderOutlineNode {

    i: string; // id
    c: number | null; // index from outline chart array
    d: number | null; // index from outline chart array
    x: string | null | undefined; // exit id
    _x: string | null | undefined; // iExit id
    o: Array<IRenderOutlineNode>; // options
    parent: IRenderOutlineNode | null;
    type: OutlineType;
    isRoot: boolean;
    isLast: boolean;
    isChart: boolean;
}

