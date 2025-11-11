import { Children, VNode } from "hyper-app-local";
import { h } from "../../../../hyperApp/hyper-app-local";

import IState from "../../../interfaces/state/IState";
import fragmentViews from "./fragmentViews";
// import gDebuggerCode from "../../../global/code/gDebuggerCode";

import "../scss/fragments.scss";


const guideViews = {

    buildContentView: (state: IState): VNode => {

        const innerViews: Children[] = [];

        fragmentViews.buildView(
            state.renderState.displayGuide?.root,
            innerViews
        )

        // gDebuggerCode.logRoot(state);

        const view: VNode =

            h("div",
                {
                    id: "nt_fr_Fragments"
                },

                innerViews
            );

        return view;
    }
};

export default guideViews;


