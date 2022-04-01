interface ItemReport {
  path: string;
  reason: string;
  comment: string;
}

export class Report {
  items: ItemReport[] = [];

  addItem(item: ItemReport) {
    this.items.push(item);
  }

  hasItems() {
    return this.items.length > 0;
  }

  print() {
    console.table(this.items);
  }
}
