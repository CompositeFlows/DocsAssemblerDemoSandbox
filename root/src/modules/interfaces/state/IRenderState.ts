import IDisplayGuide from "./display/IDisplayGuide";
import IDisplaySection from "./display/IDisplaySection";
import IRenderFragment from "./render/IRenderFragment";
import IChainSegment from "./segments/IChainSegment";
import IRenderStateUI from "./ui/IRenderStateUI";


export default interface IRenderState {

    refreshUrl: boolean;
    isChainLoad: boolean;
    segments: Array<IChainSegment>;
    displayGuide: IDisplayGuide | null;
    outlines: any;
    outlineUrls: any;
    currentSection: IDisplaySection | null;

    activeAncillary: IRenderFragment | null;
    
    // Search indices
    index_outlineNodes_id: any;
    index_chainFragments_id: any;

    ui: IRenderStateUI;
}
