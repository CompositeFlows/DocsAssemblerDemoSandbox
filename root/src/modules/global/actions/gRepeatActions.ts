
import { gAuthenticatedHttp } from "../http/gAuthenticationHttp";

import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import IHttpEffect from "../../interfaces/state/effects/IHttpEffect";
import gStateCode from "../code/gStateCode";
import gAjaxHeaderCode from "../http/gAjaxHeaderCode";
import { ActionType } from "../../interfaces/enums/ActionType";
import U from "../gUtilities";
import IAction from "../../interfaces/state/IAction";

const runActionInner = (
    dispatch: any,
    props: any): void => {

    dispatch(
        props.action,
    );
};


const runAction = (
    state: IState,
    queuedEffects: Array<IAction>
): IStateAnyArray => {

    const effects: any[] = [];

    queuedEffects.forEach((action: IAction) => {

        const props = {
            action: action,
            error: (_state: IState, errorDetails: any) => {

                console.log(`{
                    "message": "Error running action in repeatActions",
                    "error Details": ${JSON.stringify(errorDetails)},
                    "stack": ${JSON.stringify(errorDetails.stack)},
                    "method": ${runAction},
                }`);

                alert("Error running action in repeatActions");
            }
        };


        effects.push([
            runActionInner,
            props
        ]);
    });

    return [

        gStateCode.cloneState(state),
        ...effects
    ];
};

const sendRequest = (
    state: IState,
    queuedEffects: Array<IHttpEffect>
): IStateAnyArray => {

    const effects: any[] = [];

    queuedEffects.forEach((httpEffect: IHttpEffect) => {

        getEffect(
            state,
            httpEffect,
            effects,
        );
    });

    return [

        gStateCode.cloneState(state),
        ...effects
    ];
};

const getEffect = (
    state: IState,
    httpEffect: IHttpEffect,
    effects: Array<IHttpEffect>
): void => {

    const url: string = httpEffect.url;
    const callID: string = U.generateGuid();

    let headers = gAjaxHeaderCode.buildHeaders(
        state,
        callID,
        ActionType.GetStep
    );

    const effect = gAuthenticatedHttp({
        url: url,
        parseType: httpEffect.parseType,
        options: {
            method: "GET",
            headers: headers
        },
        response: 'json',
        action: httpEffect.actionDelegate,
        error: (_state: IState, errorDetails: any) => {

            console.log(`{
                    "message": "Error posting gRepeatActions data to the server",
                    "url": ${url},
                    "error Details": ${JSON.stringify(errorDetails)},
                    "stack": ${JSON.stringify(errorDetails.stack)},
                    "method": ${getEffect.name},
                    "callID: ${callID}
                }`);

            alert("Error posting gRepeatActions data to the server");
        }
    });

    effects.push(effect);
};

const gRepeatActions = {

    httpSilentReLoadImmediate: (state: IState): IStateAnyArray => {

        if (!state) {

            return state;
        }

        if (state.repeatEffects.reLoadGetHttpImmediate.length === 0) {
            // Must return altered state for the subscription not to get removed
            // return stateCode.cloneState(state);
            return state;
        }

        const reLoadHttpEffectsImmediate: Array<IHttpEffect> = state.repeatEffects.reLoadGetHttpImmediate;
        state.repeatEffects.reLoadGetHttpImmediate = [];

        return sendRequest(
            state,
            reLoadHttpEffectsImmediate
        );
    },

    silentRunActionImmediate: (state: IState): IStateAnyArray => {

        if (!state) {

            return state;
        }

        if (state.repeatEffects.runActionImmediate.length === 0) {
            // Must return altered state for the subscription not to get removed
            // return stateCode.cloneState(state);
            return state;
        }

        const runActionImmediate: Array<IAction> = state.repeatEffects.runActionImmediate;
        state.repeatEffects.runActionImmediate = [];

        return runAction(
            state,
            runActionImmediate
        );
    }
};

export default gRepeatActions;

