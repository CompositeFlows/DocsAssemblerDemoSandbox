import IState from "../../interfaces/state/IState";


const gBlankAction = {

    simpleAction : (state: IState): IState => {

        return state;
    },

    responseAction : (
        state: IState,
        _response: any): IState => {

        return state;
    }
}

export default gBlankAction;

