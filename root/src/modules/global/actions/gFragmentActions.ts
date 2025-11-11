import { OutlineType } from "../../interfaces/enums/OutlineType";
import IDisplayChart from "../../interfaces/state/display/IDisplayChart";
import IDisplaySection from "../../interfaces/state/display/IDisplaySection";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import IChainSegment from "../../interfaces/state/segments/IChainSegment";
import gFragmentCode from "../code/gFragmentCode";
import gOutlineCode from "../code/gOutlineCode";
import gSegmentCode from "../code/gSegmentCode";
import gStateCode from "../code/gStateCode";
import gFragmentEffects from "../effects/gFragmentEffects";
import gFileConstants from "../gFileConstants";
import U from "../gUtilities";


const getFragmentFile = (
    state: IState,
    option: IRenderFragment
): IStateAnyArray => {

    state.loading = true;
    window.TreeSolve.screen.hideBanner = true;
    const fragmentPath = `${option.section?.outline?.path}/${option.id}${gFileConstants.fragmentFileExtension}`;

    return [
        state,
        gFragmentEffects.getFragment(
            state,
            option,
            fragmentPath
        )
    ];
};

const processChainFragmentType = (
    state: IState,
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment | null
): IStateAnyArray => {

    if (fragment) {

        if (outlineNode.i !== fragment.id) {

            throw new Error('Mismatch between fragment id and outline fragment id');
        }

        if (outlineNode.type === OutlineType.Link) {

            processLink(
                state,
                segment,
                outlineNode,
                fragment
            );
        }
        else if (outlineNode.type === OutlineType.Exit) {

            processExit(
                state,
                segment,
                outlineNode,
                fragment
            );
        }
        else if (outlineNode.isChart === true
            && outlineNode.isRoot === true) {

            processChartRoot(
                state,
                segment,
                fragment
            );
        }
        else if (outlineNode.isLast === true) {

            processLast(
                state,
                segment,
                outlineNode,
                fragment
            );
        }
        else if (outlineNode.type === OutlineType.Node) {

            processNode(
                state,
                segment,
                outlineNode,
                fragment
            );
        }
        else {
            throw new Error('Unexpected fragment type.');
        }
    }

    return gStateCode.cloneState(state);
};

const checkForLastFragmentErrors = (
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    if (!segment.segmentSection) {

        throw new Error("Segment section was null - last");
    }

    if (outlineNode.i !== fragment.id) {

        throw new Error('Mismatch between outline node id and fragment id');
    }
};

const checkForNodeErrors = (
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    if (!segment.segmentSection) {

        throw new Error("Segment section was null - node");
    }

    if (!U.isNullOrWhiteSpace(fragment.iKey)) {

        throw new Error('Mismatch between fragment and outline node - link');
    }
    else if (!U.isNullOrWhiteSpace(fragment.iExitKey)) {

        throw new Error('Mismatch between fragment and outline node - exit');
    }

    if (outlineNode.i !== fragment.id) {

        throw new Error('Mismatch between outline node id and fragment id');
    }
};

const checkForChartRootErrors = (
    segment: IChainSegment,
    fragment: IRenderFragment
): void => {

    if (!segment.segmentSection) {

        throw new Error("Segment section was null - root");
    }

    if (!U.isNullOrWhiteSpace(fragment.iKey)) {

        throw new Error('Mismatch between fragment and outline root - link');
    }
    else if (!U.isNullOrWhiteSpace(fragment.iExitKey)) {

        throw new Error('Mismatch between fragment and outline root - exit');
    }
};

const checkForExitErrors = (
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    if (!segment.segmentSection) {

        throw new Error("Segment section was null - exit");
    }

    if (!segment.segmentOutSection) {

        throw new Error("Segment out section was null - exit");
    }

    if (U.isNullOrWhiteSpace(fragment.exitKey) === true) {

        throw new Error('Mismatch between fragment and outline - exit');
    }
    else if (segment.end.type !== OutlineType.Exit) {

        throw new Error('Mismatch between fragment and outline node - exit');
    }

    if (outlineNode.i !== fragment.id) {

        throw new Error('Mismatch between outline node id and fragment id');
    }
};

const processChartRoot = (
    state: IState,
    segment: IChainSegment,
    fragment: IRenderFragment
): void => {

    checkForChartRootErrors(
        segment,
        fragment
    );

    gFragmentCode.loadNextChainFragment(
        state,
        segment
    );

    setLinksRoot(
        state,
        segment,
        fragment
    );
};

const setLinksRoot = (
    state: IState,
    segment: IChainSegment,
    fragment: IRenderFragment
): void => {

    const inSection = segment.segmentInSection;

    if (!inSection) {

        throw new Error("Segment in section was null - chart root");
    }

    const section = segment.segmentSection;

    if (!section) {

        throw new Error("Segment section was null - chart root");
    }

    let parent: IRenderFragment | null = gStateCode.getCached_chainFragment(
        state,
        inSection.linkID,
        segment.start.key
    );

    if (parent?.link) {

        if (parent.id === fragment.id) {

            throw new Error("Parent and Fragment are the same");
        }

        parent.link.root = fragment;
    }
    else {

        throw new Error("ParentFragment was null");
    }

    section.current = fragment;
};

