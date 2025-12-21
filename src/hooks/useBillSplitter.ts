/**
 * useBillSplitter - Custom hook to manage bill splitting logic
 * Handles people management, product assignment, and calculations
 */
"use client";

import { useState } from "react";
import { Bill, PersonSplit } from "@/types/bill";

export const useBillSplitter = (bill: Bill) => {
  const [people, setPeople] = useState<PersonSplit[]>([]);
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  /**
   * Add a new person to the split
   */
  const addPerson = (name: string, email: string) => {
    const newPerson: PersonSplit = {
      id: `P${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      items: [],
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
   * Remove an item from a specific person
   */
  const removeItemFromPerson = (personId: string, itemId: string) => {
    setPeople(
      people.map((person) => {
        if (person.id === personId) {
          return {
            ...person,
            items: person.items.filter((i) => i.itemId !== itemId),
          };
        }
        return person;
      })
    );
  };

  /**
   * Assign products to people with specified quantities
   */
  const assignProducts = (
    itemId: string,
    quantities: Record<string, number | string>
  ) => {
    setPeople(
      people.map((person) => {
        const quantity = typeof quantities[person.id] === 'number' 
          ? quantities[person.id] as number
          : 0;
        
        const existingItemIndex = person.items.findIndex(
          (i) => i.itemId === itemId
        );
        
        if (quantity === 0) {
          // Remove item if quantity is 0
          if (existingItemIndex >= 0) {
            return {
              ...person,
              items: person.items.filter((i) => i.itemId !== itemId),
            };
          }
          return person;
        } else {
          // Update or add item if quantity > 0
          if (existingItemIndex >= 0) {
            const updatedItems = [...person.items];
            updatedItems[existingItemIndex].quantity = quantity;
            return { ...person, items: updatedItems };
          } else {
            return {
              ...person,
              items: [
                ...person.items,
                { itemId, quantity },
              ],
            };
          }
        }
      })
    );
  };

  /**
   * Calculate total amount for a specific person
   */
  const calculatePersonTotal = (person: PersonSplit): number => {
    return person.items.reduce((sum, item) => {
      const billItem = bill.items.find((bi) => bi.id === item.itemId);
      if (billItem) {
        return sum + billItem.unitPrice * item.quantity;
      }
      return sum;
    }, 0);
  };

  /**
   * Get how many units of an item have been assigned
   */
  const getItemAssignedQty = (itemId: string): number => {
    return people.reduce((sum, person) => {
      const personItem = person.items.find((i) => i.itemId === itemId);
      return sum + (personItem?.quantity || 0);
    }, 0);
  };

  /**
   * Get total amount that has been assigned across all people
   */
  const getTotalAssigned = (): number => {
    return people.reduce(
      (sum, person) => sum + calculatePersonTotal(person),
      0
    );
  };

  /**
   * Get total bill amount
   */
  const totalBill = bill.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  /**
   * Get existing quantities for a product to pre-populate assignment dialog
   */
  const getExistingQuantities = (itemId: string): Record<string, number | string> => {
    const existingQuantities: Record<string, number | string> = {};
    people.forEach((person) => {
      const personItem = person.items.find((i) => i.itemId === itemId);
      existingQuantities[person.id] = personItem?.quantity || '';
    });
    return existingQuantities;
  };

  return {
    people,
    sessionId,
    totalBill,
    addPerson,
    removePerson,
    removeItemFromPerson,
    assignProducts,
    calculatePersonTotal,
    getItemAssignedQty,
    getTotalAssigned,
    getExistingQuantities,
  };
};
