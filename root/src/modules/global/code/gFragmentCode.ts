import { ParseType } from "../../interfaces/enums/ParseType";
import IDisplayChart from "../../interfaces/state/display/IDisplayChart";
import IDisplaySection from "../../interfaces/state/display/IDisplaySection";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import IChainSegment from "../../interfaces/state/segments/IChainSegment";
import RenderFragment from "../../state/render/RenderFragment";
import gFragmentActions from "../actions/gFragmentActions";
import gFileConstants from "../gFileConstants";
import U from "../gUtilities";
import gHistoryCode from "./gHistoryCode";
import gHookRegistryCode from "./gHookRegistryCode";
import gOutlineCode from "./gOutlineCode";
import gSegmentCode from "./gSegmentCode";
import gStateCode from "./gStateCode";


const getVariableValue = (
    section: IDisplaySection,
    variableValues: any,
    variableName: string
): string | null => {

    let value = variableValues[variableName];

    if (value) {

        return value;
    }

    const currentValue = section.outline?.mv?.[variableName];

    if (currentValue) {

        variableValues[variableName] = currentValue;
    }

    getAncestorVariableValue(
        section,
        variableValues,
        variableName
    );

    return variableValues[variableName] ?? null;
};

const getAncestorVariableValue = (
    section: IDisplaySection,
    variableValues: any,
    variableName: string
): void => {

    const chart = section as IDisplayChart;
    const parent = chart.parent?.section;

    if (!parent) {
        return;
    }

    const parentValue = parent.outline?.mv?.[variableName];

    if (parentValue) {

        variableValues[variableName] = parentValue;
    }

    getAncestorVariableValue(
        parent,
        variableValues,
        variableName
    );
};

const checkForVariables = (fragment: IRenderFragment): void => {

    const value = fragment.value;
    const variableRefPattern = /〈¦‹(?<variableName>[^›¦]+)›¦〉/gmu;
    const matches = value.matchAll(variableRefPattern);
    let variableName: string;
    let variableValues: any = {};
    let result = '';
    let marker = 0;

    for (const match of matches) {

        if (match
            && match.groups
            // eslint-disable-next-line eqeqeq
            && match.index != null
        ) {
            variableName = match.groups.variableName;

            const variableValue = getVariableValue(
                fragment.section,
                variableValues,
                variableName
            );

            if (!variableValue) {

                throw new Error(`Variable: ${variableName} could not be found`);
            }

            result = result +
                value.substring(marker, match.index) +
                variableValue;

            marker = match.index + match[0].length;
        }
    }

    result = result +
        value.substring(marker, value.length);

    fragment.value = result;
};

const clearSiblingChains = (
    parent: IRenderFragment,
    fragment: IRenderFragment
): void => {

    for (const option of parent.options) {

        if (option.id !== fragment.id) {

            clearFragmentChains(option);
        }
    }
};

const clearFragmentChains = (fragment: IRenderFragment | null | undefined): void => {

    if (!fragment) {
        return;
    }

    clearFragmentChains(fragment.link?.root);

    for (const option of fragment.options) {

        clearFragmentChains(option);
    }

    fragment.selected = null;

    if (fragment.link?.root) {

        fragment.link.root.selected = null;
    }
};

const loadOption = (
    state: IState,
    rawOption: any,
    outlineNode: IRenderOutlineNode | null,
    section: IDisplaySection,
    parentFragmentID: string,
    segmentIndex: number | null
): IRenderFragment => {

    const option = new RenderFragment(
        rawOption.id,
        parentFragmentID,
        section,
        segmentIndex
    );

    option.option = rawOption.option ?? '';
    option.isAncillary = rawOption.isAncillary === true;
    option.order = rawOption.order ?? 0;
    option.iExitKey = rawOption.iExitKey ?? '';
    option.podKey = rawOption.podKey ?? '';
    option.podText = rawOption.podText ?? '';

    if (outlineNode) {

        for (const outlineOption of outlineNode.o) {

            if (outlineOption.i === option.id) {

                gStateCode.cache_outlineNode(
                    state,
                    section.linkID,
                    outlineOption
                );

                break;
            }
        }
    }

    gStateCode.cache_chainFragment(
        state,
        option
    );

    gOutlineCode.getPodOutline_subscripion(
        state,
        option,
        section
    );

    return option;
};

