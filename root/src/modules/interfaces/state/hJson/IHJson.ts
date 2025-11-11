

export default interface IHJson<Attributes = {}> {

    name: string;
    attributes?: Attributes;
    children: Array<IHJson | string>
}
