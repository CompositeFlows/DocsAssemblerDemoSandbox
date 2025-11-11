import { OutlineType } from "../../interfaces/enums/OutlineType";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";


export default class RenderOutlineNode implements IRenderOutlineNode {

    public i: string = ''; // id
    public c: number | null = null; // index from outline chart array
    public d: number | null = null; // index from outline chart array
    public x: string | null | undefined = null; // iExit id
    public _x: string | null | undefined = null; // exit id
    public o: Array<IRenderOutlineNode> = []; // options
    public parent: IRenderOutlineNode | null = null;
    public type: OutlineType = OutlineType.Node;
    public isChart: boolean = true;
    public isRoot: boolean = false;
    public isLast: boolean = false;
}
