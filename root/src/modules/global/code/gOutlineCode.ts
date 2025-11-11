import IState from "../../interfaces/state/IState";
import IRenderOutline from "../../interfaces/state/render/IRenderOutline";
import IRenderOutlineChart from "../../interfaces/state/render/IRenderOutlineChart";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import RenderOutline from "../../state/render/RenderOutline";
import RenderOutlineChart from "../../state/render/RenderOutlineChart";
import RenderOutlineNode from "../../state/render/RenderOutlineNode";
import gFragmentCode from "./gFragmentCode";
import gStateCode from "./gStateCode";
import gRenderCode from "./gRenderCode";
import gFileConstants from "../gFileConstants";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import U from "../gUtilities";
import gFragmentActions from "../actions/gFragmentActions";
import { ParseType } from "../../interfaces/enums/ParseType";
import DisplayChart from "../../state/display/DisplayChart";
import IDisplaySection from "../../interfaces/state/display/IDisplaySection";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import gOutlineActions from "../actions/gOutlineActions";
import { OutlineType } from "../../interfaces/enums/OutlineType";
import gSegmentCode from "./gSegmentCode";
import IDisplayChart from "../../interfaces/state/display/IDisplayChart";


const cacheNodeForNewLink = (
    state: IState,
    outlineNode: IRenderOutlineNode,
    linkID: number,
): void => {

    gStateCode.cache_outlineNode(
        state,
        linkID,
        outlineNode
    );

    for (const option of outlineNode.o) {

        cacheNodeForNewLink(
            state,
            option,
            linkID
        );
    }
};

const cacheNodeForNewPod = (
    state: IState,
    outlineNode: IRenderOutlineNode,
    linkID: number,
): void => {

    gStateCode.cache_outlineNode(
        state,
        linkID,
        outlineNode
    );

    for (const option of outlineNode.o) {

        cacheNodeForNewPod(
            state,
            option,
            linkID
        );
    }
};

const loadNode = (
    state: IState,
    rawNode: any,
    linkID: number,
    parent: IRenderOutlineNode | null = null
): IRenderOutlineNode => {

    const node = new RenderOutlineNode();
    node.i = rawNode.i;
    node.c = rawNode.c ?? null;
    node.d = rawNode.d ?? null;
    node._x = rawNode._x ?? null;
    node.x = rawNode.x ?? null;
    node.parent = parent;
    node.type = OutlineType.Node;

    gStateCode.cache_outlineNode(
        state,
        linkID,
        node
    );

    if (node.c) {

        node.type = OutlineType.Link;
    }

    if (rawNode.o
        && Array.isArray(rawNode.o) === true
        && rawNode.o.length > 0
    ) {
        let o: IRenderOutlineNode;

        for (const option of rawNode.o) {

            o = loadNode(
                state,
                option,
                linkID,
                node
            );

            node.o.push(o);
        }
    }

    return node;
};

const loadCharts = (
    outline: IRenderOutline,
    rawOutlineCharts: Array<any>
): void => {

    outline.c = [];
    let c: IRenderOutlineChart;

    for (const chart of rawOutlineCharts) {

        c = new RenderOutlineChart();
        c.i = chart.i;
        c.p = chart.p;
        outline.c.push(c);
    }
};

