import { ScrollHopType } from "../../interfaces/enums/ScrollHopType";
import IScreen from "../../interfaces/window/IScreen";


export default class Screen implements IScreen {

    public autofocus: boolean = false;
    public isAutofocusFirstRun: boolean = true;
    public hideBanner: boolean = false;
    public scrollToTop: boolean = false;
    public scrollToElement: string | null = null;
    public scrollHop: ScrollHopType = ScrollHopType.None;
    public lastScrollY: number = 0;

    public ua: any | null = null;
}