const processNode = (
    state: IState,
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    checkForNodeErrors(
        segment,
        outlineNode,
        fragment
    );

    gFragmentCode.loadNextChainFragment(
        state,
        segment
    );

    processFragment(
        state,
        fragment
    );
};

const processLast = (
    state: IState,
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    checkForLastFragmentErrors(
        segment,
        outlineNode,
        fragment
    );

    processFragment(
        state,
        fragment
    );

    fragment.link = null;
    fragment.selected = null;

    if (fragment.options?.length > 0) {

        gFragmentCode.resetFragmentUis(state);
        fragment.ui.fragmentOptionsExpanded = true;
        state.renderState.ui.optionsExpanded = true;
    }
};

const processLink = (
    state: IState,
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    fragment: IRenderFragment
): void => {

    if (outlineNode.i !== fragment.id) {

        throw new Error('Mismatch between outline node id and fragment id');
    }

    const outline = fragment.section.outline;

    if (!outline) {
        return;
    }

    if (outlineNode?.c == null) {

        throw new Error();
    }

    if (outlineNode.isRoot === true
        && outlineNode.isChart === true
    ) {
        setLinksRoot(
            state,
            segment,
            fragment
        );
    }

    const outlineChart = gOutlineCode.getOutlineChart(
        outline,
        outlineNode?.c
    );

    gOutlineCode.getSegmentOutline_subscription(
        state,
        outlineChart,
        fragment,
        segment.index
    );
};

const processExit = (
    state: IState,
    segment: IChainSegment,
    outlineNode: IRenderOutlineNode,
    exitFragment: IRenderFragment
): void => {

    checkForExitErrors(
        segment,
        outlineNode,
        exitFragment
    );

    const section: IDisplayChart = exitFragment.section as IDisplayChart;
    const sectionParent = section.parent;

    if (!sectionParent) {

        throw new Error("IDisplayChart parent is null");
    }

    const iExitKey = exitFragment.exitKey;

    for (const option of sectionParent.options) {

        if (option.iExitKey === iExitKey) {

            gSegmentCode.loadExitSegment(
                state,
                segment.index,
                option.id
            );

            gFragmentCode.setCurrent(
                state,
                exitFragment
            );
        }
    }
};

const loadFragment = (
    state: IState,
    response: any,
    option: IRenderFragment
): IRenderFragment | null => {

    const parentFragmentID = option.parentFragmentID as string;

    if (U.isNullOrWhiteSpace(parentFragmentID) === true) {

        throw new Error("Parent fragment ID is null");
    }

    const renderFragment = gFragmentCode.parseAndLoadFragment(
        state,
        response.textData,
        parentFragmentID,
        option.id,
        option.section
    );

    state.loading = false;

    return renderFragment;
};

const loadPodFragment = (
    state: IState,
    response: any,
    option: IRenderFragment
): IRenderFragment | null => {

    const parentFragmentID = option.parentFragmentID as string;

    if (U.isNullOrWhiteSpace(parentFragmentID) === true) {

        throw new Error("Parent fragment ID is null");
    }

    const renderFragment = gFragmentCode.parseAndLoadPodFragment(
        state,
        response.textData,
        parentFragmentID,
        option.id,
        option.section
    );

    state.loading = false;

    return renderFragment;
};

const processFragment = (
    state: IState,
    fragment: IRenderFragment
): void => {

    if (!state) {
        return;
    }

    let expandedOption: IRenderFragment | null = null;

    let parentFragment: IRenderFragment | null = gStateCode.getCached_chainFragment(
        state,
        fragment.section.linkID,
        fragment.parentFragmentID
    );

    if (!parentFragment) {
        return;
    }

    for (const option of parentFragment.options) {

        if (option.id === fragment.id) {

            expandedOption = option;

            break;
        }
    }

    if (expandedOption) {

        expandedOption.ui.fragmentOptionsExpanded = true;

        gFragmentCode.showOptionNode(
            state,
            parentFragment,
            expandedOption
        );
    }
};

