import IRenderFragment from "../../render/IRenderFragment";


export default interface IFragmentPayload {

    parentFragment: IRenderFragment;
    option: IRenderFragment;
    element: HTMLElement;
}
