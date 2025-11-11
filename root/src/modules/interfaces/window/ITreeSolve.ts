import IScreen from "./IScreen";


export default interface ITreeSolve {
    // this can be accessed both from the hyperApp code and the html

    renderingComment: string | null;
    screen: IScreen;
}
