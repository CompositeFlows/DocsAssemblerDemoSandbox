import IHttpAuthenticatedPropsBlock from "./IHttpAuthenticatedPropsBlock";


export type IHttpSequentialFetchItem = 
[
    (
        dispatch: any,
        propsBlock: Array<IHttpAuthenticatedPropsBlock>
    ) => void,
    Array<IHttpAuthenticatedPropsBlock>
]
