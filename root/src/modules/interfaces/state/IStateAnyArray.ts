import IState from "./IState";


type IStateAnyArray = IState | [IState, ...any[]];

export default IStateAnyArray;