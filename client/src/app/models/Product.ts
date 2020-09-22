export class ProductModel {

    public constructor(
        public _id?: string,
        public name?: string,
        public price?: number,
        public imagePath?: string,
        public category?: string,
        public amount?:number
    
    ) { }
}
