import { ParseType } from "../../interfaces/enums/ParseType";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutline from "../../interfaces/state/render/IRenderOutline";
import IRenderOutlineChart from "../../interfaces/state/render/IRenderOutlineChart";
import gOutlineCode from "../code/gOutlineCode";
import gSegmentCode from "../code/gSegmentCode";
import gStateCode from "../code/gStateCode";
import gFileConstants from "../gFileConstants";
import U from "../gUtilities";
import gFragmentActions from "./gFragmentActions";


const gOutlineActions = {

    loadGuideOutlineProperties: (
        state: IState,
        outlineResponse: any,
        fragmentFolderUrl: string
    ): IStateAnyArray => {

        gOutlineCode.loadGuideOutlineProperties(
            state,
            outlineResponse,
            fragmentFolderUrl
        );

        return gStateCode.cloneState(state);
    },

    loadSegmentChartOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        parent: IRenderFragment,
        segmentIndex: number
    ): IStateAnyArray => {

        gOutlineCode.loadSegmentChartOutlineProperties(
            state,
            outlineResponse,
            outline,
            chart,
            parent,
            segmentIndex
        );

        return gStateCode.cloneState(state);
    },

    loadChartOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        parent: IRenderFragment,
    ): IStateAnyArray => {

        gOutlineCode.loadChartOutlineProperties(
            state,
            outlineResponse,
            outline,
            chart,
            parent
        );

        return gStateCode.cloneState(state);
    },

    loadPodOutlineProperties: (
        state: IState,
        outlineResponse: any,
        outline: IRenderOutline,
        chart: IRenderOutlineChart,
        option: IRenderFragment,
    ): IStateAnyArray => {

        gOutlineCode.loadPodOutlineProperties(
            state,
            outlineResponse,
            outline,
            chart,
            option
        );

        return gStateCode.cloneState(state);
    },

    loadGuideOutlineAndSegments: (
        state: IState,
        outlineResponse: any,
        path: string
    ): IStateAnyArray => {

        const section = state.renderState.displayGuide;

        if (!section) {

            return state;
        }

        const rootSegment = state.renderState.segments[0];

        if (!rootSegment) {

            return state;
        }

        const fragmentFolderUrl = section.guide.fragmentFolderUrl;

        if (U.isNullOrWhiteSpace(fragmentFolderUrl) === true) {

            return state;
        }

        rootSegment.segmentInSection = section;
        rootSegment.segmentSection = section;
        rootSegment.segmentOutSection = section;

        gOutlineCode.loadGuideOutlineProperties(
            state,
            outlineResponse,
            path
        );

        gSegmentCode.loadSegmentOutlineNodes(
            state,
            rootSegment
        );

        const firstNode = gSegmentCode.getNextSegmentOutlineNode(
            state,
            rootSegment
        );

        if (firstNode) {

            const url = `${fragmentFolderUrl}/${firstNode.i}${gFileConstants.fragmentFileExtension}`;

            const loadDelegate = (
                state: IState,
                outlineResponse: any
            ): IStateAnyArray => {

                return gFragmentActions.loadChainFragment(
                    state,
                    outlineResponse,
                    rootSegment,
                    firstNode
                );
            };

            gStateCode.AddReLoadDataEffectImmediate(
                state,
                `loadChainFragment`,
                ParseType.Json,
                url,
                loadDelegate
            );
        }
        else {
            gSegmentCode.loadNextSegment(
                state,
                rootSegment,
            );
        }

        return gStateCode.cloneState(state);
    }
};

export default gOutlineActions;
