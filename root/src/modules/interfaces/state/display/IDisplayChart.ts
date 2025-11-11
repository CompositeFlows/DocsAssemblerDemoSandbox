import IRenderFragment from "../render/IRenderFragment";
import IRenderOutlineChart from "../render/IRenderOutlineChart";
import IDisplaySection from "./IDisplaySection";


export default interface IDisplayChart extends IDisplaySection {

    chart: IRenderOutlineChart;
    parent: IRenderFragment | null;
}

