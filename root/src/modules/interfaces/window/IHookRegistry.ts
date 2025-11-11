import IState from "../state/IState";
import IRenderFragment from "../state/render/IRenderFragment";


export default interface IHookRegistry {

    registerStepHook(hook: (state: IState, step: IRenderFragment) => void): void;

    executeStepHook(
        state: IState,
        step: IRenderFragment
    ): void;
}
