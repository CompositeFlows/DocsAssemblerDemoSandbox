import IScreen from "../../interfaces/window/IScreen";
import ITreeSolve from "../../interfaces/window/ITreeSolve";
import Screen from "./Screen";


export default class TreeSolve implements ITreeSolve {

    public renderingComment: string | null = null;
    public screen: IScreen = new Screen();
}
