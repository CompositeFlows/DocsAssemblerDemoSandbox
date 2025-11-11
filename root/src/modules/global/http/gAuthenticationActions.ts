import { IHttpFetchItem } from "../../interfaces/http/IHttpFetchItem";
import Keys from "../../interfaces/state/constants/Keys";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import gStateCode from "../code/gStateCode";
import gAuthenticationCode from "./gAuthenticationCode";
import gAuthenticationEffects from "./gAuthenticationEffects";


const gAuthenticationActions = {

    loadSuccessfulAuthentication: (
        state: IState,
        response: any): IStateAnyArray => {

        if (!state
            || !response
            || response.parseType !== "json"
            || !response.jsonData) {

            return state;
        }

        const claims: any = response.jsonData;

        const name: any = claims.find(
            (claim: any) => claim.type === 'name'
        );

        const sub: any = claims.find(
            (claim: any) => claim.type === 'sub'
        );

        if (!name
            && !sub) {

            return state;
        }

        const logoutUrlClaim: any = claims.find(
            (claim: any) => claim.type === 'bff:logout_url'
        );

        if (!logoutUrlClaim
            || !logoutUrlClaim.value) {

            return state;
        }

        state.user.authorised = true;
        state.user.name = name.value;
        state.user.sub = sub.value;
        state.user.logoutUrl = logoutUrlClaim.value;

        return gStateCode.cloneState(state);
    },

    checkUserLoggedIn: (state: IState): IStateAnyArray => {

        const props: IHttpFetchItem | undefined = gAuthenticationActions.checkUserLoggedInProps(state);

        if (!props) {

            return state;
        }

        return [
            state,
            props
        ];
    },

    checkUserLoggedInProps: (state: IState): IHttpFetchItem | undefined => {

        state.user.raw = false;

        return gAuthenticationEffects.checkUserAuthenticated(state);
    },

    login: (state: IState): IStateAnyArray => {

        const currentUrl = window.location.href;

        sessionStorage.setItem(
            Keys.startUrl,
            currentUrl
        );

        const url: string = `${state.settings.bffUrl}/${state.settings.defaultLoginPath}?returnUrl=/`;
        window.location.assign(url);

        return state;
    },

    clearAuthentication: (state: IState): IStateAnyArray => {
        gAuthenticationCode.clearAuthentication(state);

        return gStateCode.cloneState(state);
    },

    clearAuthenticationAndShowLogin: (state: IState): IStateAnyArray => {

        gAuthenticationCode.clearAuthentication(state);

        return gAuthenticationActions.login(state);
    },

    logout: (state: IState): IStateAnyArray => {

        window.location.assign(state.user.logoutUrl);

        return state;
    }
};

export default gAuthenticationActions;
