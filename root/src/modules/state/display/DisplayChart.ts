import IDisplayChart from "../../interfaces/state/display/IDisplayChart";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutline from "../../interfaces/state/render/IRenderOutline";
import IRenderOutlineChart from "../../interfaces/state/render/IRenderOutlineChart";


export default class DisplayChart implements IDisplayChart {

    constructor(
        linkID: number,
        chart: IRenderOutlineChart
    ) {
        this.linkID = linkID;
        this.chart = chart;
    }

    public linkID: number;
    public chart: IRenderOutlineChart;
    public outline: IRenderOutline | null = null;
    public root: IRenderFragment | null = null;
    public parent: IRenderFragment | null = null;
    public current: IRenderFragment | null = null;
}
