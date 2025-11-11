import IRenderOutlineNode from "./IRenderOutlineNode";


export default interface IRenderOutlineLink {
    
    c: number; // index from outline chart array
    p: Array<IRenderOutlineNode>; // plugs
}

