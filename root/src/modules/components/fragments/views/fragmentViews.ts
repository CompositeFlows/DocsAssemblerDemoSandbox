import { Children } from "hyper-app-local";
import { h } from "../../../../hyperApp/hyper-app-local";

import IRenderFragment from "../../../interfaces/state/render/IRenderFragment";
import gFragmentCode from "../../../global/code/gFragmentCode";
import optionsViews from "./optionsViews";
import linkViews from "./linkViews";
import U from "../../../global/gUtilities";


const buildDiscussionView = (
    fragment: IRenderFragment,
    views: Children[]
): void => {

    if (U.isNullOrWhiteSpace(fragment.value) === true) {
        return;
    }

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

    const fragmentELementID = gFragmentCode.getFragmentElementID(fragment.id);

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

    views.push(

        h("div",
            {
                id: `${fragmentELementID}_d`,
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
            ]
        )
    );
};

const fragmentViews = {

    buildView: (
        fragment: IRenderFragment | null | undefined,
        views: Children[]
    ): void => {

        if (!fragment
            || fragment.ui.doNotPaint === true
        ) {
            return;
        }

        buildDiscussionView(
            fragment,
            views
        );

        linkViews.buildView(
            fragment.link?.root,
            views
        );

        optionsViews.buildView2(
            fragment,
            views
        );

        fragmentViews.buildView(
            fragment.selected,
            views
        );
    }
};

export default fragmentViews;


