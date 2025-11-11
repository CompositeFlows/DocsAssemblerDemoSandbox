import gFragmentActions from "../../../global/actions/gFragmentActions";
import gFragmentCode from "../../../global/code/gFragmentCode";
import gStateCode from "../../../global/code/gStateCode";
import IDisplayChart from "../../../interfaces/state/display/IDisplayChart";
import IState from "../../../interfaces/state/IState";
import IStateAnyArray from "../../../interfaces/state/IStateAnyArray";
import IRenderFragment from "../../../interfaces/state/render/IRenderFragment";
import IFragmentPayload from "../../../interfaces/state/ui/payloads/IFragmentPayload";


const hideFromPaint = (
    fragment: IRenderFragment | null | undefined,
    hide: boolean
): void => {

    /* 
        This is a fix for:
        NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.
    */

    if (!fragment) {
        return
    }

    fragment.ui.doNotPaint = hide;

    hideFromPaint(
        fragment.selected,
        hide
    );

    hideFromPaint(
        fragment.link?.root,
        hide
    );
}

const hideOptionsFromPaint = (
    fragment: IRenderFragment | null | undefined,
    hide: boolean
): void => {

    /* 
        This is a fix for:
        NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.
    */
    if (!fragment) {
        return
    }

    for (const option of fragment?.options) {

        hideFromPaint(
            option,
            hide
        );
    }

    hideSectionParentSelected(
        fragment.section as IDisplayChart,
        hide
    );
}

const hideSectionParentSelected = (
    displayChart: IDisplayChart,
    hide: boolean
): void => {

    if (!displayChart?.parent) {
        return;
    }

    hideFromPaint(
        displayChart.parent.selected,
        hide
    );

    hideSectionParentSelected(
        displayChart.parent.section as IDisplayChart,
        hide
    );
};

const fragmentActions = {

    expandOptions: (
        state: IState,
        fragment: IRenderFragment
    ): IStateAnyArray => {

        if (!state
            || !fragment
        ) {
            return state;
        }

        const ignoreEvent = state.renderState.activeAncillary != null;
        gFragmentCode.clearAncillaryActive(state);

        if (ignoreEvent === true) {

            return gStateCode.cloneState(state);
        }

        gStateCode.setDirty(state);
        gFragmentCode.resetFragmentUis(state);
        const expanded = fragment.ui.fragmentOptionsExpanded !== true;
        state.renderState.ui.optionsExpanded = expanded;
        fragment.ui.fragmentOptionsExpanded = expanded;

        hideOptionsFromPaint(
            fragment,
            true
        );

        return gStateCode.cloneState(state);
    },

    hideOptions: (
        state: IState,
        fragment: IRenderFragment
    ): IStateAnyArray => {

        if (!state
            || !fragment
        ) {
            return state;
        }

        const ignoreEvent = state.renderState.activeAncillary != null;
        gFragmentCode.clearAncillaryActive(state);

        if (ignoreEvent === true) {

            return gStateCode.cloneState(state);
        }

        gStateCode.setDirty(state);
        gFragmentCode.resetFragmentUis(state);
        fragment.ui.fragmentOptionsExpanded = false;
        state.renderState.ui.optionsExpanded = false;

        hideOptionsFromPaint(
            fragment,
            false
        );

        return gStateCode.cloneState(state);
    },

    showOptionNode: (
        state: IState,
        payload: IFragmentPayload
    ): IStateAnyArray => {

        if (!state
            || !payload?.parentFragment
            || !payload?.option
        ) {
            return state;
        }

        const ignoreEvent = state.renderState.activeAncillary != null;
        gFragmentCode.clearAncillaryActive(state);

        if (ignoreEvent === true) {

            return gStateCode.cloneState(state);
        }

        gStateCode.setDirty(state);

        return gFragmentActions.showOptionNode(
            state,
            payload.parentFragment,
            payload.option
        );
    },

    toggleAncillaryNode: (
        state: IState,
        payload: IFragmentPayload
    ): IStateAnyArray => {

        if (!state) {

            return state;
        }

        const ancillary = payload.option;

        gFragmentCode.setAncillaryActive(
            state,
            ancillary
        );

        if (ancillary) {

            gStateCode.setDirty(state);

            if (!ancillary.ui.ancillaryExpanded) {

                ancillary.ui.ancillaryExpanded = true;

                return gFragmentActions.showAncillaryNode(
                    state,
                    ancillary
                );
            }

            ancillary.ui.ancillaryExpanded = false;
        }

        return gStateCode.cloneState(state);
    }
};

export default fragmentActions;
