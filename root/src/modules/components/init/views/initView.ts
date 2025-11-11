import { VNode } from "hyper-app-local";
import { h } from "../../../../hyperApp/hyper-app-local";

import IState from "../../../interfaces/state/IState";
import initActions from "../actions/initActions";
import guideViews from "../../fragments/views/guideViews";


const initView = {

    buildView: (state: IState): VNode => {

        const view: VNode =

            h("div",
                {
                    onClick: initActions.setNotRaw,
                    id: "treeSolveFragments"
                },
                [
                    guideViews.buildContentView(state),
                ]
            );

        return view;
    }
}

export default initView;

