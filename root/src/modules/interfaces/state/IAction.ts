import IState from "./IState";
import IStateAnyArray from "./IStateAnyArray";


type IAction = (state: IState) => IStateAnyArray;

export default IAction;