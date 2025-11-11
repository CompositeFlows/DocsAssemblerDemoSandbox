import IDisplayChart from "../../interfaces/state/display/IDisplayChart";
import IDisplaySection from "../../interfaces/state/display/IDisplaySection";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderFragmentUI from "../../interfaces/state/ui/IRenderFragmentUI";
import RenderFragmentUI from "../ui/RenderFragmentUI";


export default class RenderFragment implements IRenderFragment {

    constructor(
        id: string,
        parentFragmentID: string,
        section: IDisplaySection,
        segmentIndex: number | null
    ) {
        this.id = id;
        this.section = section;
        this.parentFragmentID = parentFragmentID;
        this.segmentIndex = segmentIndex;
    }

    public id: string;
    public iKey: string | null = null;
    public iExitKey: string | null = null;
    public exitKey: string | null = null;
    public podKey: string | null = null;
    public podText: string | null = null;
    public topLevelMapKey: string = '';
    public mapKeyChain: string = '';
    public guideID: string = '';
    public parentFragmentID: string;
    public value: string = '';
    public selected: IRenderFragment | null = null;
    public isLeaf: boolean = false;
    public options: Array<IRenderFragment> = [];
    public variable: Array<[string] | [string, string]> = [];
    public classes: Array<string> = [];

    public option: string = '';
    public isAncillary: boolean = false;
    public order: number = 0;

    public link: IDisplayChart | null = null;
    public pod: IDisplayChart | null = null;
    public section: IDisplaySection;
    public segmentIndex: number | null;

    public ui: IRenderFragmentUI = new RenderFragmentUI();
}
