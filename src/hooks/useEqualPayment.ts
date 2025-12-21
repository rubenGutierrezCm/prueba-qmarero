/**
 * useEqualPayment - Custom hook for equal payment splitting logic
 * Manages people and calculates equal amounts per person
 */
"use client";

import { useState } from "react";
import { Bill, PersonSplit } from "@/types/bill";

export const useEqualPayment = (bill: Bill) => {
  const [people, setPeople] = useState<PersonSplit[]>([]);
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  });

  const totalBill = bill.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  /**
   * Add a new person to split equally
   */
  const addPerson = (name: string, email: string) => {
    const newPerson: PersonSplit = {
      id: `P${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      items: [], // Not used in equal split, but required by type
    };
    setPeople([...people, newPerson]);
  };

  /**
   * Remove a person from the split
   */
  const removePerson = (personId: string) => {
    setPeople(people.filter((p) => p.id !== personId));
  };

  /**
   * Calculate amount per person
   */
  const amountPerPerson = people.length > 0 ? totalBill / people.length : 0;

  return {
    people,
    sessionId,
    totalBill,
    amountPerPerson,
    addPerson,
    removePerson,
  };
};
