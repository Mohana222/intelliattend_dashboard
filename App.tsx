import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { INITIAL_DATA } from './mockData';
import { DataRecord, ModuleType, SalesSection, SheetCollection } from './types';
import SummaryCard from './components/SummaryCard';

const Icons = {
  Attendance: <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
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
  Check: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Eye: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L1 1m11 11l9 9" /></svg>
};

const STORAGE_KEY = 'intellidata_v2_final';
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
  const [loginModalContent, setLoginModalContent] = useState<'about' | 'privacy' | null>(null);

  const [activeModule, setActiveModule] = useState<ModuleType>('ATTENDANCE');
  const [activeSalesSection, setActiveSalesSection] = useState<SalesSection>('Inventory-Tracking');
  
  const [dataStore, setDataStore] = useState<{ [key: string]: SheetCollection }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
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

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStore)); }, [dataStore]);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (loginForm.email === VALID_EMAIL && loginForm.password === VALID_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid credentials. Try admin@intellidata.com / admin123");
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
      
      // Fix: Use Object.keys to iterate over activeFilters to ensure TypeScript correctly identifies selectedValues as string[]
      return Object.keys(activeFilters).every(col => {
        const selectedValues = activeFilters[col];
        if (!selectedValues || selectedValues.length === 0) return true;
        
        let cellVal = item[col];
        if (cellVal === undefined) {
           const key = Object.keys(item).find(k => k.trim() === col);
           if (key) cellVal = item[key];
        }
        
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
        let val = row[h];
        if (val === undefined) {
          const matchingKey = Object.keys(row).find(k => k.trim() === h);
          if (matchingKey) val = row[matchingKey];
        }

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

  const toggleFilterValue = (column: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[column] || [];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      
      const updated = { ...prev };
      if (next.length === 0) delete updated[column];
      else updated[column] = next;
      
      return updated;
    });
  };

  const clearColumnFilter = (column: string) => {
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
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
        const data = normalizeDataArray(rawData);
        const name = file.name.replace(/\.[^/.]+$/, "");
        setDataStore(prev => ({ ...prev, [currentCategory]: { ...(prev[currentCategory] || {}), [name]: data } }));
        setSelectedSheets(prev => Array.from(new Set([...prev, name])));
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
      if (match) url = `https://docs.google.com/spreadsheets/d/${match[0]}/export?format=csv`;
      const res = await fetch(url);
      const text = await res.text();
      const workbook = XLSX.read(text, { type: 'string', cellDates: false });
      const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      const data = normalizeDataArray(rawData);
      const name = "G-Sheet " + (availableSheets.length + 1);
      setDataStore(prev => ({ ...prev, [currentCategory]: { ...(prev[currentCategory] || {}), [name]: data } }));
      setSelectedSheets(prev => Array.from(new Set([...prev, name])));
      setIsModalOpen(false);
      setGsheetUrl("");
    } catch (err) { alert("Failed to fetch Google Sheet."); }
    finally { setIsFetchingGsheet(false); }
  };

  const deleteSingleSheet = (sheetName: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    
    setSelectedSheets(prev => prev.filter(s => s !== sheetName));
    setDataStore(prev => {
      const nextCategoryData = { ...(prev[currentCategory] || {}) };
      delete nextCategoryData[sheetName];
      return { ...prev, [currentCategory]: nextCategoryData };
    });
  };

  const startRenaming = (sheetName: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setEditingSheetKey(sheetName);
    setRenameValue(sheetName);
  };

  const submitRename = (oldName: string) => {
    const newName = renameValue.trim();
    if (!newName || newName === oldName) { setEditingSheetKey(null); return; }
    if (dataStore[currentCategory][newName]) { alert("A sheet with this name already exists."); return; }
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

  const toggleSelectAll = () => { setSelectedSheets(prev => prev.length === availableSheets.length ? [] : [...availableSheets]); };

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden relative">
        {loginModalContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setLoginModalContent(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {loginModalContent === 'about' ? 'About IntelliData' : 'Security & Privacy'}
                </h4>
                <button onClick={() => setLoginModalContent(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                  {Icons.Close}
                </button>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 font-medium text-sm leading-relaxed space-y-4">
                {loginModalContent === 'about' ? (
                  <>
                    <p>IntelliData is an elite enterprise-grade data orchestration platform. We bridge the gap between static spreadsheet reporting and dynamic strategic intelligence.</p>
                    <p>By leveraging advanced analytics tools, we empower decision-makers to extract nuanced trends and actionable insights from raw data in real-time.</p>
                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                      <div className="flex-1 p-4 bg-indigo-50 rounded-2xl text-indigo-700 font-bold text-xs uppercase tracking-widest">Democratizing Analytics</div>
                      <div className="flex-1 p-4 bg-indigo-50 rounded-2xl text-indigo-700 font-bold text-xs uppercase tracking-widest">High-Performance Stack</div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Your institutional data is your most valuable asset. We treat it with uncompromising security protocols.</p>
                    <ul className="space-y-3 list-none p-0">
                      <li className="flex gap-3">
                        <div className="mt-1 text-emerald-500 shrink-0">{Icons.Check}</div>
                        <span><strong>AES-256 Encryption:</strong> Data is encrypted at rest and in transit.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 text-emerald-500 shrink-0">{Icons.Check}</div>
                        <span><strong>Stateless Processing:</strong> Spreadsheet data is never persisted on our core servers.</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
              <button onClick={() => setLoginModalContent(null)} className="w-full mt-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">Close View</button>
            </div>
          </div>
        )}

        <div className="lg:w-1/3 h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 relative flex flex-col items-start justify-center p-8 lg:p-16 shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-400 rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 space-y-6 max-w-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-900 shadow-xl font-extrabold text-2xl">I</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tighter">IntelliData</h1>
            </div>
            <p className="text-base font-semibold text-indigo-100/80 leading-snug tracking-tight">Turn your complex datasets into clear, actionable intelligence with one click.</p>
          </div>
        </div>
        <div className="flex-1 h-full bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
          <div className="w-full max-w-sm space-y-8 py-8">
            <header>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login</h3>
              <p className="text-slate-400 mt-1.5 text-sm font-medium">Enter your corporate credentials</p>
            </header>
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl animate-pulse">{loginError}</div>}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input type="email" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm text-slate-900 placeholder:text-slate-300 font-semibold" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all text-sm text-slate-900 placeholder:text-slate-300 font-semibold pr-12" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-2">{showPassword ? Icons.EyeOff : Icons.Eye}</button>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98]">Sign In</button>
            </form>
          </div>
          <footer className="w-full max-w-md mt-auto pt-8 flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest opacity-60">
            <div className="flex gap-4">
              <button onClick={() => setLoginModalContent('privacy')} className="hover:text-indigo-600 transition-colors">Privacy</button>
              <button onClick={() => setLoginModalContent('about')} className="hover:text-indigo-600 transition-colors">About</button>
            </div>
            <div className="text-right flex flex-col items-end">
              <span>© 2025 IntelliData</span>
              <span className="text-[8px] text-slate-300">v2.1.0 PRO</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv, .xlsx, .xls" className="hidden" />

      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-20">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg font-bold text-xs">I</div>
          <span className="text-lg font-bold text-slate-900 tracking-tighter">IntelliData</span>
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
              <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-indigo-100 pl-3 animate-in slide-in-from-top-1 duration-200">
                {SalesSections.map(section => (
                  <button key={section} onClick={() => setActiveSalesSection(section)} className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-all flex items-center gap-2 ${activeSalesSection === section ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-400 hover:bg-gray-50 font-medium'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                    {section.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            {availableSheets.length > 0 && <input type="checkbox" className="w-3.5 h-3.5 rounded-md border-gray-200 text-indigo-600 cursor-pointer" checked={availableSheets.length > 0 && selectedSheets.length === availableSheets.length} onChange={toggleSelectAll} />}
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manage Sheets</h3>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">{Icons.Search}</div>
            <input type="text" placeholder="Find records..." className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 transition-all placeholder:text-slate-300" value={sheetSearchQuery} onChange={(e) => setSheetSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-1 scrollbar-hide mask-fade-bottom">
          {filteredSidebarSheets.map(sheet => (
            <div key={sheet} className="flex items-center gap-2 px-1 py-0.5 rounded-xl group hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
              {editingSheetKey === sheet ? (
                <div className="flex-1 flex items-center gap-2 p-1 bg-white shadow-sm rounded-lg">
                  <input autoFocus type="text" className="flex-1 text-[11px] border-none bg-transparent rounded px-2 py-1 outline-none font-semibold text-slate-900" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitRename(sheet); if (e.key === 'Escape') setEditingSheetKey(null); }} />
                  <button onClick={() => submitRename(sheet)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-lg transition-colors scale-75">{Icons.Check}</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-2.5 p-2 cursor-pointer truncate min-w-0" onClick={() => setSelectedSheets(prev => prev.includes(sheet) ? prev.filter(s => s !== sheet) : [...prev, sheet])}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedSheets.includes(sheet) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-100 group-hover:border-slate-300'}`}>
                      {selectedSheets.includes(sheet) && <div className="text-white scale-50">{Icons.Check}</div>}
                    </div>
                    <span className={`text-[12px] truncate tracking-tight transition-colors ${selectedSheets.includes(sheet) ? 'text-indigo-700 font-semibold' : 'text-slate-600 font-medium group-hover:text-slate-900'}`}>{sheet}</span>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-0.5 pr-1">
                    <button onClick={(e) => startRenaming(sheet, e)} className="p-1 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all scale-75">{Icons.Edit}</button>
                    <button onClick={(e) => deleteSingleSheet(sheet, e)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all scale-75">{Icons.Trash}</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {availableSheets.length === 0 && (
            <div className="py-8 px-4 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System Ready<br/>Upload Dataset</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.01)] shrink-0">
          <div className="space-y-2">
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
              {Icons.Upload} Local File
            </button>
            <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-emerald-100 text-emerald-700 bg-emerald-50/50 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-emerald-100/50 hover:border-emerald-300 transition-all active:scale-[0.98]">
              {Icons.Google} G-Spreadsheet
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tighter leading-none">{currentCategory.replace(/-/g, ' ')}</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{selectedSheets.length} active ledgers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors">{Icons.Search}</div>
              <input type="text" placeholder="Global Ledger Search..." className="pl-10 pr-4 py-2.5 border border-slate-100 rounded-2xl text-xs font-semibold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-300 w-64 bg-slate-50 outline-none transition-all placeholder:text-slate-300" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>
            <button onClick={handleLogout} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Secure Logout">{Icons.Logout}</button>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1">
          {filteredData.length === 0 && rawMergedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-36 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 mb-8 animate-pulse">{Icons.Upload}</div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Initialization Complete</h2>
              <p className="text-slate-400 max-w-sm mx-auto mt-3 font-semibold text-xs leading-relaxed uppercase tracking-wider">Please feed the data engine by uploading corporate records via the sidebar action console.</p>
            </div>
          ) : (
            <>
              {activeModule !== 'ATTENDANCE' && Object.keys(totals).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.keys(totals).slice(0, 4).map(key => (
                    <SummaryCard key={key} title={`Aggregate ${key}`} value={totals[key].toLocaleString()} icon={<div className="font-bold text-[9px] tracking-tighter uppercase opacity-50">Total</div>} colorClass="bg-indigo-600 text-indigo-600" />
                  ))}
                </div>
              )}

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/30 flex flex-col min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20 rounded-t-[2rem]">
                  <h3 className="font-bold text-slate-900 text-lg tracking-tighter uppercase">Consolidated Master Ledger</h3>
                  <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold tracking-widest uppercase">{filteredData.length} records processed</div>
                </div>
                
                <div className="overflow-auto max-h-[600px] flex-1">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                      <tr className="bg-white text-slate-400 text-[9px] uppercase font-bold tracking-[0.2em]">
                        {headers.map(h => {
                          const isActive = activeFilters[h] && activeFilters[h].length > 0;
                          return (
                            <th key={h} className="px-8 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-sm whitespace-nowrap">
                              <div className="flex items-center gap-2 relative">
                                <span>{h}</span>
                                <button 
                                  onClick={() => setOpenFilterCol(openFilterCol === h ? null : h)} 
                                  className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-300'}`}
                                >
                                  {Icons.Filter}
                                </button>
                                
                                {openFilterCol === h && (
                                  <div ref={filterDropdownRef} className="absolute top-full left-0 mt-4 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-96 ring-1 ring-slate-100 animate-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-50 bg-slate-50/30 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Filter Column</h4>
                                        {isActive && (
                                          <button onClick={() => clearColumnFilter(h)} className="text-[9px] font-bold text-red-500 uppercase hover:underline">Clear All</button>
                                        )}
                                      </div>
                                      <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center text-slate-300">{Icons.Search}</div>
                                        <input 
                                          type="text" 
                                          placeholder="Search values..." 
                                          autoFocus
                                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-semibold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 transition-all"
                                          value={filterSearchQuery}
                                          onChange={(e) => setFilterSearchQuery(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="overflow-y-auto flex-1 p-2 space-y-0.5 max-h-64">
                                      {uniqueValues[h]
                                        ?.filter(v => v.toLowerCase().includes(filterSearchQuery.toLowerCase()))
                                        .map(v => {
                                          const isSelected = activeFilters[h]?.includes(v);
                                          return (
                                            <button 
                                              key={v} 
                                              onClick={() => toggleFilterValue(h, v)} 
                                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-semibold transition-all ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                            >
                                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
                                                {isSelected && <div className="text-white scale-[0.6]">{Icons.Check}</div>}
                                              </div>
                                              <span className="truncate">{v}</span>
                                            </button>
                                          );
                                      })}
                                      {uniqueValues[h]?.filter(v => v.toLowerCase().includes(filterSearchQuery.toLowerCase())).length === 0 && (
                                        <div className="p-8 text-center text-slate-300 font-bold text-[9px] uppercase tracking-widest">No matches found</div>
                                      )}
                                    </div>
                                    
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                                      <button onClick={() => setOpenFilterCol(null)} className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-colors">Apply Filters</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="text-[12px] divide-y divide-slate-50">
                      {filteredData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors group">
                          {headers.map(h => {
                            const val = row[h];
                            let dVal = val;
                            if (typeof val === 'number' && (h.toLowerCase().includes('date') || (val > 35000 && val < 60000))) dVal = formatExcelDate(val);
                            else if (typeof val === 'number') dVal = val.toLocaleString();
                            return <td key={h} className="px-8 py-4 text-slate-500 font-semibold whitespace-nowrap group-hover:text-slate-900 transition-colors">{dVal ?? "-"}</td>;
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
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">API Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-200 hover:text-slate-900 transition-colors">{Icons.Close}</button>
            </div>
            <p className="text-xs text-slate-400 mb-8 font-semibold uppercase tracking-widest leading-relaxed">Establish a secure tunnel to your cloud-hosted Google Spreadsheet.</p>
            <input type="text" placeholder="https://docs.google.com/spreadsheets/..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-8 text-xs outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-300 font-semibold tracking-tight" value={gsheetUrl} onChange={(e) => setGsheetUrl(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px]">Abort</button>
              <button onClick={handleImportGoogleSheet} disabled={isFetchingGsheet || !gsheetUrl} className="flex-[2] px-6 py-4 bg-emerald-600 text-white font-bold uppercase tracking-[0.2em] text-[9px] rounded-xl shadow-2xl shadow-emerald-100 disabled:opacity-50 active:scale-[0.98] transition-all">
                {isFetchingGsheet ? 'Processing...' : 'Establish Connection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}