
import { SheetCollection } from './types';

// The app starts with no data. Users must upload their own files.
export const INITIAL_DATA: { [key: string]: SheetCollection } = {
  'ATTENDANCE': {},
  'Inventory-Tracking': {},
  'Customer-Purchase-History': {},
  'Retail-Store-Transactions': {},
  'Online-Store-Orders': {},
  'Product-Sales-Region': {}
};
