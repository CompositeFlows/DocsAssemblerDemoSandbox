import IRenderGuide from "../../interfaces/state/render/IRenderGuide";


export default class RenderGuide implements IRenderGuide {

    constructor(id: string) {

        this.id = id;
    }

    public id: string;
    public title: string = '';
    public description: string = '';
    public path: string = '';
    public fragmentFolderUrl: string | null = null;
}
