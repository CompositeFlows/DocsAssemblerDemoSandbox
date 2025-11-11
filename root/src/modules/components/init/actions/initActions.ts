import IState from "../../../interfaces/state/IState";


const initActions = {

    setNotRaw: (state: IState): IState => {

        if (!window?.TreeSolve?.screen?.isAutofocusFirstRun) {

            window.TreeSolve.screen.autofocus = false;
        }
        else {
            window.TreeSolve.screen.isAutofocusFirstRun = false;
        }

        return state;
    }
};

export default initActions;
