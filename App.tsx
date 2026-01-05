import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { INITIAL_DATA } from './mockData';
import { DataRecord, ModuleType, SalesSection, SheetCollection } from './types';
import SummaryCard from './components/SummaryCard';

const Icons = {
  Attendance: <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Sales: <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Folder: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  Search: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Upload: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  AI: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Google: <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C9.03 19.27 6.13 17.68 6.13 12C6.13 6.32 9.03 4.73 12.19 4.73C14.16 4.73 15.9 5.42 17.16 6.45L19.1 4.5C17.24 2.77 14.86 1.73 12.18 1.73C6.46 1.73 2.18 6.03 2.18 12C2.18 17.97 6.46 22.27 12.18 22.27C18.46 22.27 22.46 18.06 22.46 12C22.46 11.66 22.43 11.39 21.35 11.1Z" /></svg>,
  Trash: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Filter: <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Close: <svg className="w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Logout: <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Check: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Export: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
};

const STORAGE_KEY = 'intellidata_v2_final_data';
const UI_STORAGE_KEY = 'intellidata_v2_final_ui';
const VALID_EMAIL = 'admin@intellidata.com';
const VALID_PASSWORD = 'admin123';

const SalesSections: SalesSection[] = [
  'Inventory-Tracking',
  'Customer-Purchase-History',
  'Retail-Store-Transactions',
  'Online-Store-Orders',
  'Product-Sales-Region'
];

