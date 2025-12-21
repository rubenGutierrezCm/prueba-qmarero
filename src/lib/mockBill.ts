import { Bill } from "@/types/bill";

export const MOCK_BILL: Bill = {
  table: {
    id: "MESA-18",
    name: "Terraza Norte",
    server: "Lucía",
  },
  currency: "EUR",
  items: [
    {
      id: "I1",
      name: "Entrante - Pan con tomate",
      qty: 2,
      unitPrice: 4.0,
      notes: "Compartido para la mesa",
    },
  ],
};

export const getTotalBill = () => {
    return MOCK_BILL.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
}