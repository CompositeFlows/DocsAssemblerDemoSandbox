import Player from "@vimeo/player";

import onFragmentsRenderFinished from "../../fragments/code/onFragmentsRenderFinished";


const setUpVimeoPlayer = () => {

    // If you want to control the embeds, you'll need to create a Player object.
    // You can pass either the `<div>` or the `<iframe>` created inside the div.

    const vimeoPlayerDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.nt-tp-vimeo-player') as NodeListOf<HTMLDivElement>;

    if (!vimeoPlayerDivs) {
        return;
    }

    let vimeoPlayerDiv: HTMLDivElement;

    for (let i = 0; i < vimeoPlayerDivs.length; i++) {

        vimeoPlayerDiv = vimeoPlayerDivs[i];

        var options = {
            autopause: false,
            autoplay: false,
            width: 640,
            loop: false,
            responsive: true
        };

        new Player(
            vimeoPlayerDiv,
            options
        );
    }
};

const onRenderFinished = () => {

    onFragmentsRenderFinished();
    setUpVimeoPlayer();
};

export default onRenderFinished;
