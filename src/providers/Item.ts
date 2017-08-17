export class Item {

  private id: number;
  private price: number;
  public quantity: number;
  public myQuantity: number;
  private name: string;

  constructor(id, p, q, n) {
    this.id = id;
    this.price = p;
    this.quantity = q;
    this.name = n;
    this.myQuantity = 0;
  }

  public setPrice(p) {
    this.price = p;
  }

  public setQuantity(q) {
    this.quantity = q;
  }

  public setMyQuantity(q) {
    this.myQuantity = q;
  }

  public setName(n) {
    this.name = n;
  }

  public getId() {
    return this.id;
  }

  public getPrice() {
    return this.price;
  }

  public getQuantity() {
    return this.quantity;
  }

  public getMyQuantity() {
    return this.myQuantity;
  }

  public getName() {
    return this.name;
  }

  public decrementQuantity() {
    if(this.quantity > 0) {
      this.quantity--;
      this.myQuantity++;
    }
  }

  public incrementQuantity() {
    if(this.myQuantity > 0) {
      this.quantity++;
      this.myQuantity--;
    }
  }
}