import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import IRenderOutlineLink from "../../interfaces/state/render/IRenderOutlineLink";


export default class RenderOutlineLink implements IRenderOutlineLink {

    constructor(chartIndex: number) {

        this.c = chartIndex;
    }
    
    public c: number; // index from outline chart array
    public p: Array<IRenderOutlineNode> = []; // plugs
}
