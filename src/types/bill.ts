/**
 * Types for bill splitting application
 * Defines the structure of bills, items, and person splits
 */

/**
 * Represents a single item in a bill
 */
export interface BillItem {
  /** Unique identifier for the item */
  id: string;
  /** Name/description of the item */
  name: string;
  /** Quantity of the item */
  qty: number;
  /** Unit price of the item */
  unitPrice: number;
  /** Optional notes about the item */
  notes?: string;
}

/**
 * Represents a complete bill/check
 */
export interface Bill {
  /** Table information */
  table: {
    /** Table identifier */
    id: string;
    /** Table name/number */
    name: string;
    /** Server/waiter name */
    server: string;
  };
  /** Currency code (e.g., "EUR", "USD") */
  currency: string;
  /** List of items in the bill */
  items: BillItem[];
}

/**
 * Represents a person's share in a split bill
 */
export interface PersonSplit {
  /** Unique identifier for the person */
  id: string;
  /** Person's name */
  name: string;
  /** Person's email address */
  email: string;
  /** List of items assigned to this person */
  items: {
    /** Reference to the bill item */
    itemId: string;
    /** Quantity assigned to this person */
    quantity: number;
  }[];
}
