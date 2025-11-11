import { gHttp } from "./gHttp";

import IHttpAuthenticatedProps from "../../interfaces/http/IHttpAuthenticatedProps";
import IHttpProps from "../../interfaces/http/IHttpProps";
import gAuthenticationActions from "./gAuthenticationActions";


export function gAuthenticatedHttp(props: IHttpProps): any {

    const httpAuthenticatedProperties: IHttpAuthenticatedProps = props as IHttpAuthenticatedProps;

    // // To register failed authentication
    // httpAuthenticatedProperties.onAuthenticationFailAction = gAuthenticationActions.clearAuthentication;

    // To register failed authentication and show login page
    httpAuthenticatedProperties.onAuthenticationFailAction = gAuthenticationActions.clearAuthenticationAndShowLogin;

    return gHttp(httpAuthenticatedProperties);
}
