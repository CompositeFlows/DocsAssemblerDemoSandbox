import { ScrollHopType } from "../enums/ScrollHopType";


export default interface IScreen {

    autofocus: boolean;
    isAutofocusFirstRun: boolean;
    hideBanner: boolean;
    scrollToTop: boolean;
    scrollToElement: string | null;
    scrollHop: ScrollHopType;
    lastScrollY: number;
}
