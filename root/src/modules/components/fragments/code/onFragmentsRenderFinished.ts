import Filters from "../../../state/constants/Filters";


const onFragmentsRenderFinished = () => {

    const fragmentBoxDiscussions: NodeListOf<Element> = document.querySelectorAll(Filters.fragmentBoxDiscussion);
    let fragmentBox: HTMLDivElement;
    let dataDiscussion: string | undefined;

    for (let i = 0; i < fragmentBoxDiscussions.length; i++) {

        fragmentBox = fragmentBoxDiscussions[i] as HTMLDivElement;
        dataDiscussion = fragmentBox.dataset.discussion;

        if (dataDiscussion != null) {

            fragmentBox.innerHTML = dataDiscussion;
            delete fragmentBox.dataset.discussion;
        }
    }
};

export default onFragmentsRenderFinished;
