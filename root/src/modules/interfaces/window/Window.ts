import IHookRegistry from "./IHookRegistry";
import IShortTerm from "./IShortTerm";
import ITreeSolve from "./ITreeSolve";

export {};

declare global {

    interface Window {

        TreeSolve: ITreeSolve;
        ShortTerm: IShortTerm;
        HookRegistry: IHookRegistry
    }
}