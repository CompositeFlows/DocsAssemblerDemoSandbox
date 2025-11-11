
import IState from "../../interfaces/state/IState";
import U from "../gUtilities";
import { ActionType } from "../../interfaces/enums/ActionType";
import gStateCode from "../code/gStateCode";
import { IHttpFetchItem } from "../../interfaces/http/IHttpFetchItem";
import { gAuthenticatedHttp } from "../http/gAuthenticationHttp";
import gAjaxHeaderCode from "../http/gAjaxHeaderCode";
import gRenderActions from "../actions/gOutlineActions";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import gFileConstants from "../gFileConstants";
import gOutlineCode from "../code/gOutlineCode";


const getGuideOutline = (
    state: IState,
    fragmentFolderUrl: string | null,
    loadDelegate: (state: IState, outlineResponse: any) => IStateAnyArray
): IHttpFetchItem | undefined => {

    if (U.isNullOrWhiteSpace(fragmentFolderUrl) === true) {
        return;
    }

    const callID: string = U.generateGuid();

    let headers = gAjaxHeaderCode.buildHeaders(
        state,
        callID,
        ActionType.GetOutline
    );

    const url: string = `${fragmentFolderUrl}/${gFileConstants.guideOutlineFilename}`;

    const loadRequested = gOutlineCode.registerOutlineUrlDownload(
        state,
        url
    );

    if (loadRequested === true) {
        return;
    }

    return gAuthenticatedHttp({
        url: url,
        options: {
            method: "GET",
            headers: headers,
        },
        response: 'json',
        action: loadDelegate,
        error: (state: IState, errorDetails: any) => {

            console.log(`{
                "message": "Error getting outline data from the server.",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${gRenderEffects.getGuideOutline.name},
                "callID: ${callID}
            }`);

            alert(`{
                "message": "Error getting outline data from the server.",
                "url": ${url},
                "error Details": ${JSON.stringify(errorDetails)},
                "stack": ${JSON.stringify(errorDetails.stack)},
                "method": ${gRenderEffects.getGuideOutline.name},
                "callID: ${callID}
            }`);

            return gStateCode.cloneState(state);
        }
    });
};

const gRenderEffects = {

    getGuideOutline: (state: IState): IHttpFetchItem | undefined => {

        if (!state) {
            return;
        }

        const fragmentFolderUrl: string = state.renderState.displayGuide?.guide.fragmentFolderUrl ?? 'null';

        const loadDelegate = (
            state: IState,
            outlineResponse: any
        ): IStateAnyArray => {

            return gRenderActions.loadGuideOutlineProperties(
                state,
                outlineResponse,
                fragmentFolderUrl
            );
        };

        return getGuideOutline(
            state,
            fragmentFolderUrl,
            loadDelegate
        );
    },

    getGuideOutlineAndLoadSegments: (state: IState): IHttpFetchItem | undefined => {

        if (!state) {
            return;
        }

        const fragmentFolderUrl: string = state.renderState.displayGuide?.guide.fragmentFolderUrl ?? 'null';

        const loadDelegate = (
            state: IState,
            outlineResponse: any
        ): IStateAnyArray => {

            return gRenderActions.loadGuideOutlineAndSegments(
                state,
                outlineResponse,
                fragmentFolderUrl
            );
        };

        return getGuideOutline(
            state,
            fragmentFolderUrl,
            loadDelegate
        );
    }
};

export default gRenderEffects;
