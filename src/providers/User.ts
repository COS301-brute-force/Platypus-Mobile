export class User {

  public id: number;
  public nickname: number;
  public color: number;

  constructor(n, c, id) {
    this.nickname = n;
    this.color = c;
    this.id = id;
  }

  public setNickname(n) {
    this.nickname = n;
  }

  public setColor(c) {
    this.color = c;
  }

  public getId() {
    return this.id;
  }

  public getNickname() {
    return this.nickname;
  }

  public getColor() {
    return this.color;
  }

}
