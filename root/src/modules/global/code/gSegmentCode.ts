import { OutlineType } from "../../interfaces/enums/OutlineType";
import IDisplayChart from "../../interfaces/state/display/IDisplayChart";
import IState from "../../interfaces/state/IState";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import IChainSegment from "../../interfaces/state/segments/IChainSegment";
import ISegmentNode from "../../interfaces/state/segments/ISegmentNode";
import ChainSegment from "../../state/segments/ChainSegment";
import SegmentNode from "../../state/segments/SegmentNode";
import gUtilities from "../gUtilities";
import U from "../gUtilities";
import gFragmentCode from "./gFragmentCode";
import gStateCode from "./gStateCode";


const checkForLinkErrors = (
    segment: IChainSegment,
    linkSegment: IChainSegment,
    fragment: IRenderFragment
): void => {

    if (segment.end.key !== linkSegment.start.key
        || segment.end.type !== linkSegment.start.type
    ) {
        throw new Error("Link segment start does not match segment end");
    }

    if (!linkSegment.segmentInSection) {

        throw new Error("Segment in section was null - link");
    }

    if (!linkSegment.segmentSection) {

        throw new Error("Segment section was null - link");
    }

    if (!linkSegment.segmentOutSection) {

        throw new Error("Segment out section was null - link");
    }

    if (U.isNullOrWhiteSpace(fragment.iKey) === true) {

        throw new Error('Mismatch between fragment and outline node - link iKey');
    }
    else if (linkSegment.start.type !== OutlineType.Link) {

        throw new Error('Mismatch between fragment and outline node - link');
    }
};

const getIdentifierCharacter = (identifierChar: string): { type: OutlineType, isLast: boolean } => {

    let startOutlineType: OutlineType = OutlineType.Node;
    let isLast = false;

    if (identifierChar === '~') {

        startOutlineType = OutlineType.Link;
    }
    else if (identifierChar === '_') {

        startOutlineType = OutlineType.Exit;
    }
    else if (identifierChar === '-') {

        startOutlineType = OutlineType.Node;
        isLast = true;
    }
    else {

        throw new Error(`Unexpected query string outline node identifier: ${identifierChar}`);
    }

    return {
        type: startOutlineType,
        isLast: isLast
    };
};

const getKeyEndIndex = (remainingChain: string): { index: number, isLast: boolean | null } => {

    const startKeyEndIndex = U.indexOfAny(
        remainingChain,
        ['~', '-', '_'],
        1
    );

    if (startKeyEndIndex === -1) {

        return {
            index: remainingChain.length,
            isLast: true
        };
    }

    return {
        index: startKeyEndIndex,
        isLast: null
    };
};

const getOutlineType = (remainingChain: string): { type: OutlineType, isLast: boolean } => {

    const identifierChar = remainingChain.substring(0, 1);
    const outlineType = getIdentifierCharacter(identifierChar);

    return outlineType;
};

const getNextSegmentNode = (remainingChain: string): { segmentNode: ISegmentNode | null, endChain: string } => {

    let segmentNode: ISegmentNode | null = null;
    let endChain = "";

    if (!U.isNullOrWhiteSpace(remainingChain)) {

        const outlineType = getOutlineType(remainingChain);
        const keyEnd: { index: number, isLast: boolean | null } = getKeyEndIndex(remainingChain);

        const key = remainingChain.substring(
            1,
            keyEnd.index
        );

        segmentNode = new SegmentNode(
            remainingChain.substring(0, keyEnd.index),
            key,
            outlineType.type,
            false,
            outlineType.isLast
        );

        if (keyEnd.isLast === true) {

            segmentNode.isLast = true;
        }

        endChain = remainingChain.substring(keyEnd.index);
    }

    return {
        segmentNode,
        endChain
    };
};

const buildSegment = (
    segments: Array<IChainSegment>,
    remainingChain: string
): { remainingChain: string, segment: IChainSegment } => {

    const segmentStart = getNextSegmentNode(remainingChain);

    if (!segmentStart.segmentNode) {

        throw new Error("Segment start node was null");
    }

    remainingChain = segmentStart.endChain;
    const segmentEnd = getNextSegmentNode(remainingChain);

    if (!segmentEnd.segmentNode) {

        throw new Error("Segment end node was null");
    }

    const segment = new ChainSegment(
        segments.length,
        segmentStart.segmentNode,
        segmentEnd.segmentNode
    );

    segments.push(segment);

    return {
        remainingChain,
        segment
    };
};

const buildRootSegment = (
    segments: Array<IChainSegment>,
    remainingChain: string
): { remainingChain: string, segment: IChainSegment } => {

    const rootSegmentStart = new SegmentNode(
        "guideRoot",
        '',
        OutlineType.Node,
        true,
        false
    );

    const rootSegmentEnd = getNextSegmentNode(remainingChain);

    if (!rootSegmentEnd.segmentNode) {

        throw new Error("Segment start node was null");
    }

    const rootSegment = new ChainSegment(
        segments.length,
        rootSegmentStart,
        rootSegmentEnd.segmentNode
    );

    segments.push(rootSegment);

    return {
        remainingChain,
        segment: rootSegment
    };
};

