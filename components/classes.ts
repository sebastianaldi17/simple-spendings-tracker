export class Spending {
  id: string = "";
  amount: number = 0;
  description: string = "";
  date: string = "";
  timestamp: number = 0;
  shared: boolean = false;
}

export class SpendingSection {
  title: string = "";
  data: Spending[] = [];
}
