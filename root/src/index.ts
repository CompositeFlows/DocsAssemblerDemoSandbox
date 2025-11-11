import { app } from "./hyperApp/hyper-app-local";

import initSubscriptions from "./modules/components/init/subscriptions/initSubscriptions";
import initEvents from "./modules/components/init/code/initEvents";
import initView from "./modules/components/init/views/initView";
import initState from "./modules/components/init/code/initState";
import renderComments from "./modules/components/init/code/renderComments";


initEvents.registerGlobalEvents();
renderComments.registerGuideComment();

(window as any).CompositeFlowsAuthor = app({
    
    node: document.getElementById("treeSolveFragments"),
    init: initState.initialise,
    view: initView.buildView,
    subscriptions: initSubscriptions,
    onEnd: initEvents.onRenderFinished
});


