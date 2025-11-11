import { interval } from "../../hyperApp/time";

import gRepeatActions from "../global/actions/gRepeatActions";
import IState from "../interfaces/state/IState";


const repeatSubscriptions = {

    buildRepeatSubscriptions: (state: IState) => {

        const buildReLoadDataImmediate = (): any => {

            if (state.repeatEffects.reLoadGetHttpImmediate.length > 0) {

                return interval(
                    gRepeatActions.httpSilentReLoadImmediate,
                    { delay: 10 }
                );
            }
        };

        const buildRunActionsImmediate = (): any => {

            if (state.repeatEffects.runActionImmediate.length > 0) {

                return interval(
                    gRepeatActions.silentRunActionImmediate,
                    { delay: 10 }
                );
            }
        };

        const repeatSubscription: any[] = [

            buildReLoadDataImmediate(),
            buildRunActionsImmediate()
        ];

        return repeatSubscription;
    }
};

export default repeatSubscriptions;

