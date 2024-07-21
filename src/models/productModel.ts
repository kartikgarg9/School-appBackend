class Product {
  id: string;
  name: string;
  price: number;
  retailer: string;
  amountInStock: number;

  constructor(
    id: string,
    name: string,
    price: number,
    retailer: string,
    amountInStock: number
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.retailer = retailer;
    this.amountInStock = amountInStock;
  }
}

export default Product;