const formatExcelDate = (serial: number): string => {
  if (isNaN(serial) || serial < 1) return String(serial);
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const normalizeDataArray = (data: any[]) => {
  return data.map((row: any) => {
    const cleanRow: any = {};
    Object.keys(row).forEach(key => {
      const normalizedKey = key.trim();
      let value = row[key];
      if (typeof value === 'string') value = value.trim();
      cleanRow[normalizedKey] = value;
    });
    return cleanRow;
  });
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [activeModule, setActiveModule] = useState<ModuleType>(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    return saved ? JSON.parse(saved).activeModule || 'ATTENDANCE' : 'ATTENDANCE';
  });
  
  const [activeSalesSection, setActiveSalesSection] = useState<SalesSection>(() => {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    return saved ? JSON.parse(saved).activeSalesSection || 'Inventory-Tracking' : 'Inventory-Tracking';
  });
  
  const [dataStore, setDataStore] = useState<{ [key: string]: SheetCollection }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_DATA;
    try {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_DATA, ...parsed };
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);

  const [filterText, setFilterText] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gsheetUrl, setGsheetUrl] = useState("");
  const [isFetchingGsheet, setIsFetchingGsheet] = useState(false);

  const [sheetSearchQuery, setSheetSearchQuery] = useState("");
  const [editingSheetKey, setEditingSheetKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = useMemo(
    () => (activeModule === 'ATTENDANCE' ? 'ATTENDANCE' : activeSalesSection),
    [activeModule, activeSalesSection]
  );

  const availableSheets = useMemo(() => Object.keys(dataStore[currentCategory] || {}), [currentCategory, dataStore]);

  const filteredSidebarSheets = useMemo(() => {
    return availableSheets.filter(s => s.toLowerCase().includes(sheetSearchQuery.toLowerCase()));
  }, [availableSheets, sheetSearchQuery]);

  useEffect(() => { 
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStore)); 
    } catch (e) {
      console.error("Storage limit exceeded", e);
    }
  }, [dataStore]);

  useEffect(() => {
    const uiData = { activeModule, activeSalesSection };
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(uiData));
  }, [activeModule, activeSalesSection]);

  useEffect(() => { localStorage.setItem('isLoggedIn', String(isLoggedIn)); }, [isLoggedIn]);

  useEffect(() => {
    setSelectedSheets([]);
    setActiveFilters({});
    setFilterText("");
    setSheetSearchQuery("");
  }, [currentCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setOpenFilterCol(null);
        setFilterSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleFilterCol = (colName: string) => {
    if (openFilterCol === colName) {
      setOpenFilterCol(null);
      setFilterSearchQuery("");
    } else {
      setOpenFilterCol(colName);
      setFilterSearchQuery(""); 
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (loginForm.email === VALID_EMAIL && loginForm.password === VALID_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setLoginForm({ email: '', password: '' });
  };

  const rawMergedData = useMemo(() => {
    const data: DataRecord[] = [];
    selectedSheets.forEach(sheet => {
      const sheetData = dataStore[currentCategory]?.[sheet];
      if (sheetData) data.push(...sheetData);
    });
    return data;
  }, [selectedSheets, currentCategory, dataStore]);

  const filteredData = useMemo(() => {
    return rawMergedData.filter(item => {
      const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(filterText.toLowerCase()));
      if (!matchesSearch) return false;
      
      return Object.keys(activeFilters).every(col => {
        const selectedValues = activeFilters[col];
        if (!selectedValues || selectedValues.length === 0) return true;
        
        let cellVal = item[col] ?? item[Object.keys(item).find(k => k.trim() === col) || ""];
        let displayVal = String(cellVal ?? "").trim();
        if (typeof cellVal === 'number' && (col.toLowerCase().includes('date') || (cellVal > 35000 && cellVal < 60000))) {
          displayVal = formatExcelDate(cellVal);
        }
        return selectedValues.includes(displayVal);
      });
    });
  }, [rawMergedData, filterText, activeFilters]);

  const headers = useMemo(() => {
    if (rawMergedData.length === 0) return [];
    const allKeys = new Set<string>();
    rawMergedData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key && key.trim()) allKeys.add(key.trim());
      });
    });
    return Array.from(allKeys);
  }, [rawMergedData]);

  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    headers.forEach(h => {
      const set = new Set<string>();
      rawMergedData.forEach(row => {
        let val = row[h] ?? row[Object.keys(row).find(k => k.trim() === h) || ""];
        if (val !== undefined && val !== null && (typeof val === 'number' || String(val).trim() !== "")) {
          if (typeof val === 'number' && (h.toLowerCase().includes('date') || (val > 35000 && val < 60000))) {
            set.add(formatExcelDate(val));
          } else {
            set.add(String(val).trim());
          }
        }
      });
      values[h] = Array.from(set).sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });
    });
    return values;
  }, [rawMergedData, headers]);

  const totals = useMemo(() => {
    const sums: Record<string, number> = {};
    if (filteredData.length === 0) return sums;
    headers.forEach(h => {
      const lowerH = h.toLowerCase();
      const isMetadata = lowerH.includes('id') || lowerH.includes('code') || lowerH.includes('zip') || lowerH.includes('phone') || lowerH.includes('year') || lowerH.includes('no') || lowerH.includes('email') || lowerH.includes('address') || lowerH.includes('name') || lowerH.includes('date') || lowerH.includes('time') || lowerH.includes('day') || lowerH.includes('month');
      if (isMetadata) return;
      const sum = filteredData.reduce((acc, row) => {
        const val = row[h];
        if (typeof val === 'number') return acc + val;
        return acc;
      }, 0);
      if (sum > 0) sums[h] = Number(sum.toFixed(2));
    });
    return sums;
  }, [filteredData, headers]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const csvHeaders = headers.join(',');
    const csvRows = filteredData.map(row => {
      return headers.map(h => {
        let val = row[h] ?? row[Object.keys(row).find(k => k.trim() === h) || ""];
        if (typeof val === 'number' && (h.toLowerCase().includes('date') || (val > 35000 && val < 60000))) {
          val = formatExcelDate(val);
        }
        let cell = String(val ?? "").replace(/"/g, '""');
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) cell = `"${cell}"`;
        return cell;
      }).join(',');
    });
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `IntelliData_Export_${currentCategory}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilterValue = (column: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[column] || [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      const updated = { ...prev };
      if (next.length === 0) delete updated[column];
      else updated[column] = next;
      return updated;
    });
  };

  const clearColumnFilters = (column: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[column];
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(isExcel ? new Uint8Array(event.target?.result as ArrayBuffer) : event.target?.result as string, { type: isExcel ? 'array' : 'string', cellDates: false });
        const newSheets: SheetCollection = {};
        const newSelected: string[] = [];

        workbook.SheetNames.forEach(sheetName => {
          const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
          const data = normalizeDataArray(rawData);
          if (data.length > 0) {
            let uniqueName = sheetName;
            let counter = 1;
            while (dataStore[currentCategory][uniqueName] || newSheets[uniqueName]) {
              uniqueName = `${sheetName} (${counter++})`;
            }
            newSheets[uniqueName] = data;
            newSelected.push(uniqueName);
          }
        });

        if (newSelected.length > 0) {
          setDataStore(prev => ({ ...prev, [currentCategory]: { ...(prev[currentCategory] || {}), ...newSheets } }));
          setSelectedSheets(prev => Array.from(new Set([...prev, ...newSelected])));
        }
      } catch (err) { alert("Parsing error."); }
    };
    if (isExcel) reader.readAsArrayBuffer(file); else reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportGoogleSheet = async () => {
    if (!gsheetUrl) return;
    setIsFetchingGsheet(true);
    try {
      let url = gsheetUrl;
      const match = gsheetUrl.match(/[-\w]{25,}/);
      if (match) url = `https://docs.google.com/spreadsheets/d/${match[0]}/export?format=xlsx`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to reach server.");
      const buffer = await res.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: false });
      const newSheetsData: Record<string, DataRecord[]> = {};
      const newSheetNames: string[] = [];

      workbook.SheetNames.forEach(name => {
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: "" });
        const data = normalizeDataArray(rawData);
        if (data.length > 0) {
          let uniqueName = name;
          let counter = 1;
          while ((dataStore[currentCategory] && dataStore[currentCategory][uniqueName]) || newSheetsData[uniqueName]) {
            uniqueName = `${name} (${counter++})`;
          }
          newSheetsData[uniqueName] = data;
          newSheetNames.push(uniqueName);
        }
      });

      if (newSheetNames.length === 0) {
        alert("No valid data found.");
      } else {
        setDataStore(prev => ({ ...prev, [currentCategory]: { ...(prev[currentCategory] || {}), ...newSheetsData } }));
        setSelectedSheets(prev => Array.from(new Set([...prev, ...newSheetNames])));
        setIsModalOpen(false);
        setGsheetUrl("");
      }
    } catch (err) { alert("Failed to fetch Google Sheet."); }
    finally { setIsFetchingGsheet(false); }
  };

  const submitRename = (oldName: string) => {
    const newName = renameValue.trim();
    if (!newName || newName === oldName) { setEditingSheetKey(null); return; }
    if (dataStore[currentCategory][newName]) { alert("Name exists."); return; }
    setDataStore(prev => {
      const catData = { ...prev[currentCategory] };
      const content = catData[oldName];
      delete catData[oldName];
      catData[newName] = content;
      return { ...prev, [currentCategory]: catData };
    });
    setSelectedSheets(prev => prev.map(s => s === oldName ? newName : s));
    setEditingSheetKey(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden relative">
        <div className="h-64 lg:h-full lg:w-1/3 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 relative flex flex-col items-center lg:items-start justify-center p-8 lg:p-16 shrink-0">
          <div className="relative z-10 space-y-4 max-w-sm text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-900 shadow-xl font-extrabold text-2xl">I</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tighter">IntelliData</h1>
            </div>
            <p className="text-sm font-semibold text-indigo-100/80">Turn your complex datasets into clear, actionable intelligence.</p>
          </div>
        </div>
        <div className="flex-1 h-full bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
          <div className="w-full max-w-sm space-y-8 py-8">
            <header>
              <h3 className="text-3xl font-extrabold text-slate-900">Login</h3>
              <p className="text-slate-400 mt-1.5 text-sm font-medium">Enter corporate credentials</p>
            </header>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <input type="email" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-semibold" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} placeholder="Email" />
                <input type="password" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-semibold" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} placeholder="Password" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv, .xlsx, .xls" className="hidden" multiple />

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-2xl lg:shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">I</div>
            <span className="text-lg font-bold text-slate-900 tracking-tighter">IntelliData</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">{Icons.Close}</button>
        </div>

        <div className="px-3 pt-4 space-y-2 shrink-0">
          <button onClick={() => setActiveModule('ATTENDANCE')} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${activeModule === 'ATTENDANCE' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-semibold' : 'hover:bg-gray-50 text-slate-500 font-medium'}`}>
            {Icons.Attendance} <span className="text-xs uppercase tracking-wider">Attendance</span>
          </button>
          <div className="space-y-1">
            <button onClick={() => setActiveModule('SALES')} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${activeModule === 'SALES' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 font-semibold' : 'hover:bg-gray-50 text-slate-500 font-medium'}`}>
              {Icons.Sales} <span className="text-xs uppercase tracking-wider">Sales Ledger</span>
            </button>
            {activeModule === 'SALES' && (
              <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-indigo-100 pl-3">
                {SalesSections.map(section => (
                  <button key={section} onClick={() => setActiveSalesSection(section)} className={`w-full text-left p-1.5 rounded-lg text-[11px] flex items-center gap-2 ${activeSalesSection === section ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-400 hover:bg-gray-50 font-medium'}`}>
                    {section.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="w-3.5 h-3.5 rounded-md border-gray-200 text-indigo-600 cursor-pointer" checked={availableSheets.length > 0 && selectedSheets.length === availableSheets.length} onChange={() => setSelectedSheets(selectedSheets.length === availableSheets.length ? [] : [...availableSheets])} />
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manage Sheets</h3>
          </div>
          <input type="text" placeholder="Find records..." className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-semibold outline-none" value={sheetSearchQuery} onChange={(e) => setSheetSearchQuery(e.target.value)} />
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1 scrollbar-hide mask-fade-bottom">
          {filteredSidebarSheets.map(sheet => (
            <div key={sheet} className="flex items-center gap-2 px-1 py-0.5 rounded-xl group hover:bg-slate-50 transition-all">
              {editingSheetKey === sheet ? (
                <input autoFocus type="text" className="flex-1 text-[11px] border rounded px-2 py-1 outline-none font-bold" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitRename(sheet)} onBlur={() => submitRename(sheet)} />
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-2.5 p-2 cursor-pointer truncate min-w-0" onClick={() => setSelectedSheets(prev => prev.includes(sheet) ? prev.filter(s => s !== sheet) : [...prev, sheet])}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedSheets.includes(sheet) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
                      {selectedSheets.includes(sheet) && <div className="text-white scale-50">{Icons.Check}</div>}
                    </div>
                    <span className={`text-[12px] truncate ${selectedSheets.includes(sheet) ? 'text-indigo-700 font-semibold' : 'text-slate-600 font-medium'}`}>{sheet}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); setEditingSheetKey(sheet); setRenameValue(sheet); }} className="p-1 text-slate-300 hover:text-indigo-600">{Icons.Edit}</button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedSheets(p => p.filter(s => s !== sheet)); setDataStore(p => { const next = {...(p[currentCategory] || {})}; delete next[sheet]; return {...p, [currentCategory]: next}; }); }} className="p-1 text-slate-300 hover:text-red-500">{Icons.Trash}</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-2">
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
            {Icons.Upload} Local File
          </button>
          <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-emerald-100 text-emerald-700 bg-emerald-50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all">
            {Icons.Google} G-Spreadsheet
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500">{Icons.Menu}</button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">{currentCategory.replace(/-/g, ' ')}</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedSheets.length} active ledgers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Global Search..." className="pl-4 pr-4 py-2 border border-slate-100 rounded-2xl text-xs font-semibold w-64 bg-slate-50 outline-none transition-all" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 transition-all">{Icons.Logout}</button>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1">
          {filteredData.length === 0 && rawMergedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-36 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 mb-8">{Icons.Upload}</div>
              <h2 className="text-2xl font-bold text-slate-900">No Data Selected</h2>
              <p className="text-slate-400 max-w-sm mx-auto mt-3 font-semibold text-xs uppercase tracking-widest">Select imported sheets from the sidebar to visualize results.</p>
            </div>
          ) : (
            <>
              {activeModule !== 'ATTENDANCE' && Object.keys(totals).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.keys(totals).slice(0, 4).map(key => (
                    <SummaryCard key={key} title={key} value={totals[key].toLocaleString()} icon={<div className="font-extrabold text-[8px] md:text-[9px] uppercase tracking-tighter">Total</div>} colorClass="bg-indigo-600 text-indigo-600" />
                  ))}
                </div>
              )}

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl flex flex-col min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20 rounded-t-[2rem]">
                  <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tighter">Master Ledger</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-1.5 border-2 border-indigo-100 text-indigo-700 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all">
                      {Icons.Export} Export Section
                    </button>
                    <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold uppercase tracking-widest">{filteredData.length} entries</div>
                  </div>
                </div>
                
                <div className="overflow-auto max-h-[600px] flex-1">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-white text-slate-400 text-[9px] uppercase font-bold tracking-widest">
                        {headers.map(h => (
                          <th key={h} className="px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 whitespace-nowrap">
                            <div className="flex items-center gap-2 relative">
                              <span>{h}</span>
                              <button onClick={() => handleToggleFilterCol(h)} className={`p-1 rounded transition-all ${activeFilters[h] ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300'}`}>{Icons.Filter}</button>
                              {openFilterCol === h && (
                                <div ref={filterDropdownRef} className="absolute top-full left-0 mt-4 w-72 bg-white border rounded-2xl shadow-2xl z-50 p-4 animate-in zoom-in-95 duration-200">
                                  <input type="text" placeholder="Filter values..." className="w-full p-2 bg-slate-50 rounded-lg text-[10px] mb-4 outline-none border border-slate-100 focus:border-indigo-300" value={filterSearchQuery} onChange={(e) => setFilterSearchQuery(e.target.value)} />
                                  
                                  <div className="max-h-72 overflow-y-auto overflow-x-hidden space-y-3 pr-1">
                                    {(() => {
                                      // CRITICAL: Logic block instead of useMemo to prevent hook violation error #310
                                      const allColValues = uniqueValues[h] || [];
                                      const searchMatches = allColValues.filter(v => v.toLowerCase().includes(filterSearchQuery.toLowerCase()));
                                      const selectedInCol = activeFilters[h] || [];
                                      const selectedMatches = searchMatches.filter(v => selectedInCol.includes(v));
                                      const unselectedMatches = searchMatches.filter(v => !selectedInCol.includes(v));

                                      if (searchMatches.length === 0) {
                                        return <div className="p-4 text-center text-[10px] text-slate-400 font-medium italic">No results found</div>;
                                      }

                                      return (
                                        <>
                                          {selectedMatches.length > 0 && (
                                            <div className="space-y-1">
                                              <div className="flex items-center justify-between px-2 mb-1">
                                                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Selected</span>
                                                <button onClick={() => clearColumnFilters(h)} className="text-[9px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear</button>
                                              </div>
                                              {selectedMatches.map(v => (
                                                <button key={v} title={v} onClick={() => toggleFilterValue(h, v)} className="w-full text-left p-2 rounded-xl text-[10px] bg-indigo-50 text-indigo-700 font-bold flex items-center gap-2 group transition-all">
                                                  <div className="shrink-0">{Icons.Check}</div>
                                                  <span className="truncate">{v}</span>
                                                </button>
                                              ))}
                                              {unselectedMatches.length > 0 && <div className="h-px bg-slate-100 my-3 mx-2" />}
                                            </div>
                                          )}
                                          
                                          {unselectedMatches.length > 0 && (
                                            <div className="space-y-1">
                                              {selectedMatches.length > 0 && (
                                                <div className="px-2 mb-1">
                                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Other Options</span>
                                                </div>
                                              )}
                                              {unselectedMatches.map(v => (
                                                <button key={v} title={v} onClick={() => toggleFilterValue(h, v)} className="w-full text-left p-2 rounded-xl text-[10px] text-slate-600 hover:bg-slate-50 truncate block transition-colors">
                                                  {v}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[12px] divide-y divide-slate-50">
                      {filteredData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          {headers.map(h => {
                            const val = row[h] ?? row[Object.keys(row).find(k => k.trim() === h) || ""];
                            let dVal = val;
                            if (typeof val === 'number' && (h.toLowerCase().includes('date') || (val > 35000 && val < 60000))) dVal = formatExcelDate(val);
                            else if (typeof val === 'number') dVal = val.toLocaleString();
                            return <td key={h} className="px-8 py-4 text-slate-500 font-semibold whitespace-nowrap">{dVal ?? "-"}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tighter">Import Workbook</h3>
            <p className="text-xs text-slate-400 mb-8 font-semibold uppercase tracking-widest leading-relaxed">Connect to a public Google Spreadsheet to aggregate all available sheets.</p>
            <input type="text" placeholder="https://docs.google.com/spreadsheets/..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-8 text-xs font-semibold outline-none focus:border-indigo-300 transition-all" value={gsheetUrl} onChange={(e) => setGsheetUrl(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-[9px] hover:text-slate-600">Cancel</button>
              <button onClick={handleImportGoogleSheet} disabled={isFetchingGsheet || !gsheetUrl} className="flex-[2] py-4 bg-emerald-600 text-white font-bold uppercase text-[9px] rounded-xl shadow-lg shadow-emerald-100 disabled:opacity-50">
                {isFetchingGsheet ? 'Processing...' : 'Synchronize'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}