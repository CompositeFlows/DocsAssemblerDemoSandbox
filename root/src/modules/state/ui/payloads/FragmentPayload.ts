import IRenderFragment from "../../../interfaces/state/render/IRenderFragment";
import IFragmentPayload from "../../../interfaces/state/ui/payloads/IFragmentPayload";


export default class FragmentPayload implements IFragmentPayload {

    constructor(
        parentFragment: IRenderFragment,
        option: IRenderFragment,
        element: HTMLElement
    ) {

        this.parentFragment = parentFragment;
        this.option = option;
        this.element = element;
    }

    public parentFragment: IRenderFragment;
    public option: IRenderFragment;
    public element: HTMLElement;
}
