import IUrlAssembler from "../../interfaces/state/history/IUrlAssembler";
import IState from "../../interfaces/state/IState";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import HistoryUrl from "../../state/history/HistoryUrl";
import RenderSnapShot from "../../state/history/RenderSnapShot";
import U from "../gUtilities";


const buildUrlFromRoot = (root: IRenderFragment): string => {

    const urlAssembler: IUrlAssembler = {

        url: `${location.origin}${location.pathname}?`
    }

    if (!root.selected) {

        return urlAssembler.url;
    }

    printSegmentEnd(
        urlAssembler,
        root
    )

    return urlAssembler.url;
};

const printSegmentEnd = (
    urlAssembler: IUrlAssembler,
    fragment: IRenderFragment | null | undefined
): void => {

    if (!fragment) {
        return;
    }

    if (fragment.link?.root) {

        let url = urlAssembler.url;
        url = `${url}~${fragment.id}`;
        urlAssembler.url = url;

        printSegmentEnd(
            urlAssembler,
            fragment.link.root,
        )
    }
    else if (!U.isNullOrWhiteSpace(fragment.exitKey)) {

        let url = urlAssembler.url;
        url = `${url}_${fragment.id}`;
        urlAssembler.url = url;
    }
    else if (!fragment.link
        && !fragment.selected
    ) {
        let url = urlAssembler.url;
        url = `${url}-${fragment.id}`;
        urlAssembler.url = url;
    }

    printSegmentEnd(
        urlAssembler,
        fragment.selected,
    )
};


const gHistoryCode = {

    resetRaw: (): void => {

        window.TreeSolve.screen.autofocus = true;
        window.TreeSolve.screen.isAutofocusFirstRun = true;
    },

    pushBrowserHistoryState: (state: IState): void => {

        if (state.renderState.isChainLoad === true) {
            return;
        }

        state.renderState.refreshUrl = false;

        if (!state.renderState.currentSection?.current
            || !state.renderState.displayGuide?.root
        ) {
            return;
        }

        gHistoryCode.resetRaw();
        const location = window.location;
        let lastUrl: string;

        if (window.history.state) {

            lastUrl = window.history.state.url;
        }
        else {
            lastUrl = `${location.origin}${location.pathname}${location.search}`;
        }

        const url = buildUrlFromRoot(state.renderState.displayGuide.root);

        if (lastUrl
            && url === lastUrl) {
            return;
        }

        history.pushState(
            new RenderSnapShot(url),
            "",
            url
        );

        state.stepHistory.historyChain.push(new HistoryUrl(url));
    }
};

export default gHistoryCode;

