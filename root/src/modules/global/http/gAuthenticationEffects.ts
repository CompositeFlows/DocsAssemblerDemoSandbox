import { gAuthenticatedHttp } from "./gAuthenticationHttp";

import { ActionType } from "../../interfaces/enums/ActionType";
import IState from "../../interfaces/state/IState";
import gAjaxHeaderCode from "./gAjaxHeaderCode";
import gAuthenticationActions from "./gAuthenticationActions";
import U from "../gUtilities";
import { IHttpFetchItem } from "../../interfaces/http/IHttpFetchItem";
import gStateCode from "../code/gStateCode";


const gAuthenticationEffects = {

    checkUserAuthenticated: (state: IState): IHttpFetchItem | undefined => {

        if (!state) {
            return;
        }

        const callID: string = U.generateGuid();

        let headers = gAjaxHeaderCode.buildHeaders(
            state,
            callID,
            ActionType.None
        );

        const url: string = `${state.settings.bffUrl}/${state.settings.userPath}?slide=false`;

        return gAuthenticatedHttp({
            url: url,
            options: {
                method: "GET",
                headers: headers
            },
            response: 'json',
            action: gAuthenticationActions.loadSuccessfulAuthentication,
            error: (state: IState, errorDetails: any) => {

                console.log(`{
                    "message": "Error trying to authenticate with the server",
                    "url": ${url},
                    "error Details": ${JSON.stringify(errorDetails)},
                    "stack": ${JSON.stringify(errorDetails.stack)},
                    "method": ${gAuthenticationEffects.checkUserAuthenticated.name},
                    "callID: ${callID}
                }`);

                alert(`{
                    "message": "Error trying to authenticate with the server",
                    "url": ${url},
                    "error Details": ${JSON.stringify(errorDetails)},
                    "stack": ${JSON.stringify(errorDetails.stack)},
                    "method": gAuthenticationEffects.checkUserAuthenticated.name,
                    "callID: ${callID},
                    "state": ${JSON.stringify(state)}
                }`);

                return gStateCode.cloneState(state);
            }
        });
    }
};

export default gAuthenticationEffects;
