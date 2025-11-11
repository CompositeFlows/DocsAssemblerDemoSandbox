import IState from "../../interfaces/state/IState";


const gAuthenticationCode = {

    clearAuthentication: (state: IState): void => {

        state.user.authorised = false;
        state.user.name = "";
        state.user.sub = "";
        state.user.logoutUrl = "";
    }
};

export default gAuthenticationCode;
