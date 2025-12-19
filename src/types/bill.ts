export interface BillItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  notes?: string;
}

export interface Bill {
  table: {
    id: string;
    name: string;
    server: string;
  };
  currency: string;
  items: BillItem[];
}

export interface PersonSplit {
  id: string;
  name: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
}
