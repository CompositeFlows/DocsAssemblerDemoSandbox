import IRenderOutline from "../../interfaces/state/render/IRenderOutline";
import IRenderOutlineChart from "../../interfaces/state/render/IRenderOutlineChart";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import RenderOutlineNode from "./RenderOutlineNode";


export default class RenderOutline implements IRenderOutline {

    constructor(path: string) {

        this.path = path;
    }

    public path: string;
    public loaded = false;

    public v: string = '';
    public r: IRenderOutlineNode = new RenderOutlineNode();
    public c: Array<IRenderOutlineChart> = [];
    public e: number | undefined;
    public mv: any | undefined;
}