const loadSegment = (
    state: IState,
    segment: IChainSegment,
    startOutlineNode: IRenderOutlineNode | null = null
): void => {

    gSegmentCode.loadSegmentOutlineNodes(
        state,
        segment,
        startOutlineNode
    );

    const nextSegmentOutlineNodes = segment.outlineNodes;

    if (nextSegmentOutlineNodes.length > 0) {

        const firstNode = nextSegmentOutlineNodes[nextSegmentOutlineNodes.length - 1];

        if (firstNode.i === segment.start.key) {

            firstNode.type = segment.start.type;
        }

        const lastNode = nextSegmentOutlineNodes[0];

        if (lastNode.i === segment.end.key) {

            lastNode.type = segment.end.type;
            lastNode.isLast = segment.end.isLast;
        }
    }

    gFragmentCode.loadNextChainFragment(
        state,
        segment
    );
};

const gSegmentCode = {

    setNextSegmentSection: (
        state: IState,
        segmentIndex: number | null,
        link: IDisplayChart
    ): void => {

        if (!segmentIndex
            || !state.renderState.isChainLoad
        ) {
            return;
        }

        const segment = state.renderState.segments[segmentIndex - 1];

        if (!segment) {

            throw new Error("Segment is null");
        }

        segment.segmentOutSection = link;
        const nextSegment = state.renderState.segments[segmentIndex];

        if (nextSegment) {

            nextSegment.segmentInSection = segment.segmentSection;
            nextSegment.segmentSection = link;
            nextSegment.segmentOutSection = link; // This could be set again when the end node is processed

            loadSegment(
                state,
                nextSegment
            );
        }
    },

    loadLinkSegment: (
        state: IState,
        linkSegmentIndex: number,
        linkFragment: IRenderFragment,
        link: IDisplayChart
    ): IChainSegment => {

        const segments = state.renderState.segments;

        if (linkSegmentIndex < 1) {

            throw new Error('Index < 0');
        }

        const currentSegment = segments[linkSegmentIndex - 1];
        currentSegment.segmentOutSection = link;

        if (linkSegmentIndex >= segments.length) {

            throw new Error('Next index >= array length');
        }

        const nextSegment = segments[linkSegmentIndex];

        if (!nextSegment) {

            throw new Error("Next link segment was null");
        }

        if (nextSegment.outlineNodesLoaded === true) {

            return nextSegment;
        }

        nextSegment.outlineNodesLoaded = true;
        nextSegment.segmentInSection = currentSegment.segmentSection;
        nextSegment.segmentSection = link;
        nextSegment.segmentOutSection = link;

        if (!nextSegment.segmentInSection) {

            nextSegment.segmentInSection = currentSegment.segmentSection;
        }

        if (!nextSegment.segmentSection) {

            nextSegment.segmentSection = currentSegment.segmentOutSection;
        }

        if (!nextSegment.segmentOutSection) {

            nextSegment.segmentOutSection = currentSegment.segmentOutSection;
        }

        if (U.isNullOrWhiteSpace(nextSegment.segmentSection.outline?.r.i) === true) {

            throw new Error("Next segment section root key was null");
        }

        let startOutlineNode = gStateCode.getCached_outlineNode(
            state,
            nextSegment.segmentSection.linkID,
            nextSegment.segmentSection.outline?.r.i as string
        );

        loadSegment(
            state,
            nextSegment,
            startOutlineNode
        );

        checkForLinkErrors(
            currentSegment,
            nextSegment,
            linkFragment
        );

        return nextSegment;
    },

    loadExitSegment: (
        state: IState,
        segmentIndex: number,
        plugID: string
    ): IChainSegment => {

        const segments = state.renderState.segments;
        const currentSegment = segments[segmentIndex];
        const exitSegmentIndex = segmentIndex + 1;

        if (exitSegmentIndex >= segments.length) {

            throw new Error('Next index >= array length');
        }

        const exitSegment = segments[exitSegmentIndex];

        if (!exitSegment) {

            throw new Error("Exit link segment was null");
        }

        if (exitSegment.outlineNodesLoaded === true) {

            return exitSegment;
        }

        const segmentSection = currentSegment.segmentSection as IDisplayChart;
        const link = segmentSection.parent;

        if (!link) {

            throw new Error("Link fragmnt was null");
        }

        currentSegment.segmentOutSection = link.section;
        exitSegment.outlineNodesLoaded = true;
        exitSegment.segmentInSection = currentSegment.segmentSection;
        exitSegment.segmentSection = currentSegment.segmentOutSection;
        exitSegment.segmentOutSection = currentSegment.segmentOutSection;

        if (!exitSegment.segmentInSection) {

            throw new Error("Segment in section was null");
        }

        const exitOutlineNode = gStateCode.getCached_outlineNode(
            state,
            exitSegment.segmentInSection.linkID,
            exitSegment.start.key
        );

        if (!exitOutlineNode) {

            throw new Error("ExitOutlineNode was null");
        }

        if (U.isNullOrWhiteSpace(exitOutlineNode._x) === true) {

            throw new Error("Exit key was null");
        }

        const plugOutlineNode = gStateCode.getCached_outlineNode(
            state,
            exitSegment.segmentSection.linkID,
            plugID
        );

        if (!plugOutlineNode) {

            throw new Error("PlugOutlineNode was null");
        }

        if (exitOutlineNode._x !== plugOutlineNode.x) {

            throw new Error("PlugOutlineNode does not match exitOutlineNode");
        }

        loadSegment(
            state,
            exitSegment,
            plugOutlineNode
        );

        return exitSegment;
    },

    loadNextSegment: (
        state: IState,
        segment: IChainSegment
    ): void => {

        if (segment.outlineNodesLoaded === true) {
            return;
        }

        segment.outlineNodesLoaded = true;
        const nextSegmentIndex = segment.index + 1;
        const segments = state.renderState.segments;

        if (nextSegmentIndex >= segments.length) {

            throw new Error('Next index >= array length');
        }

        const nextSegment = segments[nextSegmentIndex];

        if (nextSegment) {

            if (!nextSegment.segmentInSection) {

                nextSegment.segmentInSection = segment.segmentSection;
            }

            if (!nextSegment.segmentSection) {

                nextSegment.segmentSection = segment.segmentOutSection;
            }

            if (!nextSegment.segmentOutSection) {

                nextSegment.segmentOutSection = segment.segmentOutSection;
            }

            loadSegment(
                state,
                nextSegment
            );
        }
    },

    getNextSegmentOutlineNode: (
        state: IState,
        segment: IChainSegment
    ): IRenderOutlineNode | null => {

        let outlineNode = segment.outlineNodes.pop() ?? null;

        if (outlineNode?.isLast === true) {

            return outlineNode;
        }

        if (segment.outlineNodes.length === 0) {

            const nextSegment = state.renderState.segments[segment.index + 1];

            if (!nextSegment) {

                throw new Error('NextSegment was null');
            }

            if (!nextSegment.segmentInSection) {

                nextSegment.segmentInSection = segment.segmentSection;
            }

            if (!nextSegment.segmentSection) {

                nextSegment.segmentSection = segment.segmentOutSection;
            }

            if (!nextSegment.segmentOutSection) {

                nextSegment.segmentOutSection = segment.segmentOutSection;
            }
        }

        return outlineNode;
    },

    parseSegments: (
        state: IState,
        queryString: string
    ): void => {

        if (queryString.startsWith('?') === true) {

            queryString = queryString.substring(1);
        }

        if (gUtilities.isNullOrWhiteSpace(queryString) === true) {
            return;
        }

        const segments: Array<IChainSegment> = [];
        let remainingChain = queryString;
        let result: { remainingChain: string, segment: IChainSegment };

        result = buildRootSegment(
            segments,
            remainingChain
        );

        while (!U.isNullOrWhiteSpace(remainingChain)) {

            result = buildSegment(
                segments,
                remainingChain
            );

            if (result.segment.end.isLast === true) {
                break;
            }

            remainingChain = result.remainingChain;
        }

        state.renderState.segments = segments;
    },

    loadSegmentOutlineNodes: (
        state: IState,
        segment: IChainSegment,
        startOutlineNode: IRenderOutlineNode | null = null
    ): void => {

        if (!segment.segmentInSection) {

            throw new Error("Segment in section was null");
        }

        if (!segment.segmentSection) {

            throw new Error("Segment section was null");
        }

        let segmentOutlineNodes: Array<IRenderOutlineNode> = [];

        if (!startOutlineNode) {

            startOutlineNode = gStateCode.getCached_outlineNode(
                state,
                segment.segmentInSection.linkID,
                segment.start.key
            );

            if (!startOutlineNode) {

                throw new Error("Start outline node was null");
            }

            startOutlineNode.type = segment.start.type;
        }

        let endOutlineNode = gStateCode.getCached_outlineNode(
            state,
            segment.segmentSection.linkID,
            segment.end.key
        );

        if (!endOutlineNode) {

            throw new Error("End outline node was null");
        }

        endOutlineNode.type = segment.end.type;
        let parent: IRenderOutlineNode | null = endOutlineNode;
        let firstLoop = true;

        while (parent) {

            segmentOutlineNodes.push(parent);

            if (!firstLoop
                && parent?.isChart === true
                && parent?.isRoot === true
            ) {
                break;
            }

            if (parent?.i === startOutlineNode.i) {
                break;
            }

            firstLoop = false;
            parent = parent.parent;
        }

        segment.outlineNodes = segmentOutlineNodes;
    }
}

export default gSegmentCode;
