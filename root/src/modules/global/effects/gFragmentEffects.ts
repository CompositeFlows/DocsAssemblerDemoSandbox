
import IState from "../../interfaces/state/IState";
import U from "../gUtilities";
import { ActionType } from "../../interfaces/enums/ActionType";
import gStateCode from "../code/gStateCode";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import { IHttpFetchItem } from "../../interfaces/http/IHttpFetchItem";
import { gAuthenticatedHttp } from "../http/gAuthenticationHttp";
import gAjaxHeaderCode from "../http/gAjaxHeaderCode";
import gFragmentActions from "../actions/gFragmentActions";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";


const getFragment = (
    state: IState,
    fragmentID: string,
    fragmentPath: string,
    action: ActionType,
    loadAction: (state: IState, response: any) => IStateAnyArray): IHttpFetchItem | undefined => {

    if (!state) {
        return;
    }

    const callID: string = U.generateGuid();

    let headers = gAjaxHeaderCode.buildHeaders(
        state,
        callID,
        action
    );

    const url: string = `${fragmentPath}`;

    return gAuthenticatedHttp({
        url: url,
        parseType: "text",
        options: {
            method: "GET",
            headers: headers,
        },
        response: 'text',
        action: loadAction,
        error: (state: IState, errorDetails: any) => {

            console.log(`{
                "message": "Error getting fragment from the server, path: ${fragmentPath}, id: ${fragmentID}",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${getFragment},
                "callID: ${callID}
            }`);

            alert(`{
                "message": "Error getting fragment from the server, path: ${fragmentPath}, id: ${fragmentID}",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${getFragment.name},
                "callID: ${callID}
            }`);

            return gStateCode.cloneState(state);
        }
    });
}

const gFragmentEffects = {

    getFragment: (
        state: IState,
        option: IRenderFragment,
        fragmentPath: string
    ): IHttpFetchItem | undefined => {

        const loadAction: (state: IState, response: any) => IState = (state: IState, response: any) => {

            const newState = gFragmentActions.loadFragment(
                state,
                response,
                option
            );

            newState.renderState.refreshUrl = true;

            return newState;
        };

        return getFragment(
            state,
            option.id,
            fragmentPath,
            ActionType.GetFragment,
            loadAction
        );
    }
};

export default gFragmentEffects;
