import { ParseType } from "../../interfaces/enums/ParseType";
import IAction from "../../interfaces/state/IAction";
import IState from "../../interfaces/state/IState";
import IStateAnyArray from "../../interfaces/state/IStateAnyArray";
import IHttpEffect from "../../interfaces/state/effects/IHttpEffect";
import IRenderFragment from "../../interfaces/state/render/IRenderFragment";
import IRenderOutlineNode from "../../interfaces/state/render/IRenderOutlineNode";
import HttpEffect from "../../state/effects/HttpEffect";
import U from "../gUtilities";
import gHistoryCode from "./gHistoryCode";

let count = 0;

const gStateCode = {

    setDirty: (state: IState): void => {

        state.renderState.ui.raw = false;
        state.renderState.isChainLoad = false;
    },

    getFreshKeyInt: (state: IState): number => {

        const nextKey = ++state.nextKey;

        return nextKey;
    },

    getFreshKey: (state: IState): string => {

        return `${gStateCode.getFreshKeyInt(state)}`;
    },

    getGuidKey: (): string => {

        return U.generateGuid();
    },

    cloneState: (state: IState): IState => {

        if (state.renderState.refreshUrl === true) {

            gHistoryCode.pushBrowserHistoryState(state);
        }

        let newState: IState = { ...state };

        return newState;
    },

    AddReLoadDataEffectImmediate: (
        state: IState,
        name: string,
        parseType: ParseType,
        url: string,
        actionDelegate: (state: IState, response: any) => IStateAnyArray
    ): void => {

        console.log(name);
        console.log(url);

        if (count > 0) {
            return;
        }

        if (url.endsWith('imyo6C08H.html')) {
            count++;
        }

        const effect: IHttpEffect | undefined = state
            .repeatEffects
            .reLoadGetHttpImmediate
            .find((effect: IHttpEffect) => {

                return effect.name === name
                    && effect.url === url;
            });

        if (effect) { // already added.
            return;
        }

        const httpEffect: IHttpEffect = new HttpEffect(
            name,
            url,
            parseType,
            actionDelegate
        );

        state.repeatEffects.reLoadGetHttpImmediate.push(httpEffect);
    },

    AddRunActionImmediate: (
        state: IState,
        actionDelegate: IAction): void => {

        state.repeatEffects.runActionImmediate.push(actionDelegate);
    },

    getCached_outlineNode: (
        state: IState,
        linkID: number,
        fragmentID: string | null | undefined
    ): IRenderOutlineNode | null => {

        if (U.isNullOrWhiteSpace(fragmentID)) {

            return null;
        }

        const key = gStateCode.getCacheKey(
            linkID,
            fragmentID as string
        );

        const outlineNode = state.renderState.index_outlineNodes_id[key] ?? null;

        if (!outlineNode) {

            console.log("OutlineNode was null");
        }

        return outlineNode;
    },

    cache_outlineNode: (
        state: IState,
        linkID: number,
        outlineNode: IRenderOutlineNode | null
    ): void => {

        if (!outlineNode) {
            return;
        }

        const key = gStateCode.getCacheKey(
            linkID,
            outlineNode.i
        );

        if (state.renderState.index_outlineNodes_id[key]) {
            return;
        }

        state.renderState.index_outlineNodes_id[key] = outlineNode;
    },

    getCached_chainFragment: (
        state: IState,
        linkID: number,
        fragmentID: string | null | undefined
    ): IRenderFragment | null => {

        if (U.isNullOrWhiteSpace(fragmentID) === true) {

            return null;
        }

        const key = gStateCode.getCacheKey(
            linkID,
            fragmentID as string
        );

        return state.renderState.index_chainFragments_id[key] ?? null;
    },

    cache_chainFragment: (
        state: IState,
        renderFragment: IRenderFragment | null
    ): void => {

        if (!renderFragment) {
            return;
        }

        const key = gStateCode.getCacheKeyFromFragment(renderFragment);

        if (U.isNullOrWhiteSpace(key) === true) {
            return;
        }

        if (state.renderState.index_chainFragments_id[key as string]) {
            return;
        }

        state.renderState.index_chainFragments_id[key as string] = renderFragment;
    },

    getCacheKeyFromFragment: (renderFragment: IRenderFragment): string | null => {

        return gStateCode.getCacheKey(
            renderFragment.section.linkID,
            renderFragment.id
        );
    },

    getCacheKey: (

        linkID: number,
        fragmentID: string
    ): string => {

        return `${linkID}_${fragmentID}`;
    },
};

export default gStateCode;

