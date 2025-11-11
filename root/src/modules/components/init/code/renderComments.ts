import Filters from "../../../state/constants/Filters";
import TreeSolve from "../../../state/window/TreeSolve";


const renderComments = {

    registerGuideComment: () => {

        const treeSolveGuide: HTMLDivElement = document.getElementById(Filters.treeSolveGuideID) as HTMLDivElement;

        if (treeSolveGuide
            && treeSolveGuide.hasChildNodes() === true
        ) {
            let childNode: ChildNode;

            for (let i = 0; i < treeSolveGuide.childNodes.length; i++) {

                childNode = treeSolveGuide.childNodes[i];

                if (childNode.nodeType === Node.COMMENT_NODE) {

                    if (!window.TreeSolve) {

                        window.TreeSolve = new TreeSolve();
                    }

                    window.TreeSolve.renderingComment = childNode.textContent;
                    childNode.remove();

                    break;
                }
                else if (childNode.nodeType !== Node.TEXT_NODE) {
                    break;
                }
            }
        }
    }
}

export default renderComments;
