import IState from "../../../interfaces/state/IState";
import repeatSubscriptions from "../../../subscriptions/repeatSubscription";


const initSubscriptions = (state: IState) => {

    if (!state) {
        return;
    }

    const subscriptions: any[] = [

        ...repeatSubscriptions.buildRepeatSubscriptions(state)
    ];

    return subscriptions;
};

export default initSubscriptions;

