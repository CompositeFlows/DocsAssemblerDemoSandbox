import IDisplayChart from "../display/IDisplayChart";
import IDisplaySection from "../display/IDisplaySection";
import IRenderFragmentUI from "../ui/IRenderFragmentUI";


export default interface IRenderFragment {

    id: string;
    iKey: string | null;
    iExitKey: string | null;
    exitKey: string | null;
    podKey: string | null;
    podText: string | null;
    topLevelMapKey: string;
    mapKeyChain: string;
    guideID: string;
    parentFragmentID: string | null;
    value: string;
    selected: IRenderFragment | null;
    isLeaf: boolean;
    options: Array<IRenderFragment>;
    variable: Array<[string] | [string, string]>;
    classes: Array<string>;

    option: string;
    isAncillary: boolean;
    order: number;

    link: IDisplayChart | null;
    pod: IDisplayChart | null;
    section: IDisplaySection;
    segmentIndex: number | null;

    ui: IRenderFragmentUI;
}