const gFragmentActions = {

    showAncillaryNode: (
        state: IState,
        // parentFragment: IRenderFragment,
        ancillary: IRenderFragment
    ): IStateAnyArray => {

        // if (ancillary.ui.discussionLoaded === true) {

        //     gFragmentCode.autoExpandSingleBlankOption(
        //         state,
        //         ancillary
        //     );

        //     if (!ancillary.link) {

        //         gOutlineCode.getFragmentLinkChartOutline(
        //             state,
        //             ancillary
        //         );
        //     }

        //     return gStateCode.cloneState(state);
        // }

        return getFragmentFile(
            state,
            ancillary
        );
    },

    showOptionNode: (
        state: IState,
        parentFragment: IRenderFragment,
        option: IRenderFragment
    ): IStateAnyArray => {

        // for (const child of parentFragment.options) {

        //     child.ui.discussionLoaded = false;
        // }

        gFragmentCode.clearParentSectionSelected(parentFragment.section);
        gFragmentCode.clearOrphanedSteps(parentFragment);

        gFragmentCode.prepareToShowOptionNode(
            state,
            option
        );

        // if (option.ui.discussionLoaded === true) {

        //     gFragmentCode.autoExpandSingleBlankOption(
        //         state,
        //         option
        //     );

        //     if (!option.link) {

        //         gOutlineCode.getFragmentLinkChartOutline(
        //             state,
        //             option
        //         );
        //     }

        //     return gStateCode.cloneState(state);
        // }

        return getFragmentFile(
            state,
            option
        );
    },

    loadFragment: (
        state: IState,
        response: any,
        option: IRenderFragment
    ): IState => {

        if (!state
            || U.isNullOrWhiteSpace(option.id)
        ) {
            return state;
        }

        loadFragment(
            state,
            response,
            option
        );

        return gStateCode.cloneState(state);
    },

    loadFragmentAndSetSelected: (
        state: IState,
        response: any,
        option: IRenderFragment,
        optionText: string | null = null
    ): IStateAnyArray => {

        if (!state) {

            return state;
        }

        const node = loadFragment(
            state,
            response,
            option
        );

        if (node) {

            gFragmentCode.setCurrent(
                state,
                node
            );

            if (optionText) {

                node.option = optionText;
            }
        }

        if (!state.renderState.isChainLoad) {

            state.renderState.refreshUrl = true;
        }

        return gStateCode.cloneState(state);
    },

    loadPodFragment: (
        state: IState,
        response: any,
        option: IRenderFragment,
        optionText: string | null = null
    ): IStateAnyArray => {

        if (!state) {

            return state;
        }

        const node = loadPodFragment(
            state,
            response,
            option
        );

        if (node) {

            gFragmentCode.setPodCurrent(
                state,
                node
            );

            if (optionText) {

                node.option = optionText;
            }
        }

        if (!state.renderState.isChainLoad) {

            state.renderState.refreshUrl = true;
        }

        return gStateCode.cloneState(state);
    },

    loadRootFragmentAndSetSelected: (
        state: IState,
        response: any,
        section: IDisplaySection
    ): IStateAnyArray => {

        if (!state) {
            return state;
        }

        const outlineNodeID = section.outline?.r.i;

        if (!outlineNodeID) {

            return state;
        }

        const renderFragment = gFragmentCode.parseAndLoadFragment(
            state,
            response.textData,
            "root",
            outlineNodeID,
            section,
        );

        state.loading = false;

        if (renderFragment) {

            renderFragment.section.root = renderFragment;
            renderFragment.section.current = renderFragment;
        }

        state.renderState.refreshUrl = true;

        return gStateCode.cloneState(state);
    },

    loadPodRootFragment: (
        state: IState,
        response: any,
        section: IDisplaySection
    ): IStateAnyArray => {

        if (!state) {
            return state;
        }

        const outlineNodeID = section.outline?.r.i;

        if (!outlineNodeID) {

            return state;
        }

        const renderFragment = gFragmentCode.parseAndLoadPodFragment(
            state,
            response.textData,
            "root",
            outlineNodeID,
            section,
        );

        state.loading = false;

        if (renderFragment) {

            renderFragment.section.root = renderFragment;
            renderFragment.section.current = renderFragment;
        }

        state.renderState.refreshUrl = true;

        return gStateCode.cloneState(state);
    },

    loadChainFragment: (
        state: IState,
        response: any,
        segment: IChainSegment,
        outlineNode: IRenderOutlineNode
    ): IStateAnyArray => {

        if (!state) {

            return state;
        }

        const segmentSection = segment.segmentSection;

        if (!segmentSection) {

            throw new Error("Segment section is null");
        }

        let parentFragmentID = outlineNode.parent?.i as string;

        if (outlineNode.isRoot === true) {

            if (!outlineNode.isChart) {

                parentFragmentID = "guideRoot";
            }
            else {
                parentFragmentID = "root";
            }
        }
        else if (U.isNullOrWhiteSpace(parentFragmentID) === true) {

            throw new Error("Parent fragment ID is null");
        }

        const result: { fragment: IRenderFragment, continueLoading: boolean } = gFragmentCode.parseAndLoadFragmentBase(
            state,
            response.textData,
            parentFragmentID,
            outlineNode.i,
            segmentSection,
            segment.index
        );

        const fragment = result.fragment;
        state.loading = false;

        if (fragment) {

            let parentFragment: IRenderFragment | null = gStateCode.getCached_chainFragment(
                state,
                segmentSection.linkID,
                parentFragmentID
            );

            segmentSection.current = fragment;

            if (parentFragment) {

                if (parentFragment.id === fragment.id) {

                    throw new Error("ParentFragment and Fragment are the same");
                }

                parentFragment.selected = fragment;
                fragment.ui.sectionIndex = parentFragment.ui.sectionIndex + 1;
            }
        }

        return processChainFragmentType(
            state,
            segment,
            outlineNode,
            fragment
        );
    },
};

export default gFragmentActions;
