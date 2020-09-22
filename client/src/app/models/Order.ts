export class OrderModel {
    public constructor(
        public _id : string,
        public  client : string,
        public cart : string,
        public totalPrice : number,
        public city : string,
        public street : string,
        public dateOfDelivery : string,
        public creditCardLastDigits : number,
        public createdAt : Date
    ) { }
  }
  