import IState from "../state/IState";
import IStateAnyArray from "../state/IStateAnyArray";
import IHttpProps from "./IHttpProps";


export default interface IHttpAuthenticatedProps extends IHttpProps {
    
    onAuthenticationFailAction: (state: IState, response: any) => IStateAnyArray,
}