const showPlug_subscription = (
    state: IState,
    exit: IRenderFragment,
    optionText: string
): void => {

    const section: IDisplayChart = exit.section as IDisplayChart;
    const parent = section.parent;

    if (!parent) {

        throw new Error("IDisplayChart parent is null");
    }

    const iExitKey = exit.exitKey;

    for (const option of parent.options) {

        if (option.iExitKey === iExitKey) {

            return showOptionNode_subscripton(
                state,
                option,
                optionText
            );
        }
    }
};

const showOptionNode_subscripton = (
    state: IState,
    option: IRenderFragment,
    optionText: string | null = null
): void => {

    if (!option
        || !option.section?.outline?.path
    ) {
        return;
    }

    gFragmentCode.prepareToShowOptionNode(
        state,
        option
    );

    // if (option.ui.discussionLoaded === true) {
    //     return;
    // }

    return gFragmentCode.getFragmentAndLinkOutline_subscripion(
        state,
        option,
        optionText,
    );
};

// const showPodOptionNode_subscripton = (
//     state: IState,
//     option: IRenderFragment,
//     optionText: string | null = null
// ): void => {

//     if (!option
//         || !option.section?.outline?.path
//     ) {
//         return;
//     }

//     gFragmentCode.prepareToShowPodOptionNode(
//         state,
//         option
//     );

//     return gFragmentCode.getPodFragment_subscripion(
//         state,
//         option,
//         optionText,
//     );
// };

const loadNextFragmentInSegment = (
    state: IState,
    segment: IChainSegment
): void => {

    const nextOutlineNode = gSegmentCode.getNextSegmentOutlineNode(
        state,
        segment
    );

    if (!nextOutlineNode) {
        return;
    }

    const fragmentFolderUrl = segment.segmentSection?.outline?.path;
    const url = `${fragmentFolderUrl}/${nextOutlineNode.i}${gFileConstants.fragmentFileExtension}`;

    const loadDelegate = (
        state: IState,
        outlineResponse: any
    ): IStateAnyArray => {

        return gFragmentActions.loadChainFragment(
            state,
            outlineResponse,
            segment,
            nextOutlineNode
        );
    };

    gStateCode.AddReLoadDataEffectImmediate(
        state,
        `loadChainFragment`,
        ParseType.Json,
        url,
        loadDelegate
    );
};

