import IRenderFragmentUI from "../../interfaces/state/ui/IRenderFragmentUI";


export default class RenderFragmentUI implements IRenderFragmentUI {

    public fragmentOptionsExpanded: boolean = false;
    public discussionLoaded: boolean = false;
    public ancillaryExpanded: boolean = false;
    public doNotPaint: boolean = false;
    public sectionIndex: number = 0;
}
