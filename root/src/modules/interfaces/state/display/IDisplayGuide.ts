import IRenderGuide from "../render/IRenderGuide";
import IDisplaySection from "./IDisplaySection";


export default interface IDisplayGuide extends IDisplaySection {

    guide: IRenderGuide;
}