const gOutlineCode = {

    registerOutlineUrlDownload: (
        state: IState,
        url: string
    ): boolean => {

        if (state.renderState.outlineUrls[url] === true) {

            return true;
        }

        state.renderState.outlineUrls[url] = true;

        return false;
    },

    loadGuideOutlineProperties: (
        state: IState,
        outlineResponse: any,
        fragmentFolderUrl: string
    ): IRenderOutline => {

        if (!state.renderState.displayGuide) {

            throw new Error('DisplayGuide was null.');
        }

        const guide = state.renderState.displayGuide;
        const rawOutline = outlineResponse.jsonData;

        const guideOutline = gOutlineCode.getOutline(
            state,
            fragmentFolderUrl
        );

        gOutlineCode.loadOutlineProperties(
            state,
            rawOutline,
            guideOutline,
            guide.linkID
        );

        guide.outline = guideOutline;
        guideOutline.r.isChart = false;

        if (state.renderState.isChainLoad === true) {

            const segments = state.renderState.segments;

            if (segments.length > 0) {

                const rootSegment = segments[0];
                rootSegment.start.key = guideOutline.r.i;
            }
        }

        gFragmentCode.cacheSectionRoot(
            state,
            guide
        );

        if (guideOutline.r.c != null) {
            // Load outline from that location and load root

            const outlineChart: IRenderOutlineChart | null = gOutlineCode.getOutlineChart(
                guideOutline,
                guideOutline.r.c
            );

            const guideRoot = guide.root;

            if (!guideRoot) {

                throw new Error('The current fragment was null');
            }

            gOutlineCode.getOutlineFromChart_subscription(
                state,
                outlineChart,
                guideRoot
            );
        }
        else if (guide.root) {

            gFragmentCode.expandOptionPods(
                state,
                guide.root
            );

            gFragmentCode.autoExpandSingleBlankOption(
                state,
                guide.root
            );
        }

        return guideOutline;
    },

    getOutlineChart: (
        outline: IRenderOutline,
        index: number
    ): IRenderOutlineChart | null => {

        if (outline.c.length > index) {

            return outline.c[index];
        }

        return null;
    },

    buildDisplayChartFromRawOutline: (
        state: IState,
        chart: IRenderOutlineChart,
        rawOutline: any,
        outline: IRenderOutline,
        parent: IRenderFragment,
    ): IDisplayChart => {

        const link = new DisplayChart(
            gStateCode.getFreshKeyInt(state),
            chart
        );

        gOutlineCode.loadOutlineProperties(
            state,
            rawOutline,
            outline,
            link.linkID
        );

        link.outline = outline;
        link.parent = parent;
        parent.link = link;

        return link;
    },

    buildPodDisplayChartFromRawOutline: (
        state: IState,
        chart: IRenderOutlineChart,
        rawOutline: any,
        outline: IRenderOutline,
        parent: IRenderFragment,
    ): IDisplayChart => {

        const pod = new DisplayChart(
            gStateCode.getFreshKeyInt(state),
            chart
        );

        gOutlineCode.loadOutlineProperties(
            state,
            rawOutline,
            outline,
            pod.linkID
        );

        pod.outline = outline;
        pod.parent = parent;
        parent.pod = pod;

        return pod;
    },

    buildDisplayChartFromOutlineForNewLink: (
        state: IState,
        chart: IRenderOutlineChart,
        outline: IRenderOutline,
        parent: IRenderFragment,
    ): IDisplayChart => {

        const link = new DisplayChart(
            gStateCode.getFreshKeyInt(state),
            chart
        );

        gOutlineCode.loadOutlinePropertiesForNewLink(
            state,
            outline,
            link.linkID
        );

        link.outline = outline;
        link.parent = parent;
        parent.link = link;

        return link;
    },

    buildDisplayChartFromOutlineForNewPod: (
        state: IState,
        chart: IRenderOutlineChart,
        outline: IRenderOutline,
        parent: IRenderFragment,
    ): IDisplayChart => {

        const pod = new DisplayChart(
            gStateCode.getFreshKeyInt(state),
            chart
        );

        gOutlineCode.loadOutlinePropertiesForNewPod(
            state,
            outline,
            pod.linkID
        );

        pod.outline = outline;
        pod.parent = parent;
        parent.pod = pod;

        return pod;
    },

    loadSegmentChartOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        parent: IRenderFragment,
        segmentIndex: number
    ): void => {

        if (parent.link) {

            throw new Error(`Link already loaded, rootID: ${parent.link.root?.id}`);
        }

        const rawOutline = outlineResponse.jsonData;

        const link = gOutlineCode.buildDisplayChartFromRawOutline(
            state,
            chart,
            rawOutline,
            outline,
            parent
        );

        gSegmentCode.loadLinkSegment(
            state,
            segmentIndex,
            parent,
            link
        );

        gOutlineCode.setChartAsCurrent(
            state,
            link
        );

        gFragmentCode.cacheSectionRoot(
            state,
            link
        );
    },

    loadChartOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        parent: IRenderFragment,
    ): void => {

        if (parent.link) {

            throw new Error(`Link already loaded, rootID: ${parent.link.root?.id}`);
        }

        const rawOutline = outlineResponse.jsonData;

        const link = gOutlineCode.buildDisplayChartFromRawOutline(
            state,
            chart,
            rawOutline,
            outline,
            parent
        );

        gFragmentCode.cacheSectionRoot(
            state,
            link
        );

        // Need to build a displayCHart here
        gOutlineCode.setChartAsCurrent(
            state,
            link
        );

        gOutlineCode.postGetChartOutlineRoot_subscription(
            state,
            link
        );
    },

    loadPodOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        option: IRenderFragment,
    ): void => {

        if (option.pod) {

            throw new Error(`Link already loaded, rootID: ${option.pod.root?.id}`);
        }

        const rawOutline = outlineResponse.jsonData;

        const pod = gOutlineCode.buildPodDisplayChartFromRawOutline(
            state,
            chart,
            rawOutline,
            outline,
            option
        );

        gFragmentCode.cacheSectionRoot(
            state,
            pod
        );

        // // Need to build a displayCHart here
        // gOutlineCode.setChartAsCurrent(
        //     state,
        //     link
        // );

        gOutlineCode.postGetPodOutlineRoot_subscription(
            state,
            pod
        );
    },

    postGetChartOutlineRoot_subscription: (
        state: IState,
        section: IDisplaySection
    ): void => {

        if (section.root) {

            // if (!section.root.ui.discussionLoaded) {

            //     throw new Error('Section root discussion was not loaded');
            // }

            return;
        }

        const outline = section.outline;

        if (!outline) {

            throw new Error('Section outline was null');
        }

        const rootFragmenID = outline.r.i;
        const path = outline.path;
        const url: string = `${path}/${rootFragmenID}${gFileConstants.fragmentFileExtension}`;

        const loadAction = (state: IState, response: any) => {

            return gFragmentActions.loadRootFragmentAndSetSelected(
                state,
                response,
                section
            );
        };

        gStateCode.AddReLoadDataEffectImmediate(
            state,
            `loadChartOutlineRoot`,
            ParseType.Text,
            url,
            loadAction
        );
    },

    postGetPodOutlineRoot_subscription: (
        state: IState,
        section: IDisplaySection
    ): void => {

        if (section.root) {

            // if (!section.root.ui.discussionLoaded) {

            //     throw new Error('Section root discussion was not loaded');
            // }

            return;
        }

        const outline = section.outline;

        if (!outline) {

            throw new Error('Section outline was null');
        }

        const rootFragmenID = outline.r.i;
        const path = outline.path;
        const url: string = `${path}/${rootFragmenID}${gFileConstants.fragmentFileExtension}`;

        const loadAction = (state: IState, response: any) => {

            return gFragmentActions.loadPodRootFragment(
                state,
                response,
                section
            );
        };

        gStateCode.AddReLoadDataEffectImmediate(
            state,
            `loadChartOutlineRoot`,
            ParseType.Text,
            url,
            loadAction
        );
    },

    setChartAsCurrent: (
        state: IState,
        displaySection: IDisplaySection
    ): void => {

        state.renderState.currentSection = displaySection;
    },

    getOutline: (
        state: IState,
        fragmentFolderUrl: string
    ): IRenderOutline => {

        let outline: IRenderOutline = state.renderState.outlines[fragmentFolderUrl];

        if (outline) {

            return outline;
        }

        outline = new RenderOutline(fragmentFolderUrl);
        state.renderState.outlines[fragmentFolderUrl] = outline;

        return outline;
    },

    // getFragmentLinkChartOutline: (
    //     state: IState,
    //     fragment: IRenderFragment
    // ): void => {

    //     const outline = fragment.section.outline;

    //     if (!outline) {
    //         return;
    //     }

    //     const outlineNode = gStateCode.getCached_outlineNode(
    //         state,
    //         fragment.section.linkID,
    //         fragment.id
    //     );

    //     if (outlineNode?.c == null) {
    //         return;
    //     }

    //     const outlineChart = gOutlineCode.getOutlineChart(
    //         outline,
    //         outlineNode?.c
    //     );

    //     gOutlineCode.getOutlineFromChart_subscription(
    //         state,
    //         outlineChart,
    //         fragment
    //     );
    // },

    getLinkOutline_subscripion: (
        state: IState,
        option: IRenderFragment,
    ): void => {

        const outline = option.section.outline;

        if (!outline) {
            return;
        }

        const outlineNode = gStateCode.getCached_outlineNode(
            state,
            option.section.linkID,
            option.id
        );

        if (outlineNode?.c == null
            || state.renderState.isChainLoad === true // Will load it from a segment
        ) {
            return;
        }

        const outlineChart = gOutlineCode.getOutlineChart(
            outline,
            outlineNode?.c
        );

        gOutlineCode.getOutlineFromChart_subscription(
            state,
            outlineChart,
            option
        );
    },

    getPodOutline_subscripion: (
        state: IState,
        option: IRenderFragment,
        section: IDisplaySection,
    ): void => {

        if (U.isNullOrWhiteSpace(option.podKey) === true) {
            return;
        }

        const outline = section.outline;

        if (!outline) {
            return;
        }

        const outlineNode = gStateCode.getCached_outlineNode(
            state,
            option.section.linkID,
            option.id
        );

        if (outlineNode?.d == null) {
            return;
        }

        const outlineChart = gOutlineCode.getOutlineChart(
            outline,
            outlineNode?.d
        );

        gOutlineCode.getOutlineFromPod_subscription(
            state,
            outlineChart,
            option
        );
    },

    getSegmentOutline_subscription: (
        state: IState,
        chart: IRenderOutlineChart | null,
        linkFragment: IRenderFragment,
        segmentIndex: number
    ): void => {

        if (!chart) {

            throw new Error('OutlineChart was null');
        }

        if (linkFragment.link?.root) {

            console.log(`Link root already loaded: ${linkFragment.link.root?.id}`);

            return;
        }

        let nextSegmentIndex = segmentIndex;

        if (nextSegmentIndex != null) {

            nextSegmentIndex++;
        }

        const outlineChartPath = chart?.p as string;
        const fragmentFolderUrl = gRenderCode.getFragmentFolderUrl(outlineChartPath) as string;

        if (!U.isNullOrWhiteSpace(fragmentFolderUrl)) {

            const outline = gOutlineCode.getOutline(
                state,
                fragmentFolderUrl
            );

            if (outline.loaded === true) {

                if (!linkFragment.link) {

                    const link = gOutlineCode.buildDisplayChartFromOutlineForNewLink(
                        state,
                        chart,
                        outline,
                        linkFragment
                    );

                    gSegmentCode.setNextSegmentSection(
                        state,
                        nextSegmentIndex,
                        link
                    );
                }

                gOutlineCode.setChartAsCurrent(
                    state,
                    linkFragment.link as IDisplaySection
                );
            }
            else {
                const url: string = `${fragmentFolderUrl}/${gFileConstants.guideOutlineFilename}`;

                const loadRequested = gOutlineCode.registerOutlineUrlDownload(
                    state,
                    url
                );

                if (loadRequested === true) {
                    return;
                }

                let name: string;

                if (state.renderState.isChainLoad === true) {

                    name = `loadChainChartOutlineFile`;
                }
                else {
                    name = `loadChartOutlineFile`;
                }

                const loadDelegate = (
                    state: IState,
                    outlineResponse: any
                ): IStateAnyArray => {

                    return gOutlineActions.loadSegmentChartOutlineProperties(
                        state,
                        outlineResponse,
                        outline,
                        chart,
                        linkFragment,
                        nextSegmentIndex
                    );
                };

                gStateCode.AddReLoadDataEffectImmediate(
                    state,
                    name,
                    ParseType.Json,
                    url,
                    loadDelegate
                );
            }
        }
    },

    getOutlineFromChart_subscription: (
        state: IState,
        chart: IRenderOutlineChart | null,
        linkFragment: IRenderFragment
    ): void => {

        if (!chart) {

            throw new Error('OutlineChart was null');
        }

        if (linkFragment.link?.root) {

            console.log(`Link root already loaded: ${linkFragment.link.root?.id}`);

            return;
        }

        const outlineChartPath = chart?.p as string;
        const fragmentFolderUrl = gRenderCode.getFragmentFolderUrl(outlineChartPath) as string;

        if (!U.isNullOrWhiteSpace(fragmentFolderUrl)) {

            const outline = gOutlineCode.getOutline(
                state,
                fragmentFolderUrl
            );

            if (outline.loaded === true) {

                if (!linkFragment.link) {

                    gOutlineCode.buildDisplayChartFromOutlineForNewLink(
                        state,
                        chart,
                        outline,
                        linkFragment
                    );
                }

                gOutlineCode.setChartAsCurrent(
                    state,
                    linkFragment.link as IDisplaySection
                );

                gOutlineCode.postGetChartOutlineRoot_subscription(
                    state,
                    linkFragment.link as IDisplaySection
                );
            }
            else {
                const url: string = `${fragmentFolderUrl}/${gFileConstants.guideOutlineFilename}`;

                const loadRequested = gOutlineCode.registerOutlineUrlDownload(
                    state,
                    url
                );

                if (loadRequested === true) {
                    return;
                }

                let name: string;

                if (state.renderState.isChainLoad === true) {

                    name = `loadChainChartOutlineFile`;
                }
                else {
                    name = `loadChartOutlineFile`;
                }

                const loadDelegate = (
                    state: IState,
                    outlineResponse: any
                ): IStateAnyArray => {

                    return gOutlineActions.loadChartOutlineProperties(
                        state,
                        outlineResponse,
                        outline,
                        chart,
                        linkFragment
                    );
                };

                gStateCode.AddReLoadDataEffectImmediate(
                    state,
                    name,
                    ParseType.Json,
                    url,
                    loadDelegate
                );
            }
        }
    },

    getOutlineFromPod_subscription: (
        state: IState,
        chart: IRenderOutlineChart | null,
        optionFragment: IRenderFragment
    ): void => {

        if (!chart) {

            throw new Error('OutlineChart was null');
        }

        if (optionFragment.link?.root) {

            console.log(`Link root already loaded: ${optionFragment.link.root?.id}`);

            return;
        }

        const outlineChartPath = chart?.p as string;
        const fragmentFolderUrl = gRenderCode.getFragmentFolderUrl(outlineChartPath) as string;

        if (U.isNullOrWhiteSpace(fragmentFolderUrl)) {
            return;
        }

        const outline = gOutlineCode.getOutline(
            state,
            fragmentFolderUrl
        );

        if (outline.loaded === true) {

            if (!optionFragment.pod) {

                gOutlineCode.buildDisplayChartFromOutlineForNewPod(
                    state,
                    chart,
                    outline,
                    optionFragment
                );
            }

            gOutlineCode.postGetPodOutlineRoot_subscription(
                state,
                optionFragment.pod as IDisplaySection
            );
        }
        else {
            const url: string = `${fragmentFolderUrl}/${gFileConstants.guideOutlineFilename}`;

            const loadRequested = gOutlineCode.registerOutlineUrlDownload(
                state,
                url
            );

            if (loadRequested === true) {
                return;
            }

            let name: string;

            if (state.renderState.isChainLoad === true) {

                name = `loadChainChartOutlineFile`;
            }
            else {
                name = `loadChartOutlineFile`;
            }

            const loadDelegate = (
                state: IState,
                outlineResponse: any
            ): IStateAnyArray => {

                return gOutlineActions.loadPodOutlineProperties(
                    state,
                    outlineResponse,
                    outline,
                    chart,
                    optionFragment
                );
            };

            gStateCode.AddReLoadDataEffectImmediate(
                state,
                name,
                ParseType.Json,
                url,
                loadDelegate
            );
        }
    },

    loadOutlineProperties: (
        state: IState,
        rawOutline: any,
        outline: IRenderOutline,
        linkID: number
    ): IRenderOutline => {

        outline.v = rawOutline.v;

        if (rawOutline.c
            && Array.isArray(rawOutline.c) === true
            && rawOutline.c.length > 0
        ) {
            loadCharts(
                outline,
                rawOutline.c
            );
        }

        if (rawOutline.e) {

            outline.e = rawOutline.e;
        }

        outline.r = loadNode(
            state,
            rawOutline.r,
            linkID
        );

        outline.loaded = true;
        outline.r.isRoot = true;
        outline.mv = rawOutline.mv;

        return outline;
    },

    loadOutlinePropertiesForNewLink: (
        state: IState,
        outline: IRenderOutline,
        linkID: number
    ): void => {

        cacheNodeForNewLink(
            state,
            outline.r,
            linkID
        );
    },

    loadOutlinePropertiesForNewPod: (
        state: IState,
        outline: IRenderOutline,
        linkID: number
    ): void => {

        cacheNodeForNewPod(
            state,
            outline.r,
            linkID
        );
    }
};

export default gOutlineCode;