const gFragmentCode = {

    loadNextChainFragment: (
        state: IState,
        segment: IChainSegment,
    ): void => {

        if (segment.outlineNodes.length > 0) {

            loadNextFragmentInSegment(
                state,
                segment,
            );
        }
        else {
            gSegmentCode.loadNextSegment(
                state,
                segment,
            );
        }
    },

    hasOption: (
        fragment: IRenderFragment,
        optionID: string
    ): boolean => {

        for (const option of fragment.options) {

            if (option.id === optionID) {

                return true;
            }
        }

        return false;
    },

    checkSelected: (fragment: IRenderFragment): void => {

        if (!fragment.selected?.id) {
            return;
        }

        if (!gFragmentCode.hasOption(fragment, fragment.selected?.id)) {

            throw new Error("Selected has been set to fragment that isn't an option");
        }
    },

    clearParentSectionSelected: (displayChart: IDisplaySection): void => {

        const parent = (displayChart as IDisplayChart).parent;

        if (!parent) {
            return;
        }

        gFragmentCode.clearParentSectionOrphanedSteps(parent);
        gFragmentCode.clearParentSectionSelected(parent.section as IDisplayChart);
    },

    clearParentSectionOrphanedSteps: (fragment: IRenderFragment | null | undefined): void => {

        if (!fragment) {
            return;
        }

        gFragmentCode.clearOrphanedSteps(fragment.selected);
        fragment.selected = null;
    },

    clearOrphanedSteps: (fragment: IRenderFragment | null | undefined): void => {

        if (!fragment) {
            return;
        }

        gFragmentCode.clearOrphanedSteps(fragment.link?.root);
        gFragmentCode.clearOrphanedSteps(fragment.selected);

        fragment.selected = null;
        fragment.link = null;
    },

    getFragmentAndLinkOutline_subscripion: (
        state: IState,
        option: IRenderFragment,
        optionText: string | null = null,
    ): void => {

        // if (option.ui.discussionLoaded === true) {

        //     throw new Error('Discussion was already loaded');
        // }

        state.loading = true;
        window.TreeSolve.screen.hideBanner = true;

        gOutlineCode.getLinkOutline_subscripion(
            state,
            option
        );

        const url = `${option.section?.outline?.path}/${option.id}${gFileConstants.fragmentFileExtension}`;

        const loadAction: (state: IState, response: any) => IStateAnyArray = (state: IState, response: any) => {

            return gFragmentActions.loadFragmentAndSetSelected(
                state,
                response,
                option,
                optionText
            );
        };

        gStateCode.AddReLoadDataEffectImmediate(
            state,
            `loadFragmentFile`,
            ParseType.Text,
            url,
            loadAction
        );
    },

    getPodFragment_subscripion: (
        state: IState,
        option: IRenderFragment,
        optionText: string | null = null,
    ): void => {

        state.loading = true;
        window.TreeSolve.screen.hideBanner = true;
        const url = `${option.section?.outline?.path}/${option.id}${gFileConstants.fragmentFileExtension}`;

        const loadAction: (state: IState, response: any) => IStateAnyArray = (state: IState, response: any) => {

            return gFragmentActions.loadPodFragment(
                state,
                response,
                option,
                optionText
            );
        };

        gStateCode.AddReLoadDataEffectImmediate(
            state,
            `loadFragmentFile`,
            ParseType.Text,
            url,
            loadAction
        );
    },

    // getLinkOutline_subscripion: (
    //     state: IState,
    //     option: IRenderFragment,
    // ): void => {

    //     const outline = option.section.outline;

    //     if (!outline) {
    //         return;
    //     }

    //     const outlineNode = gStateCode.getCached_outlineNode(
    //         state,
    //         option.section.linkID,
    //         option.id
    //     );

    //     if (outlineNode?.c == null
    //         || state.renderState.isChainLoad === true // Will load it from a segment
    //     ) {
    //         return;
    //     }

    //     const outlineChart = gOutlineCode.getOutlineChart(
    //         outline,
    //         outlineNode?.c
    //     );

    //     gOutlineCode.getOutlineFromChart_subscription(
    //         state,
    //         outlineChart,
    //         option
    //     );
    // },

    getLinkElementID: (fragmentID: string): string => {

        return `nt_lk_frag_${fragmentID}`;
    },

    getFragmentElementID: (fragmentID: string): string => {

        return `nt_fr_frag_${fragmentID}`;
    },

    prepareToShowOptionNode: (
        state: IState,
        option: IRenderFragment
    ): void => {

        gFragmentCode.markOptionsExpanded(
            state,
            option
        );

        gFragmentCode.setCurrent(
            state,
            option
        );

        gHistoryCode.pushBrowserHistoryState(state);
    },

    prepareToShowPodOptionNode: (
        state: IState,
        option: IRenderFragment
    ): void => {

        gFragmentCode.markOptionsExpanded(
            state,
            option
        );

        gFragmentCode.setPodCurrent(
            state,
            option
        );
    },

    parseAndLoadFragment: (
        state: IState,
        response: string,
        parentFragmentID: string,
        outlineNodeID: string,
        section: IDisplaySection
    ): IRenderFragment | null => {

        const result: { fragment: IRenderFragment, continueLoading: boolean } = gFragmentCode.parseAndLoadFragmentBase(
            state,
            response,
            parentFragmentID,
            outlineNodeID,
            section
        );

        const fragment = result.fragment;

        if (result.continueLoading === true) {

            gFragmentCode.autoExpandSingleBlankOption(
                state,
                result.fragment
            );

            if (!fragment.link) {

                gOutlineCode.getLinkOutline_subscripion(
                    state,
                    fragment
                );
            }
        }

        return fragment;
    },

    parseAndLoadPodFragment: (
        state: IState,
        response: string,
        parentFragmentID: string,
        outlineNodeID: string,
        section: IDisplaySection
    ): IRenderFragment | null => {

        const result: { fragment: IRenderFragment, continueLoading: boolean } = gFragmentCode.parseAndLoadFragmentBase(
            state,
            response,
            parentFragmentID,
            outlineNodeID,
            section
        );

        const fragment = result.fragment;

        if (result.continueLoading === true) {

            gFragmentCode.autoExpandSingleBlankOption(
                state,
                result.fragment
            );
        }

        return fragment;
    },

    parseAndLoadFragmentBase: (
        state: IState,
        response: string,
        parentFragmentID: string,
        outlineNodeID: string,
        section: IDisplaySection,
        segmentIndex: number | null = null
    ): { fragment: IRenderFragment, continueLoading: boolean } => {

        if (!section.outline) {

            throw new Error('Option section outline was null');
        }

        const rawFragment = gFragmentCode.parseFragment(response);

        if (!rawFragment) {

            throw new Error('Raw fragment was null');
        }

        if (outlineNodeID !== rawFragment.id) {

            throw new Error('The rawFragment id does not match the outlineNodeID');
        }

        let fragment: IRenderFragment | null = gStateCode.getCached_chainFragment(
            state,
            section.linkID,
            outlineNodeID
        );

        if (!fragment) {

            fragment = new RenderFragment(
                rawFragment.id,
                parentFragmentID,
                section,
                segmentIndex
            );
        }

        let continueLoading = false;

        // if (!fragment.ui.discussionLoaded) {

        gFragmentCode.loadFragment(
            state,
            rawFragment,
            fragment
        );

        gStateCode.cache_chainFragment(
            state,
            fragment
        );

        continueLoading = true;
        // }

        return {
            fragment,
            continueLoading
        };
    },

    autoExpandSingleBlankOption: (
        state: IState,
        fragment: IRenderFragment
    ): void => {

        const optionsAndAncillaries = gFragmentCode.splitOptionsAndAncillaries(fragment.options);

        if (optionsAndAncillaries.options.length === 1
            && optionsAndAncillaries.options[0].option === ''
            && U.isNullOrWhiteSpace(fragment.iKey)
            && U.isNullOrWhiteSpace(fragment.exitKey)
        ) {
            const outlineNode = gStateCode.getCached_outlineNode(
                state,
                fragment.section.linkID,
                fragment.id
            );

            if (outlineNode?.c != null) {
                return;
            }

            return showOptionNode_subscripton(
                state,
                optionsAndAncillaries.options[0]
            );
        }
        else if (!U.isNullOrWhiteSpace(fragment.exitKey)) {

            // Then find the parent option with an iExitKey that matches this exitKey
            showPlug_subscription(
                state,
                fragment,
                fragment.option
            );
        }
    },

    expandOptionPods: (
        state: IState,
        fragment: IRenderFragment
    ): void => {

        const optionsAndAncillaries = gFragmentCode.splitOptionsAndAncillaries(fragment.options);

        for (const option of optionsAndAncillaries.options) {

            const outlineNode = gStateCode.getCached_outlineNode(
                state,
                option.section.linkID,
                option.id
            );

            if (outlineNode?.d == null
                || option.pod != null
            ) {
                return;
            }

            gOutlineCode.getPodOutline_subscripion(
                state,
                option,
                option.section
            );

            // return showPodOptionNode_subscripton(
            //     state,
            //     option
            // );
        }
    },

    cacheSectionRoot: (
        state: IState,
        displaySection: IDisplaySection
    ): void => {

        if (!displaySection) {
            return;
        }

        const rootFragment = displaySection.root;

        if (!rootFragment) {
            return;
        }

        gStateCode.cache_chainFragment(
            state,
            rootFragment
        );

        displaySection.current = displaySection.root;

        for (const option of rootFragment.options) {

            gStateCode.cache_chainFragment(
                state,
                option
            );
        }
    },

    elementIsParagraph: (value: string): boolean => {

        let trimmed = value;

        if (!U.isNullOrWhiteSpace(trimmed)) {

            if (trimmed.length > 20) {

                trimmed = trimmed.substring(0, 20);
                trimmed = trimmed.replace(/\s/g, '');
            }
        }

        if (trimmed.startsWith('<p>') === true
            && trimmed[3] !== '<') {

            return true;
        }

        return false;
    },

    parseAndLoadGuideRootFragment: (
        state: IState,
        rawFragment: any,
        root: IRenderFragment
    ): void => {

        if (!rawFragment) {
            return;
        }

        gFragmentCode.loadFragment(
            state,
            rawFragment,
            root
        );
    },

    loadFragment: (
        state: IState,
        rawFragment: any,
        fragment: IRenderFragment
    ): void => {

        fragment.topLevelMapKey = rawFragment.topLevelMapKey ?? '';
        fragment.mapKeyChain = rawFragment.mapKeyChain ?? '';
        fragment.guideID = rawFragment.guideID ?? '';
        fragment.iKey = rawFragment.iKey ?? null;
        fragment.exitKey = rawFragment.exitKey ?? null;
        fragment.variable = rawFragment.variable ?? [];
        fragment.classes = rawFragment.classes ?? [];
        fragment.value = rawFragment.value ?? '';
        fragment.value = fragment.value.trim();
        // fragment.ui.discussionLoaded = true;
        fragment.ui.doNotPaint = false;

        checkForVariables(
            fragment,
        );

        const outlineNode = gStateCode.getCached_outlineNode(
            state,
            fragment.section.linkID,
            fragment.id
        );

        fragment.parentFragmentID = outlineNode?.parent?.i ?? '';

        let option: IRenderFragment | undefined;

        if (rawFragment.options
            && Array.isArray(rawFragment.options)
        ) {
            for (const rawOption of rawFragment.options) {

                option = fragment.options.find(o => o.id === rawOption.id);

                if (!option) {

                    option = loadOption(
                        state,
                        rawOption,
                        outlineNode,
                        fragment.section,
                        fragment.id,
                        fragment.segmentIndex
                    );

                    fragment.options.push(option);
                }
                else {
                    option.option = rawOption.option ?? '';
                    option.isAncillary = rawOption.isAncillary === true;
                    option.order = rawOption.order ?? 0;
                    option.iExitKey = rawOption.iExitKey ?? '';
                    option.podKey = rawOption.podKey ?? '';
                    option.podText = rawOption.podText ?? '';
                    option.section = fragment.section;
                    option.parentFragmentID = fragment.id;
                    option.segmentIndex = fragment.segmentIndex;
                }

                // option.ui.discussionLoaded = false;
                option.ui.doNotPaint = false;
            }
        }

        gHookRegistryCode.executeStepHook(
            state,
            fragment
        );
    },

    parseFragment: (response: string): any => {

        /*
                <script type=\"module\" src=\"/@vite/client\"></script>
                <!-- tsFragmentRenderComment {\"node\":{\"id\":\"dBt7Km2Ml\",\"topLevelMapKey\":\"cv1TRl01rf\",\"mapKeyChain\":\"cv1TRl01rf\",\"guideID\":\"dBt7JN1He\",\"guidePath\":\"c:/GitHub/TEST.Documentation/tsmapsdataOptionsFolder/Holder/dataOptions.tsmap\",\"parentFragmentID\":\"dBt7JN1vt\",\"chartKey\":\"cv1TRl01rf\",\"options\":[]}} -->

                <h4 id=\"option-1-solution\">Option 1 solution</h4>
                <p>Option 1 solution</p>
        */

        const lines = response.split('\n');
        const renderCommentStart = `<!-- ${gFileConstants.fragmentRenderCommentTag}`;
        const renderCommentEnd = ` -->`;
        let fragmentRenderComment: string | null = null;
        let line: string;
        let buildValue = false;
        let value = '';

        for (let i = 0; i < lines.length; i++) {

            line = lines[i];

            if (buildValue) {

                value = `${value}
${line}`;
                continue;
            }

            if (line.startsWith(renderCommentStart) === true) {

                fragmentRenderComment = line.substring(renderCommentStart.length);
                buildValue = true;
            }
        }

        if (!fragmentRenderComment) {
            return;
        }

        fragmentRenderComment = fragmentRenderComment.trim();

        if (fragmentRenderComment.endsWith(renderCommentEnd) === true) {

            const length = fragmentRenderComment.length - renderCommentEnd.length;

            fragmentRenderComment = fragmentRenderComment.substring(
                0,
                length
            );
        }

        fragmentRenderComment = fragmentRenderComment.trim();
        let rawFragment: any | null = null;

        try {
            rawFragment = JSON.parse(fragmentRenderComment);
        }
        catch (e) {
            console.log(e);
        }

        rawFragment.value = value;

        return rawFragment;
    },

    markOptionsExpanded: (
        state: IState,
        fragment: IRenderFragment
    ): void => {

        if (!state) {
            return;
        }

        gFragmentCode.resetFragmentUis(state);
        state.renderState.ui.optionsExpanded = true;
        fragment.ui.fragmentOptionsExpanded = true;
    },

    collapseFragmentsOptions: (fragment: IRenderFragment): void => {

        if (!fragment
            || fragment.options.length === 0
        ) {
            return;
        }

        for (const option of fragment.options) {

            option.ui.fragmentOptionsExpanded = false;
        }
    },

    showOptionNode: (
        state: IState,
        fragment: IRenderFragment,
        option: IRenderFragment
    ): void => {

        gFragmentCode.collapseFragmentsOptions(fragment);
        option.ui.fragmentOptionsExpanded = false;

        gFragmentCode.setCurrent(
            state,
            option
        );
    },

    resetFragmentUis: (state: IState): void => {

        const chainFragments = state.renderState.index_chainFragments_id;

        for (const propName in chainFragments) {

            gFragmentCode.resetFragmentUi(chainFragments[propName]);
        }
    },

    resetFragmentUi: (fragment: IRenderFragment): void => {

        fragment.ui.fragmentOptionsExpanded = false;
        fragment.ui.doNotPaint = false;
    },

    setAncillaryActive: (
        state: IState,
        ancillary: IRenderFragment | null
    ): void => {

        state.renderState.activeAncillary = ancillary;
    },

    clearAncillaryActive: (state: IState): void => {

        state.renderState.activeAncillary = null;
    },

    splitOptionsAndAncillaries: (children: Array<IRenderFragment> | null | undefined): { options: Array<IRenderFragment>, ancillaries: Array<IRenderFragment>, total: number } => {

        const ancillaries: Array<IRenderFragment> = [];
        const options: Array<IRenderFragment> = [];
        let option: IRenderFragment;

        if (!children) {

            return {
                options,
                ancillaries,
                total: 0
            };
        }

        for (let i = 0; i < children.length; i++) {

            option = children[i] as IRenderFragment;

            if (!option.isAncillary) {

                options.push(option);
            }
            else {
                ancillaries.push(option);
            }
        }

        return {
            options,
            ancillaries,
            total: children.length
        };
    },

    setCurrent: (
        state: IState,
        fragment: IRenderFragment
    ): void => {

        const section = fragment.section;

        let parent: IRenderFragment | null = gStateCode.getCached_chainFragment(
            state,
            section.linkID,
            fragment.parentFragmentID
        );

        if (parent) {

            if (parent.id === fragment.id) {

                throw new Error("Parent and Fragment are the same");
            }

            parent.selected = fragment;
            fragment.ui.sectionIndex = parent.ui.sectionIndex + 1;

            clearSiblingChains(
                parent,
                fragment
            );
        }
        else {
            throw new Error("ParentFragment was null");
        }

        section.current = fragment;
        gFragmentCode.checkSelected(fragment);
    },

    setPodCurrent: (
        state: IState,
        fragment: IRenderFragment
    ): void => {

        const section = fragment.section;

        let parent: IRenderFragment | null = gStateCode.getCached_chainFragment(
            state,
            section.linkID,
            fragment.parentFragmentID
        );

        if (parent) {

            if (parent.id === fragment.id) {

                throw new Error("Parent and Fragment are the same");
            }

            parent.selected = fragment;
            fragment.ui.sectionIndex = parent.ui.sectionIndex + 1;

            clearSiblingChains(
                parent,
                fragment
            );
        }
        else {
            throw new Error("ParentFragment was null");
        }

        // section.current = fragment;
        gFragmentCode.checkSelected(fragment);
    },
};

export default gFragmentCode;

