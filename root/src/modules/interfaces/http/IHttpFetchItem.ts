import IHttpAuthenticatedProps from "./IHttpAuthenticatedProps";


export type IHttpFetchItem = 
[
    (
        dispatch: any,
        props: IHttpAuthenticatedProps
    ) => void,
    IHttpAuthenticatedProps
]
