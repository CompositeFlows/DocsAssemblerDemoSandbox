import { Children } from "hyper-app-local";
import { h } from "../../../../hyperApp/hyper-app-local";

import IRenderFragment from "../../../interfaces/state/render/IRenderFragment";
import fragmentViews from "./fragmentViews";
import gFragmentCode from "../../../global/code/gFragmentCode";
import optionsViews from "./optionsViews";


const buildLinkDiscussionView = (
    fragment: IRenderFragment,
    views: Children[]
): void => {

    let adjustForCollapsedOptions = false;
    let adjustForPriorAncillaries = false;
    const viewsLength = views.length;

    if (viewsLength > 0) {

        const lastView: any = views[viewsLength - 1];

        if (lastView?.ui?.isCollapsed === true) {

            adjustForCollapsedOptions = true;
        }

        if (lastView?.ui?.hasAncillaries === true) {

            adjustForPriorAncillaries = true;
        }
    }

    const linkELementID = gFragmentCode.getLinkElementID(fragment.id);
    const results: { views: Children[], optionsCollapsed: boolean, hasAncillaries: boolean } = optionsViews.buildView(fragment);

    if (linkELementID === 'nt_lk_frag_t968OJ1wo') {

        console.log(`R-DRAWING ${linkELementID}_l`);
    }

    let classes = "nt-fr-fragment-box";

    if (fragment.classes) {

        if (fragment.classes) {

            for (const className of fragment.classes) {

                classes = `${classes} nt-ur-${className}`
            }
        }
    }

    if (adjustForCollapsedOptions === true) {

        classes = `${classes} nt-fr-prior-collapsed-options`
    }

    if (adjustForPriorAncillaries === true) {

        classes = `${classes} nt-fr-prior-is-ancillary`
    }

    const view =

        h("div",
            {
                id: `${linkELementID}_l`,
                class: `${classes}`
            },
            [
                h("div",
                    {
                        class: `nt-fr-fragment-discussion`,
                        "data-discussion": fragment.value
                    },
                    ""
                ),

                results.views
            ]
        );

    if (results.optionsCollapsed === true) {

        const viewAny = view as any;

        if (!viewAny.ui) {

            viewAny.ui = {};
        }

        viewAny.ui.isCollapsed = true;
    }

    if (results.hasAncillaries === true) {

        const viewAny = view as any;

        if (!viewAny.ui) {

            viewAny.ui = {};
        }

        viewAny.ui.hasAncillaries = true;
    }

    views.push(view);
};

const buildLinkExitsView = (
    _fragment: IRenderFragment,
    _view: Children[]
): void => {

    return

    // if (!fragment.options
    //     || fragment.options.length === 0
    //     || !fragment.ui.fragmentOptionsExpanded
    // ) {
    //     return;
    // }

    // if (!U.isNullOrWhiteSpace(fragment.exitKey)) {

    //     // Then map has a single exit and it was merged into this fragment
    //     return;
    // }

    // view.push(

    //     h("div",
    //         {
    //             class: "nt-fr-exits-box"
    //         },
    //         [
    //             optionsViews.buildView(fragment)
    //         ]
    //     )
    // );
};

const linkViews = {

    buildView: (
        fragment: IRenderFragment | null | undefined,
        views: Children[]
    ): void => {

        if (!fragment
            || fragment.ui.doNotPaint === true
        ) {
            return;
        }

        buildLinkDiscussionView(
            fragment,
            views
        );

        linkViews.buildView(
            fragment.link?.root,
            views
        );

        buildLinkExitsView(
            fragment,
            views
        );

        fragmentViews.buildView(
            fragment.selected,
            views
        );
    }
};

export default linkViews;


