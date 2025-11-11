

export default interface IRenderSnapShot {

    url: string;
    guid: string | null;
    created: Date | null;
    modified: Date | null;
    expandedOptionIDs: Array<string>;
    expandedAncillaryIDs: Array<string>;
}

