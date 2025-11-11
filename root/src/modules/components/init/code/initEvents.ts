import onRenderFinished from "./onRenderFinished";


const initEvents = {

  onRenderFinished: () => {

    onRenderFinished();
  },

  registerGlobalEvents: () => {

    window.onresize = () => {

      initEvents.onRenderFinished();
    };
  }
}

export default initEvents;



