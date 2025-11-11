import IRenderFragment from "../render/IRenderFragment";
import IRenderOutline from "../render/IRenderOutline";


export default interface IDisplaySection {
    
    linkID: number;
    outline: IRenderOutline | null;
    root: IRenderFragment | null;
    current: IRenderFragment | null;
}

