import { Children, VNode } from "hyper-app-local";
import { h } from "../../../../hyperApp/hyper-app-local";

import IRenderFragment from "../../../interfaces/state/render/IRenderFragment";
import fragmentActions from "../actions/fragmentActions";
import FragmentPayload from "../../../state/ui/payloads/FragmentPayload";
import U from "../../../global/gUtilities";
import fragmentViews from "./fragmentViews";
import gFragmentCode from "../../../global/code/gFragmentCode";
import podViews from "./podViews";


const buildAncillaryDiscussionView = (ancillary: IRenderFragment): Children[] => {

    if (!ancillary.ui.ancillaryExpanded) {

        return [];
    }

    const view: Children[] = [];

    fragmentViews.buildView(
        ancillary,
        view
    );

    return view;
}

const buildExpandedAncillaryView = (
    parent: IRenderFragment,
    ancillary: IRenderFragment
): VNode | null => {

    if (!ancillary
        || !ancillary.isAncillary) {

        return null;
    }

    const view: VNode =

        h("div", { class: "nt-fr-ancillary-box" }, [
            h("div", { class: "nt-fr-ancillary-head" }, [
                h("a",
                    {
                        class: "nt-fr-ancillary nt-fr-ancillary-target",
                        onMouseDown: [
                            fragmentActions.toggleAncillaryNode,
                            (target: any) => {
                                return new FragmentPayload(
                                    parent,
                                    ancillary,
                                    target
                                );
                            }
                        ]
                    },
                    [
                        h("span", { class: "nt-fr-ancillary-text nt-fr-ancillary-target" }, ancillary.option),
                        h("span", { class: "nt-fr-ancillary-x nt-fr-ancillary-target" }, '✕')
                    ]
                )
            ]),

            buildAncillaryDiscussionView(ancillary)
        ]);

    return view;
}

const buildCollapsedAncillaryView = (
    parent: IRenderFragment,
    ancillary: IRenderFragment
): VNode | null => {

    if (!ancillary
        || !ancillary.isAncillary) {

        return null;
    }

    const view: VNode =

        h("div", { class: "nt-fr-ancillary-box nt-fr-collapsed" }, [
            h("div", { class: "nt-fr-ancillary-head" }, [
                h("a",
                    {
                        class: "nt-fr-ancillary nt-fr-ancillary-target",
                        onMouseDown: [
                            fragmentActions.toggleAncillaryNode,
                            (target: any) => {
                                return new FragmentPayload(
                                    parent,
                                    ancillary,
                                    target
                                );
                            }
                        ]
                    },
                    [
                        h("span", {class: "nt-fr-ancillary-target"}, ancillary.option)
                    ]
                )
            ])
        ]);

    return view;
}

const BuildAncillaryView = (
    parent: IRenderFragment,
    ancillary: IRenderFragment
): VNode | null => {

    if (!ancillary
        || !ancillary.isAncillary) {

        return null;
    }

    if (ancillary.ui.ancillaryExpanded === true) {

        return buildExpandedAncillaryView(
            parent,
            ancillary
        );
    }

    return buildCollapsedAncillaryView(
        parent,
        ancillary
    );
}

const BuildExpandedOptionView = (
    parent: IRenderFragment,
    option: IRenderFragment
): VNode | null => {

    if (!option
        || option.isAncillary === true) {

        return null;
    }

    let buttonClass = "nt-fr-option";
    let innerView: VNode | null;

    if (option.pod?.root) {

        buttonClass = `${buttonClass} nt-fr-pod-button`;
        innerView = podViews.buildView(option);
    }
    else {
        innerView = h("span", {class: "nt-fr-option-text"},  option.option);
    }

    const view: VNode =

        h("div", { class: "nt-fr-option-box" },
            [
                h("a",
                    {
                        class: `${buttonClass}`,
                        onMouseDown: [
                            fragmentActions.showOptionNode,
                            (target: any) => {
                                return new FragmentPayload(
                                    parent,
                                    option,
                                    target
                                );
                            }
                        ]
                    },
                    [
                        innerView
                    ]
                )
            ]
        );

    return view;
}

