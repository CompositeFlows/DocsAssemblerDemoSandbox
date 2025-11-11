import IState from "../../../interfaces/state/IState";
import IStateAnyArray from "../../../interfaces/state/IStateAnyArray";
import State from "../../../state/State";
import TreeSolve from "../../../state/window/TreeSolve";
import U from "../../../global/gUtilities";
import gRenderEffects from "../../../global/effects/gRenderEffects";
import gRenderCode from "../../../global/code/gRenderCode";
import gSegmentCode from "../../../global/code/gSegmentCode";
import { OutlineType } from "../../../interfaces/enums/OutlineType";


const initialiseState = (): IState => {

    if (!window.TreeSolve) {

        window.TreeSolve = new TreeSolve();
    }

    const state: IState = new State();
    gRenderCode.parseRenderingComment(state);

    return state;
};

const buildRenderDisplay = (state: IState): IStateAnyArray => {

    if (!state.renderState.displayGuide?.root) {

        return state;
    }

    if (U.isNullOrWhiteSpace(state.renderState.displayGuide?.root.iKey) === true
        && (!state.renderState.displayGuide?.root.options
            || state.renderState.displayGuide?.root.options.length === 0)
    ) {
        return state;
    }

    return [
        state,
        gRenderEffects.getGuideOutline(state)
    ];
};

const buildSegmentsRenderDisplay = (
    state: IState,
    queryString: string
): IStateAnyArray => {

    state.renderState.isChainLoad = true;

    gSegmentCode.parseSegments(
        state,
        queryString
    );

    const segments = state.renderState.segments;

    if (segments.length === 0) {

        return state;
    }

    if (segments.length === 1) {

        throw new Error("There was only 1 segment");
    }

    const rootSegment = segments[0];

    if (!rootSegment.start.isRoot) {

        throw new Error("GuideRoot not present");
    }

    const firstSegment = segments[1];

    if (!firstSegment.start.isLast
        && firstSegment.start.type !== OutlineType.Link
    ) {
        throw new Error("Invalid query string format - it should start with '-' or '~'");
    }

    return [
        state,
        gRenderEffects.getGuideOutlineAndLoadSegments(state)
    ];
};

const initState = {

    initialise: (): IStateAnyArray => {

        const state: IState = initialiseState();
        const queryString: string = window.location.search;

        try {

            if (!U.isNullOrWhiteSpace(queryString)) {

                return buildSegmentsRenderDisplay(
                    state,
                    queryString
                );
            }

            return buildRenderDisplay(state);
        }
        catch (e: any) {

            state.genericError = true;

            console.log(e);

            return state;
        }
    }
};

export default initState;

