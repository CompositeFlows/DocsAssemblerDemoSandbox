import IState from "../../interfaces/state/IState";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";


const gHookRegistryCode = {

    executeStepHook: (
        state: IState,
        step: IRenderFragment,
    ): void => {

        if (!window.HookRegistry) {
            return;
        }

        window.HookRegistry.executeStepHook(
            state,
            step
        );
    }
};

export default gHookRegistryCode;

