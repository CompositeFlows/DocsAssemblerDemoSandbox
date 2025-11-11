
import IHttpAuthenticatedProps from "../../interfaces/http/IHttpAuthenticatedProps";
import IHttpAuthenticatedPropsBlock from "../../interfaces/http/IHttpAuthenticatedPropsBlock";
import { IHttpFetchItem } from "../../interfaces/http/IHttpFetchItem";
import IHttpOutput from "../../interfaces/http/IHttpOutput";
import { IHttpSequentialFetchItem } from "../../interfaces/http/IHttpSequentialFetchItem";

const sequentialHttpEffect = (
    dispatch: any,
    sequentialBlocks: Array<IHttpAuthenticatedPropsBlock>): void => {

    // Each IHttpAuthenticatedPropsBlock will run sequentially
    // Each IHttpAuthenticatedProps in each block will runn in parallel
    let block: IHttpAuthenticatedPropsBlock;
    let success: boolean = true;
    let httpCall: any;
    let lastHttpCall: any;

    for (let i = sequentialBlocks.length - 1; i >= 0; i--) {

        block = sequentialBlocks[i];

        if (block == null) {
            continue;
        }

        if (Array.isArray(block)) {

            httpCall = {
                delegate: processBlock,
                dispatch: dispatch,
                block: block,
                index: `${i}`
            }
        }
        else {
            httpCall = {
                delegate: processProps,
                dispatch: dispatch,
                block: block,
                index: `${i}`
            }
        }

        if (!success) {
            return;
        }

        if (lastHttpCall) {

            httpCall.nextHttpCall = lastHttpCall;
            httpCall.nextIndex = lastHttpCall.index;
            httpCall.nextBlock = lastHttpCall.block;
        }

        lastHttpCall = httpCall;
    }

    if (httpCall) {

        httpCall.delegate(
            httpCall.dispatch,
            httpCall.block,
            httpCall.nextHttpCall,
            httpCall.index
        );
    }
}

const processBlock = (
    dispatch: any,
    block: IHttpAuthenticatedPropsBlock,
    nextDelegate: any): void => {

    let parallelProps: Array<IHttpAuthenticatedProps> = block as Array<IHttpAuthenticatedProps>;
    const delegates: any[] = [];
    let props: IHttpAuthenticatedProps;

    for (let j = 0; j < parallelProps.length; j++) {

        props = parallelProps[j];

        delegates.push(
            processProps(
                dispatch,
                props,
                nextDelegate,
            )
        );

        Promise
            .all(delegates)
            .then()
            .catch();
    }
};

const processProps = (
    dispatch: any,
    props: IHttpAuthenticatedProps,
    nextDelegate: any): void => {

    if (!props) {
        return;
    }

    const output: IHttpOutput = {
        ok: false,
        url: props.url,
        authenticationFail: false,
        parseType: "text",
    };

    http(
        dispatch,
        props,
        output,
        nextDelegate
    );
};

const httpEffect = (
    dispatch: any,
    props: IHttpAuthenticatedProps
): void => {

    if (!props) {
        return;
    }

    const output: IHttpOutput = {
        ok: false,
        url: props.url,
        authenticationFail: false,
        parseType: props.parseType ?? 'json',
    };

    http(
        dispatch,
        props,
        output
    );
};

const http = (
    dispatch: any,
    props: IHttpAuthenticatedProps,
    output: IHttpOutput,
    nextDelegate: any = null): void => {

    fetch(
        props.url,
        props.options)
        .then(function (response) {

            if (response) {

                output.ok = response.ok === true;
                output.status = response.status;
                output.type = response.type;
                output.redirected = response.redirected;

                if (response.headers) {

                    output.callID = response.headers.get("CallID") as string;
                    output.contentType = response.headers.get("content-type") as string;

                    if (output.contentType
                        && output.contentType.indexOf("application/json") !== -1) {

                        output.parseType = "json";
                    }
                }

                if (response.status === 401) {

                    output.authenticationFail = true;

                    dispatch(
                        props.onAuthenticationFailAction,
                        output
                    );

                    return;
                }
            }
            else {
                output.responseNull = true;
            }

            return response;
        })
        .then(function (response: any) {

            try {
                return response.text();
            }
            catch (error) {
                output.error += `Error thrown with response.text()
`;
            }
        })
        .then(function (result) {

            output.textData = result;

            if (result
                && output.parseType === 'json'
            ) {
                try {

                    output.jsonData = JSON.parse(result);
                }
                catch (err) {
                    output.error += `Error thrown parsing response.text() as json
`;
                }
            }

            if (!output.ok) {

                throw result;
            }

            dispatch(
                props.action,
                output
            );
        })
        .then(function () {

            if (nextDelegate) {

                return nextDelegate.delegate(
                    nextDelegate.dispatch,
                    nextDelegate.block,
                    nextDelegate.nextHttpCall,
                    nextDelegate.index
                );
            }
        })
        .catch(function (error) {

            output.error += error;

            dispatch(
                props.error,
                output
            );
        })
};

export const gHttp = (props: IHttpAuthenticatedProps): IHttpFetchItem => {

    return [
        httpEffect,
        props
    ]
}

export const gSequentialHttp = (propsBlock: Array<IHttpAuthenticatedPropsBlock>): IHttpSequentialFetchItem => {

    return [
        sequentialHttpEffect,
        propsBlock
    ]
}
