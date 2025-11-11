import IState from "../src/modules/interfaces/state/IState";
import IRenderFragment from "../src/modules/interfaces/state/render/IRenderFragment";
import IHookRegistry from "../src/modules/interfaces/window/IHookRegistry";

export default class HookRegistry implements IHookRegistry {

    private stepHook: ((state: IState, step: IRenderFragment) => void) | null = null;

    public registerStepHook(hook: (state: IState, step: IRenderFragment) => void): void {

        this.stepHook = hook;
    }

    public executeStepHook(
        state: IState,
        step: IRenderFragment
    ): void {

        if (this.stepHook) {

            this.stepHook(
                state,
                step
            );
        }
    }
}
