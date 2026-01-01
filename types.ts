
export type ModuleType = 'ATTENDANCE' | 'SALES';

export type SalesSection = 
  | 'Inventory-Tracking' 
  | 'Customer-Purchase-History' 
  | 'Retail-Store-Transactions' 
  | 'Online-Store-Orders' 
  | 'Product-Sales-Region';

export interface DataRecord {
  [key: string]: any;
}

export interface SheetCollection {
  [sheetName: string]: DataRecord[];
}

export interface AppState {
  activeModule: ModuleType;
  activeSalesSection: SalesSection;
  selectedSheets: string[];
}