const buildExpandedOptionsView = (
    fragment: IRenderFragment,
    options: Array<IRenderFragment>
): { view: VNode, isCollapsed: boolean } | null => {

    const optionViews: Children[] = [];
    let optionVew: VNode | null;

    for (const option of options) {

        optionVew = BuildExpandedOptionView(
            fragment,
            option
        );

        if (optionVew) {

            optionViews.push(optionVew);
        }
    }

    let optionsClasses = "nt-fr-fragment-options";

    if (fragment.selected) {

        optionsClasses = `${optionsClasses} nt-fr-fragment-chain`
    }

    const view: VNode =

        h("div",
            {
                class: `${optionsClasses}`,
                tabindex: 0,
                onBlur: [
                    fragmentActions.hideOptions,
                    (_event: any) => fragment
                ]
            },

            optionViews
        );

    return {
        view,
        isCollapsed: false
    };
};

const buildExpandedOptionsBoxView = (
    fragment: IRenderFragment,
    options: Array<IRenderFragment>,
    fragmentELementID: string,
    views: Children[]
): void => {

    const optionsView = buildExpandedOptionsView(
        fragment,
        options
    );

    if (!optionsView) {
        return;
    }

    let classes = "nt-fr-fragment-box";

    if (fragment.classes) {

        if (fragment.classes) {

            for (const className of fragment.classes) {

                classes = `${classes} nt-ur-${className}`
            }
        }
    }

    views.push(

        h("div",
            {
                id: `${fragmentELementID}_eo`,
                class: `${classes}`
            },
            [
                optionsView.view
            ]
        )
    );
};

const buildCollapsedOptionsView = (fragment: IRenderFragment): VNode => {

    let buttonClass = "nt-fr-fragment-options nt-fr-collapsed";

    if (fragment.selected?.pod?.root) {

        buttonClass = `${buttonClass} nt-fr-pod-button`;
    }

    const view: VNode =

        h("a",
            {
                class: `${buttonClass}`,
                onMouseDown: [
                    fragmentActions.expandOptions,
                    (_event: any) => fragment
                ]
            },
            [
                podViews.buildView(fragment.selected),

                h("span", { class: `nt-fr-option-selected` }, `${fragment.selected?.option}`),
            ]
        );

    return view;
};

const buildCollapsedOptionsBoxView = (
    fragment: IRenderFragment,
    fragmentELementID: string,
    views: Children[]
): void => {

    const optionView = buildCollapsedOptionsView(fragment);

    let classes = "nt-fr-fragment-box";

    if (fragment.classes) {

        if (fragment.classes) {

            for (const className of fragment.classes) {

                classes = `${classes} nt-ur-${className}`
            }
        }
    }

    const view =

        h("div",
            {
                id: `${fragmentELementID}_co`,
                class: `${classes}`
            },
            [
                optionView
            ]
        );

    const viewAny = view as any;

    if (!viewAny.ui) {

        viewAny.ui = {};
    }

    viewAny.ui.isCollapsed = true;
    views.push(view);
};

const buildAncillariesView = (
    fragment: IRenderFragment,
    ancillaries: Array<IRenderFragment>
): VNode | null => {

    if (ancillaries.length === 0) {

        return null;
    }

    const ancillariesViews: Children[] = [];
    let ancillaryView: VNode | null;

    for (const ancillary of ancillaries) {

        ancillaryView = BuildAncillaryView(
            fragment,
            ancillary
        );

        if (ancillaryView) {

            ancillariesViews.push(ancillaryView);
        }
    }

    if (ancillariesViews.length === 0) {

        return null;
    }

    let ancillariesClasses = "nt-fr-fragment-ancillaries";

    if (fragment.selected) {

        ancillariesClasses = `${ancillariesClasses} nt-fr-fragment-chain`
    }

    const view: VNode =

        h("div",
            {
                class: `${ancillariesClasses}`,
                tabindex: 0,
                // onBlur: [
                //     fragmentActions.hideOptions,
                //     (_event: any) => fragment
                // ]
            },

            ancillariesViews
        );

    return view;
};

const buildAncillariesBoxView = (
    fragment: IRenderFragment,
    ancillaries: Array<IRenderFragment>,
    fragmentELementID: string,
    views: Children[]
): void => {

    const ancillariesView = buildAncillariesView(
        fragment,
        ancillaries
    );

    if (!ancillariesView) {
        return;
    }

    let classes = "nt-fr-fragment-box";

    if (fragment.classes) {

        if (fragment.classes) {

            for (const className of fragment.classes) {

                classes = `${classes} nt-ur-${className}`
            }
        }
    }

    const view =

        h("div",
            {
                id: `${fragmentELementID}_a`,
                class: `${classes}`
            },
            [
                ancillariesView
            ]
        );

    const viewAny = view as any;

    if (!viewAny.ui) {

        viewAny.ui = {};
    }

    viewAny.ui.hasAncillaries = true;
    views.push(view);
};

const buildOptionsView = (
    fragment: IRenderFragment,
    options: Array<IRenderFragment>
): { view: VNode, isCollapsed: boolean } | null => {

    if (options.length === 0) {

        return null;
    }

    if (options.length === 1
        && options[0].option === ''
    ) {
        return null;
    }

    if (fragment.selected
        && !fragment.ui.fragmentOptionsExpanded) {

        const view = buildCollapsedOptionsView(fragment);

        return {
            view,
            isCollapsed: true
        };
    }

    return buildExpandedOptionsView(
        fragment,
        options
    );
};

const buildOptionsBoxView = (
    fragment: IRenderFragment,
    options: Array<IRenderFragment>,
    fragmentELementID: string,
    views: Children[]
): void => {

    if (options.length === 0) {
        return;
    }

    if (options.length === 1
        && options[0].option === ''
    ) {
        return;
    }

    if (fragment.selected
        && !fragment.ui.fragmentOptionsExpanded) {

        buildCollapsedOptionsBoxView(
            fragment,
            fragmentELementID,
            views
        );

        return;
    }

    buildExpandedOptionsBoxView(
        fragment,
        options,
        fragmentELementID,
        views
    );
};


const optionsViews = {

    buildView: (fragment: IRenderFragment): { views: Children[], optionsCollapsed: boolean, hasAncillaries: boolean } => {

        if (!fragment.options
            || fragment.options.length === 0
            || !U.isNullOrWhiteSpace(fragment.iKey) // Don't draw options of links
        ) {
            return {
                views: [],
                optionsCollapsed: false,
                hasAncillaries: false
            };
        }

        if (fragment.options.length === 1
            && fragment.options[0].option === ''
        ) {
            return {
                views: [],
                optionsCollapsed: false,
                hasAncillaries: false
            };
        }

        const optionsAndAncillaries = gFragmentCode.splitOptionsAndAncillaries(fragment.options);
        let hasAncillaries = false;

        const views: Children[] = [

            buildAncillariesView(
                fragment,
                optionsAndAncillaries.ancillaries
            ),
        ];

        if (views.length > 0) {

            hasAncillaries = true;
        }

        const optionsViewResults = buildOptionsView(
            fragment,
            optionsAndAncillaries.options
        );

        if (optionsViewResults) {

            views.push(optionsViewResults.view);
        }

        return {
            views,
            optionsCollapsed: optionsViewResults?.isCollapsed ?? false,
            hasAncillaries
        };
    },

    buildView2: (
        fragment: IRenderFragment,
        views: Children[]
    ): void => {

        if (!fragment.options
            || fragment.options.length === 0
            || !U.isNullOrWhiteSpace(fragment.iKey) // Don't draw options of links
        ) {
            return;
        }

        if (fragment.options.length === 1
            && fragment.options[0].option === ''
        ) {
            return;
        }

        const fragmentELementID = gFragmentCode.getFragmentElementID(fragment.id);
        const optionsAndAncillaries = gFragmentCode.splitOptionsAndAncillaries(fragment.options);

        buildAncillariesBoxView(
            fragment,
            optionsAndAncillaries.ancillaries,
            fragmentELementID,
            views
        );

        buildOptionsBoxView(
            fragment,
            optionsAndAncillaries.options,
            fragmentELementID,
            views
        );
    }
};

export default optionsViews;


