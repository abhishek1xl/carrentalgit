import { useState, useCallback, useMemo } from "react";
import {
  Car, Users, Calendar, FileText, BarChart3, Settings, LogOut, Menu, X, Search,
  Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Download, Printer,
  CheckCircle, XCircle, Clock, AlertTriangle, DollarSign, TrendingUp,
  Phone, Mail, MapPin, ArrowUpDown, Home, Activity, Gauge, Upload,
  Wrench, Shield, Hash, Star, Filter, PlayCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart as RPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

/* ================================================================
   CONFIG — Change these to customize
   ================================================================ */
const CFG = { company: "1XL Car Rentals", currency: "AED", tax: 5, ver: "1.0.0" };
const CHART_COLORS = ["#2563eb","#16a34a","#d97706","#dc2626","#8b5cf6","#0891b2","#ec4899","#f97316"];

/* ================================================================
   AUTH USERS
   ================================================================ */
const AUTH_USERS = [
  { id:"u1", username:"admin",     password:"admin123", role:"Admin",     name:"Admin User" },
  { id:"u2", username:"executive", password:"exec123",  role:"Executive", name:"Booking Executive" },
  { id:"u3", username:"manager",   password:"mgr123",   role:"Manager",   name:"Fleet Manager" },
];

/* ================================================================
   HELPERS — dates, currency, ids
   ================================================================ */
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
const now = new Date();
const ago = (days, h=10) => { const d=new Date(now); d.setDate(d.getDate()-days); d.setHours(h,0,0,0); return d.toISOString(); };
const fDate = (s) => { if(!s) return "—"; const d=new Date(s); return isNaN(d) ? "—" : d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); };
const fDateTime = (s) => { if(!s) return "—"; const d=new Date(s); return isNaN(d) ? "—" : d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); };
const fMoney = (v) => `${CFG.currency} ${(parseFloat(v)||0).toFixed(2)}`;
const calcDays = (a,b) => { const d1=new Date(a),d2=new Date(b); return (isNaN(d1)||isNaN(d2)) ? 0 : Math.max(1,Math.ceil((d2-d1)/864e5)); };
const pf = (v) => parseFloat(v)||0;

/* ================================================================
   SAMPLE DATA
   ================================================================ */
const S_VEHICLES = [
  {id:"v1",plate:"DXB-A-12345",brand:"Toyota",model:"Camry",type:"Sedan",fuel:"Petrol",seats:5,daily:180,hourly:25,color:"White",year:2023,km:15200,status:"Available",reg:"REG-001",ins_exp:ago(-30),svc_due:ago(-60)},
  {id:"v2",plate:"DXB-B-67890",brand:"Nissan",model:"Patrol",type:"SUV",fuel:"Petrol",seats:7,daily:350,hourly:50,color:"Black",year:2024,km:8400,status:"Rented",reg:"REG-002",ins_exp:ago(-90),svc_due:ago(-120)},
  {id:"v3",plate:"DXB-C-11111",brand:"Honda",model:"City",type:"Sedan",fuel:"Petrol",seats:5,daily:150,hourly:20,color:"Silver",year:2022,km:32000,status:"Available",reg:"REG-003",ins_exp:ago(-45),svc_due:ago(-30)},
  {id:"v4",plate:"DXB-D-22222",brand:"Toyota",model:"Land Cruiser",type:"SUV",fuel:"Diesel",seats:7,daily:500,hourly:70,color:"Pearl White",year:2024,km:5600,status:"Reserved",reg:"REG-004",ins_exp:ago(-120),svc_due:ago(-150)},
  {id:"v5",plate:"DXB-E-33333",brand:"Suzuki",model:"Swift",type:"Hatchback",fuel:"Petrol",seats:5,daily:100,hourly:15,color:"Red",year:2023,km:22000,status:"Available",reg:"REG-005",ins_exp:ago(-60),svc_due:ago(-20)},
  {id:"v6",plate:"DXB-F-44444",brand:"Mercedes",model:"S-Class",type:"Luxury",fuel:"Petrol",seats:5,daily:900,hourly:120,color:"Black",year:2024,km:3200,status:"Under Maintenance",reg:"REG-006",ins_exp:ago(-200),svc_due:ago(5)},
  {id:"v7",plate:"DXB-G-55555",brand:"Toyota",model:"Hiace",type:"Van",fuel:"Diesel",seats:12,daily:280,hourly:40,color:"White",year:2022,km:48000,status:"Available",reg:"REG-007",ins_exp:ago(-100),svc_due:ago(-10)},
  {id:"v8",plate:"DXB-H-66666",brand:"Ford",model:"Explorer",type:"SUV",fuel:"Petrol",seats:7,daily:320,hourly:45,color:"Blue",year:2023,km:18500,status:"Available",reg:"REG-008",ins_exp:ago(-80),svc_due:ago(-40)},
];

const S_CUSTOMERS = [
  {id:"c1",name:"Ahmed Al Maktoum",email:"ahmed@email.com",phone:"+971501234567",license:"DL-UAE-001",lic_exp:ago(-365),address:"Dubai Marina",nationality:"UAE",id_type:"Emirates ID",id_num:"784-1990-1234567-1",reg_date:ago(90)},
  {id:"c2",name:"Sarah Johnson",email:"sarah.j@email.com",phone:"+971502345678",license:"DL-UK-002",lic_exp:ago(-200),address:"JBR, Dubai",nationality:"British",id_type:"Passport",id_num:"GB123456",reg_date:ago(75)},
  {id:"c3",name:"Rajesh Kumar",email:"rajesh.k@email.com",phone:"+971503456789",license:"DL-IND-003",lic_exp:ago(-150),address:"Bur Dubai",nationality:"Indian",id_type:"Passport",id_num:"IN7890123",reg_date:ago(60)},
  {id:"c4",name:"Fatima Hassan",email:"fatima.h@email.com",phone:"+971504567890",license:"DL-UAE-004",lic_exp:ago(-400),address:"Al Barsha",nationality:"UAE",id_type:"Emirates ID",id_num:"784-1985-7654321-1",reg_date:ago(45)},
  {id:"c5",name:"Michael Chen",email:"m.chen@email.com",phone:"+971505678901",license:"DL-CN-005",lic_exp:ago(-100),address:"Business Bay",nationality:"Chinese",id_type:"Passport",id_num:"CN456789",reg_date:ago(30)},
  {id:"c6",name:"Aisha Mohammed",email:"aisha.m@email.com",phone:"+971506789012",license:"DL-UAE-006",lic_exp:ago(-300),address:"Jumeirah",nationality:"UAE",id_type:"Emirates ID",id_num:"784-1992-9876543-1",reg_date:ago(15)},
];

const S_BOOKINGS = [
  {id:"b1",bid:"BK-20260120-001",cid:"c1",vid:"v2",pickup:ago(3,9),ret:ago(-4,18),pickup_loc:"Dubai Airport T3",drop_loc:"Dubai Airport T3",status:"Ongoing",deposit:500,notes:"Airport pickup",phone:"+971501234567",lic:"DL-UAE-001"},
  {id:"b2",bid:"BK-20260118-001",cid:"c2",vid:"v4",pickup:ago(1,10),ret:ago(-5,10),pickup_loc:"Marina Office",drop_loc:"Marina Office",status:"Confirmed",deposit:1000,notes:"",phone:"+971502345678",lic:"DL-UK-002"},
  {id:"b3",bid:"BK-20260110-001",cid:"c3",vid:"v1",pickup:ago(20,8),ret:ago(15,8),pickup_loc:"Bur Dubai Office",drop_loc:"Bur Dubai Office",status:"Completed",deposit:300,notes:"",phone:"+971503456789",lic:"DL-IND-003"},
  {id:"b4",bid:"BK-20260105-001",cid:"c4",vid:"v3",pickup:ago(25,10),ret:ago(20,10),pickup_loc:"Al Barsha Office",drop_loc:"Al Barsha Office",status:"Completed",deposit:200,notes:"",phone:"+971504567890",lic:"DL-UAE-004"},
  {id:"b5",bid:"BK-20260201-001",cid:"c5",vid:"v5",pickup:ago(10,9),ret:ago(5,18),pickup_loc:"Business Bay",drop_loc:"Business Bay",status:"Completed",deposit:150,notes:"",phone:"+971505678901",lic:"DL-CN-005"},
  {id:"b6",bid:"BK-20260130-001",cid:"c1",vid:"v7",pickup:ago(30,8),ret:ago(27,8),pickup_loc:"Airport T3",drop_loc:"Airport T3",status:"Completed",deposit:400,notes:"Group travel",phone:"+971501234567",lic:"DL-UAE-001"},
  {id:"b7",bid:"BK-20260115-001",cid:"c6",vid:"v1",pickup:ago(40,10),ret:ago(35,10),pickup_loc:"Jumeirah",drop_loc:"Jumeirah",status:"Cancelled",deposit:0,notes:"Customer cancelled",phone:"+971506789012",lic:"DL-UAE-006"},
  {id:"b8",bid:"BK-20260125-001",cid:"c3",vid:"v5",pickup:ago(45,9),ret:ago(40,18),pickup_loc:"Bur Dubai",drop_loc:"Bur Dubai",status:"Completed",deposit:150,notes:"",phone:"+971503456789",lic:"DL-IND-003"},
  {id:"b9",bid:"BK-20260210-001",cid:"c2",vid:"v3",pickup:ago(60,10),ret:ago(55,10),pickup_loc:"Marina",drop_loc:"Marina",status:"Completed",deposit:200,notes:"",phone:"+971502345678",lic:"DL-UK-002"},
  {id:"b10",bid:"BK-20260215-001",cid:"c4",vid:"v8",pickup:ago(50,8),ret:ago(47,18),pickup_loc:"Al Barsha",drop_loc:"Al Barsha",status:"Completed",deposit:300,notes:"",phone:"+971504567890",lic:"DL-UAE-004"},
];

function calcInv(bk, veh, extras={}) {
  const days = calcDays(bk?.pickup, bk?.ret);
  const rate = pf(veh?.daily);
  const base = days * rate;
  const late = pf(extras.late); const fuel = pf(extras.fuel); const xkm = pf(extras.xkm);
  const sub = base + late + fuel + xkm;
  const tr = pf(extras.taxRate ?? CFG.tax);
  const tax = sub * tr / 100;
  const dp = pf(extras.disc);
  const disc = sub * dp / 100;
  const grand = sub + tax - disc;
  const paid = pf(extras.paid ?? grand);
  return { days, base, late, fuel, xkm, sub, taxRate:tr, tax, discPct:dp, disc, grand, paid, bal: grand - paid };
}

const mkInvoices = () => {
  const done = S_BOOKINGS.filter(b => b.status==="Completed");
  return done.map((b,i) => {
    const v = S_VEHICLES.find(x=>x.id===b.vid);
    const c = calcInv(b,v,{ paid: i<4?undefined:(i===4?200:0) });
    const ps = i<4?"Paid":(i===4?"Partially Paid":"Pending");
    const methods = ["Cash","Card","Online Transfer","Bank Transfer"];
    return {
      id:`inv${i+1}`, num:`INV-2026${String(i+1).padStart(4,"0")}`,
      bid:b.id, cid:b.cid, vid:b.vid,
      ...c, method:methods[i%4], pStatus:ps,
      paid: ps==="Paid"?c.grand:(ps==="Partially Paid"?200:0),
      bal: ps==="Paid"?0:(ps==="Partially Paid"?c.grand-200:c.grand),
      date:b.ret,
    };
  });
};

/* ================================================================
   REUSABLE UI COMPONENTS
   ================================================================ */
const Badge = ({children,color="blue"}) => {
  const c = {blue:"bg-blue-100 text-blue-800",green:"bg-emerald-100 text-emerald-800",red:"bg-red-100 text-red-800",yellow:"bg-amber-100 text-amber-800",gray:"bg-gray-100 text-gray-700",purple:"bg-purple-100 text-purple-800",cyan:"bg-cyan-100 text-cyan-800"};
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c[color]||c.blue}`}>{children}</span>;
};

const SBadge = ({s}) => {
  const m = {Available:"green",Reserved:"blue",Rented:"yellow","Under Maintenance":"red",Confirmed:"blue",Ongoing:"yellow",Completed:"green",Cancelled:"red",Paid:"green",Pending:"yellow","Partially Paid":"cyan"};
  return <Badge color={m[s]||"gray"}>{s}</Badge>;
};

const Card = ({icon:I,title,val,sub,color="blue"}) => {
  const bg = {blue:"from-blue-500 to-blue-600",green:"from-emerald-500 to-emerald-600",yellow:"from-amber-500 to-amber-600",red:"from-red-500 to-red-600",purple:"from-purple-500 to-purple-600",cyan:"from-cyan-500 to-cyan-600"};
  return (
    <div className={`bg-gradient-to-br ${bg[color]||bg.blue} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium opacity-90">{title}</span><I size={20} className="opacity-70"/></div>
      <div className="text-2xl font-bold tracking-tight">{val}</div>
      {sub && <div className="text-xs opacity-75 mt-1">{sub}</div>}
    </div>
  );
};

const Modal = ({open,onClose,title,children,wide}) => {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative bg-white rounded-2xl shadow-2xl ${wide?"max-w-4xl":"max-w-2xl"} w-full mb-10 max-h-[88vh] flex flex-col`} onClick={e=>e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X size={18}/></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Inp = ({label,value,onChange,type="text",req,ph,opts,rows,disabled,err}) => {
  const base = `w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${err?"border-red-400 bg-red-50 focus:ring-red-500":"border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"} disabled:bg-gray-100`;
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{req && <span className="text-red-500 ml-0.5">*</span>}</label>}
      {opts ? <select value={value??""}onChange={e=>onChange(e.target.value)}className={base}disabled={disabled}><option value="">Select...</option>{(opts||[]).map(o=>typeof o==="string"?<option key={o}value={o}>{o}</option>:<option key={o.v}value={o.v}>{o.l}</option>)}</select>
      : rows ? <textarea value={value??""}onChange={e=>onChange(e.target.value)}rows={rows}className={base}placeholder={ph}disabled={disabled}/>
      : <input type={type}value={value??""}onChange={e=>onChange(e.target.value)}className={base}placeholder={ph}disabled={disabled}/>}
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
};

const Pages = ({total,pg,pp,set}) => {
  const tp = Math.max(1,Math.ceil(total/pp));
  if(tp<=1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>Showing {Math.min((pg-1)*pp+1,total)}–{Math.min(pg*pp,total)} of {total}</span>
      <div className="flex gap-1">
        <button onClick={()=>set(Math.max(1,pg-1))}disabled={pg<=1}className="px-2.5 py-1 rounded border hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={14}/></button>
        {Array.from({length:Math.min(tp,5)},(_,i)=>{const p=tp<=5?i+1:(pg<=3?i+1:Math.max(1,Math.min(pg-2+i,tp)));return <button key={p}onClick={()=>set(p)}className={`px-3 py-1 rounded border text-sm ${p===pg?"bg-blue-600 text-white border-blue-600":"hover:bg-gray-50"}`}>{p}</button>;})}
        <button onClick={()=>set(Math.min(tp,pg+1))}disabled={pg>=tp}className="px-2.5 py-1 rounded border hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={14}/></button>
      </div>
    </div>
  );
};

const Confirm = ({open,onClose,onOk,title,msg}) => {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{msg}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
          <button onClick={onOk} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
};

const EmptyRow = ({cols,msg="No data found"}) => <tr><td colSpan={cols} className="px-4 py-12 text-center text-gray-400">{msg}</td></tr>;

/* ================================================================
   MAIN APP COMPONENT
   ================================================================ */
export default function App() {
  /* --- Auth --- */
  const [user, setUser] = useState(null);
  const [lf, setLf] = useState({u:"",p:""});
  const [le, setLe] = useState("");

  /* --- Nav --- */
  const [pg, setPg] = useState("dashboard");
  const [mob, setMob] = useState(false);

  /* --- Data --- */
  const [vehicles, setVehicles] = useState(S_VEHICLES);
  const [customers, setCustomers] = useState(S_CUSTOMERS);
  const [bookings, setBookings] = useState(S_BOOKINGS);
  const [invoices, setInvoices] = useState(mkInvoices);
  const [settings, setSettings] = useState({...CFG});

  /* --- UI state --- */
  const [modal, setModal] = useState(null);
  const [fd, setFd] = useState({});
  const [fe, setFe] = useState({});
  const [del, setDel] = useState(null);
  const [srch, setSrch] = useState("");
  const [curPg, setCurPg] = useState(1);
  const [pp] = useState(10);
  const [sf, setSf] = useState(null);
  const [sd, setSd] = useState("asc");
  const [view, setView] = useState(null);
  const [rf, setRf] = useState({from:"",to:"",status:"",type:"",method:"",cust:""});
  const [rt, setRt] = useState("bookings");

  const nav = useCallback((p) => { setPg(p); setSrch(""); setCurPg(1); setSf(null); setModal(null); setView(null); setMob(false); setFe({}); },[]);

  /* --- Auth handlers --- */
  const login = () => {
    const u = AUTH_USERS.find(x => x.username===lf.u && x.password===lf.p);
    if(u){setUser(u);setLe("");setLf({u:"",p:""});}else setLe("Invalid username or password");
  };

  /* --- Sort --- */
  const sorted = useCallback((data,field,dir) => {
    if(!field) return data;
    return [...data].sort((a,b)=>{const av=a[field]??"",bv=b[field]??"";const c=typeof av==="number"?av-bv:String(av).localeCompare(String(bv));return dir==="asc"?c:-c;});
  },[]);

  const doSort = (f) => { if(sf===f)setSd(d=>d==="asc"?"desc":"asc"); else{setSf(f);setSd("asc");} setCurPg(1); };

  const TH = ({f,children}) => <th onClick={()=>doSort(f)} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"><div className="flex items-center gap-1">{children}<ArrowUpDown size={11} className="text-gray-300"/></div></th>;
  const THs = ({children}) => <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>;
  const THA = ({children}) => <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>;

  /* --- Lookups --- */
  const cn = (id) => customers.find(c=>c.id===id)?.name ?? "—";
  const vl = (id) => { const v=vehicles.find(x=>x.id===id); return v?`${v.brand} ${v.model} (${v.plate})`:"—"; };
  const vs = (id) => vehicles.find(x=>x.id===id);

  /* --- Permissions --- */
  const canEdit = user?.role==="Admin"||user?.role==="Executive";
  const isAdmin = user?.role==="Admin";

  /* --- Vehicle CRUD --- */
  const openVF = (v=null) => {
    setFd(v?{...v}:{plate:"",brand:"",model:"",type:"Sedan",fuel:"Petrol",seats:5,daily:"",hourly:"",color:"",year:new Date().getFullYear(),km:0,status:"Available",reg:"",ins_exp:"",svc_due:""});
    setFe({}); setModal(v?"ev":"av");
  };
  const saveV = () => {
    const e={};
    if(!(fd.plate||"").trim()) e.plate="Required";
    if(!(fd.brand||"").trim()) e.brand="Required";
    if(!(fd.model||"").trim()) e.model="Required";
    if(!pf(fd.daily)) e.daily="Required";
    if(vehicles.find(v=>v.plate===fd.plate&&v.id!==fd.id)) e.plate="Plate already exists";
    if(Object.keys(e).length){setFe(e);return;}
    const rec = {...fd,daily:pf(fd.daily),hourly:pf(fd.hourly),seats:parseInt(fd.seats)||5,km:parseInt(fd.km)||0,year:parseInt(fd.year)||2024};
    if(fd.id) setVehicles(p=>p.map(v=>v.id===fd.id?rec:v));
    else setVehicles(p=>[...p,{...rec,id:uid()}]);
    setModal(null);
  };
  const delV = (id) => {
    if(bookings.some(b=>b.vid===id&&["Confirmed","Ongoing"].includes(b.status))){alert("Cannot delete: active bookings exist");return;}
    setVehicles(p=>p.filter(v=>v.id!==id)); setDel(null);
  };

  /* --- Booking CRUD --- */
  const overlap = (vid,pu,rt,exId) => {
    const p=new Date(pu),r=new Date(rt);
    return bookings.some(b=>b.vid===vid&&b.id!==exId&&!["Cancelled","Completed"].includes(b.status)&&new Date(b.pickup)<r&&new Date(b.ret)>p);
  };
  const openBF = (b=null) => {
    const n=new Date(); const tm=new Date(n); tm.setDate(tm.getDate()+1);
    setFd(b?{...b}:{cid:"",vid:"",pickup:n.toISOString().slice(0,16),ret:tm.toISOString().slice(0,16),pickup_loc:"",drop_loc:"",status:"Confirmed",deposit:"",notes:"",phone:"",lic:""});
    setFe({}); setModal(b?"eb":"ab");
  };
  const saveB = () => {
    const e={};
    if(!fd.cid) e.cid="Select a customer";
    if(!fd.vid) e.vid="Select a vehicle";
    if(!fd.pickup) e.pickup="Required";
    if(!fd.ret) e.ret="Required";
    if(!(fd.pickup_loc||"").trim()) e.pickup_loc="Required";
    if(!(fd.phone||"").trim()) e.phone="Required";
    if(!(fd.lic||"").trim()) e.lic="Required";
    if(fd.pickup&&fd.ret&&new Date(fd.ret)<=new Date(fd.pickup)) e.ret="Must be after pickup date";
    if(fd.vid&&fd.pickup&&fd.ret&&overlap(fd.vid,fd.pickup,fd.ret,fd.id)) e.vid="Vehicle unavailable for these dates (double booking!)";
    if(Object.keys(e).length){setFe(e);return;}
    const n2=new Date();
    const bnum = `BK-${n2.getFullYear()}${String(n2.getMonth()+1).padStart(2,"0")}${String(n2.getDate()).padStart(2,"0")}-${String(bookings.length+1).padStart(3,"0")}`;
    if(fd.id) setBookings(p=>p.map(b=>b.id===fd.id?{...fd,deposit:pf(fd.deposit)}:b));
    else {
      setBookings(p=>[...p,{...fd,id:uid(),bid:bnum,deposit:pf(fd.deposit)}]);
      setVehicles(p=>p.map(v=>v.id===fd.vid?{...v,status:"Reserved"}:v));
    }
    setModal(null);
  };
  const updBS = (id,ns) => {
    setBookings(p=>p.map(b=>{
      if(b.id!==id)return b;
      const vs2 = ns==="Ongoing"?"Rented":(ns==="Completed"||ns==="Cancelled")?"Available":"Reserved";
      setVehicles(vp=>vp.map(v=>v.id===b.vid?{...v,status:vs2}:v));
      return {...b,status:ns};
    }));
  };
  const delB = (id) => {
    const b=bookings.find(x=>x.id===id);
    if(b&&["Confirmed","Ongoing"].includes(b.status)) setVehicles(p=>p.map(v=>v.id===b.vid?{...v,status:"Available"}:v));
    setBookings(p=>p.filter(x=>x.id!==id)); setDel(null);
  };

  /* --- Customer CRUD --- */
  const openCF = (c=null) => {
    setFd(c?{...c}:{name:"",email:"",phone:"",license:"",lic_exp:"",address:"",nationality:"",id_type:"Emirates ID",id_num:"",reg_date:new Date().toISOString()});
    setFe({}); setModal(c?"ec":"ac");
  };
  const saveC = () => {
    const e={};
    if(!(fd.name||"").trim()) e.name="Required";
    if(!(fd.phone||"").trim()) e.phone="Required";
    if(!(fd.license||"").trim()) e.license="Required";
    if(customers.find(c=>c.license===fd.license&&c.id!==fd.id)) e.license="License already exists";
    if(Object.keys(e).length){setFe(e);return;}
    if(fd.id) setCustomers(p=>p.map(c=>c.id===fd.id?{...fd}:c));
    else setCustomers(p=>[...p,{...fd,id:uid(),reg_date:new Date().toISOString()}]);
    setModal(null);
  };
  const delC = (id) => {
    if(bookings.some(b=>b.cid===id&&["Confirmed","Ongoing"].includes(b.status))){alert("Cannot delete: active bookings");return;}
    setCustomers(p=>p.filter(c=>c.id!==id)); setDel(null);
  };

  /* --- Invoice CRUD --- */
  const openIF = (inv=null) => {
    if(inv) setFd({...inv});
    else {
      const avail = bookings.filter(b=>b.status==="Completed"&&!invoices.some(i=>i.bid===b.id));
      setFd({bid:avail[0]?.id||"",late:0,fuel:0,xkm:0,taxRate:settings.tax,disc:0,method:"Cash",paid:0,_avail:avail});
    }
    setFe({}); setModal(inv?"ei":"ai");
  };
  const saveI = () => {
    const e={};
    if(!fd.bid) e.bid="Select a booking";
    if(Object.keys(e).length){setFe(e);return;}
    const bk=bookings.find(b=>b.id===fd.bid); const vh=vs(bk?.vid);
    const c = calcInv(bk,vh,fd);
    const pd = pf(fd.paid);
    const ps = pd>=c.grand?"Paid":pd>0?"Partially Paid":"Pending";
    const n2=new Date();
    const inum = `INV-${n2.getFullYear()}${String(n2.getMonth()+1).padStart(2,"0")}${String(n2.getDate()).padStart(2,"0")}-${String(invoices.length+1).padStart(3,"0")}`;
    const rec = {...c,bid:fd.bid,cid:bk?.cid,vid:bk?.vid,method:fd.method,pStatus:ps,paid:pd,bal:c.grand-pd,date:new Date().toISOString()};
    if(fd.id) setInvoices(p=>p.map(i=>i.id===fd.id?{...rec,id:fd.id,num:fd.num}:i));
    else setInvoices(p=>[...p,{...rec,id:uid(),num:inum}]);
    setModal(null);
  };

  /* --- Print invoice --- */
  const printInv = (inv) => {
    const bk=bookings.find(b=>b.id===inv.bid);
    const cu=customers.find(c=>c.id===inv.cid);
    const vh=vs(inv.vid);
    const w=window.open("","_blank","width=800,height=600");
    if(!w)return;
    w.document.write(`<!DOCTYPE html><html><head><title>${inv.num}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;color:#333;font-size:14px}.hdr{display:flex;justify-content:space-between;border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:24px}.co{font-size:26px;font-weight:700;color:#2563eb}.inv{font-size:18px;font-weight:700;text-align:right}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:10px 14px;text-align:left;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9;font-weight:600;font-size:13px;text-transform:uppercase;color:#475569}.tot{font-weight:700;font-size:16px;background:#eff6ff}.badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600}.paid{background:#dcfce7;color:#166534}.pend{background:#fef9c3;color:#854d0e}@media print{body{padding:20px}}</style></head><body>
    <div class="hdr"><div><div class="co">${settings.company}</div><div style="margin-top:4px;color:#64748b">Dubai, UAE | Car Rental Services</div></div><div class="inv"><div>${inv.num}</div><div style="font-size:14px;color:#64748b;margin-top:4px">Date: ${fDate(inv.date)}</div><div style="margin-top:8px"><span class="badge ${inv.pStatus==="Paid"?"paid":"pend"}">${inv.pStatus}</span></div></div></div>
    <table><tr><th colspan="2">Customer</th><th colspan="2">Vehicle</th></tr><tr><td>Name</td><td>${cu?.name??"—"}</td><td>Vehicle</td><td>${vh?.brand??""} ${vh?.model??""}</td></tr><tr><td>Phone</td><td>${bk?.phone??"—"}</td><td>Plate</td><td>${vh?.plate??"—"}</td></tr><tr><td>License</td><td>${bk?.lic??"—"}</td><td>Type</td><td>${vh?.type??"—"}</td></tr></table>
    <table><tr><th colspan="2">Rental Period</th></tr><tr><td>Pickup</td><td>${fDateTime(bk?.pickup)}</td></tr><tr><td>Return</td><td>${fDateTime(bk?.ret)}</td></tr><tr><td>Duration</td><td>${inv.days} day(s)</td></tr></table>
    <table><tr><th>Description</th><th style="text-align:right">Amount (${settings.currency})</th></tr>
    <tr><td>Base Charge (${inv.days} days x ${fMoney(vh?.daily)}/day)</td><td style="text-align:right">${fMoney(inv.base)}</td></tr>
    ${inv.late?`<tr><td>Late Return Fee</td><td style="text-align:right">${fMoney(inv.late)}</td></tr>`:""}
    ${inv.fuel?`<tr><td>Fuel Charge</td><td style="text-align:right">${fMoney(inv.fuel)}</td></tr>`:""}
    ${inv.xkm?`<tr><td>Extra KM Fee</td><td style="text-align:right">${fMoney(inv.xkm)}</td></tr>`:""}
    <tr><td><strong>Subtotal</strong></td><td style="text-align:right"><strong>${fMoney(inv.sub)}</strong></td></tr>
    <tr><td>VAT (${inv.taxRate}%)</td><td style="text-align:right">${fMoney(inv.tax)}</td></tr>
    ${inv.disc?`<tr><td>Discount (${inv.discPct}%)</td><td style="text-align:right;color:#16a34a">-${fMoney(inv.disc)}</td></tr>`:""}
    <tr class="tot"><td>GRAND TOTAL</td><td style="text-align:right">${fMoney(inv.grand)}</td></tr>
    <tr><td>Amount Paid</td><td style="text-align:right">${fMoney(inv.paid)}</td></tr>
    <tr style="font-weight:700"><td>Balance Due</td><td style="text-align:right">${fMoney(inv.bal)}</td></tr></table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">Payment: ${inv.method} | Generated by ${settings.company} v${settings.ver}</div>
    </body></html>`);
    w.document.close(); w.print();
  };

  /* --- CSV Export --- */
  const toCSV = (data,fn) => {
    if(!(data||[]).length) return;
    const k=Object.keys(data[0]);
    const csv=[k.join(","),...data.map(r=>k.map(key=>`"${String(r[key]??"").replace(/"/g,'""')}"`).join(","))].join("\n");
    const b=new Blob([csv],{type:"text/csv"});const u=URL.createObjectURL(b);
    const a=document.createElement("a");a.href=u;a.download=fn;a.click();URL.revokeObjectURL(u);
  };

  /* --- JSON backup --- */
  const exportAll = () => {
    const d={vehicles,customers,bookings,invoices,settings,at:new Date().toISOString()};
    const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});
    const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`carrental-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);
  };
  const importAll = (e) => {
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=(ev)=>{try{const d=JSON.parse(ev.target.result);if(d.vehicles)setVehicles(d.vehicles);if(d.customers)setCustomers(d.customers);if(d.bookings)setBookings(d.bookings);if(d.invoices)setInvoices(d.invoices);if(d.settings)setSettings(d.settings);alert("Data imported!");}catch{alert("Invalid JSON");}};
    r.readAsText(f);
  };

  /* ================================================================
     DASHBOARD COMPUTATIONS
     ================================================================ */
  const dash = useMemo(() => {
    const av=vehicles.filter(v=>v.status==="Available").length;
    const re=vehicles.filter(v=>v.status==="Rented").length;
    const mn=vehicles.filter(v=>v.status==="Under Maintenance").length;
    const act=bookings.filter(b=>b.status==="Ongoing").length;
    const td=now.toISOString().slice(0,10);
    const tdb=bookings.filter(b=>(b.pickup||"").slice(0,10)===td).length;
    const ms=new Date(now.getFullYear(),now.getMonth(),1);
    const mr=invoices.filter(i=>new Date(i.date)>=ms).reduce((s,i)=>s+pf(i.grand),0);
    const pend=invoices.filter(i=>i.pStatus!=="Paid").reduce((s,i)=>s+pf(i.bal),0);
    const util=vehicles.length?Math.round(re/vehicles.length*100):0;
    return {tot:vehicles.length,av,re,mn,act,tdb,mr,pend,util};
  },[vehicles,bookings,invoices]);

  const revChart = useMemo(() => {
    const m=[];
    for(let i=5;i>=0;i--){const d2=new Date(now.getFullYear(),now.getMonth()-i,1);const k=`${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,"0")}`;const l=d2.toLocaleDateString("en",{month:"short",year:"2-digit"});const r=invoices.filter(inv=>(inv.date||"").startsWith(k)).reduce((s,inv)=>s+pf(inv.grand),0);m.push({n:l,rev:Math.round(r)});}
    return m;
  },[invoices]);

  const typeChart = useMemo(()=>{const c={};vehicles.forEach(v=>{c[v.type]=(c[v.type]||0)+1;});return Object.entries(c).map(([n,v])=>({name:n,value:v}));},[vehicles]);
  const statusChart = useMemo(()=>{const c={};bookings.forEach(b=>{c[b.status]=(c[b.status]||0)+1;});return Object.entries(c).map(([n,v])=>({name:n,value:v}));},[bookings]);

  /* ================================================================
     LOGIN SCREEN
     ================================================================ */
  if(!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30"><Car size={36} className="text-white"/></div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{CFG.company}</h1>
          <p className="text-gray-400 text-sm mt-1">Car Rental Booking System v{CFG.ver}</p>
        </div>
        {le && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-red-200"><AlertTriangle size={16}/>{le}</div>}
        <div className="space-y-4">
          <Inp label="Username" value={lf.u} onChange={v=>setLf(p=>({...p,u:v}))} ph="Enter username"/>
          <Inp label="Password" type="password" value={lf.p} onChange={v=>setLf(p=>({...p,p:v}))} ph="Enter password"/>
          <button onClick={login} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25">Sign In</button>
        </div>
        <div className="mt-6 border-t pt-5">
          <p className="text-xs text-gray-400 text-center mb-3">Quick Login</p>
          <div className="grid grid-cols-3 gap-2">
            {AUTH_USERS.map(u=>(
              <button key={u.id} onClick={()=>setLf({u:u.username,p:u.password})} className="p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition-all text-center">
                <div className="font-bold text-xs text-slate-700">{u.role}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{u.username}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     NAV CONFIG
     ================================================================ */
  const navItems = [
    {id:"dashboard",l:"Dashboard",i:Home},
    {id:"vehicles",l:"Vehicles",i:Car},
    {id:"bookings",l:"Bookings",i:Calendar},
    {id:"customers",l:"Customers",i:Users},
    {id:"invoices",l:"Invoices",i:FileText},
    {id:"reports",l:"Reports",i:BarChart3,hide:user.role==="Executive"},
    {id:"settings",l:"Settings",i:Settings,hide:!isAdmin},
  ].filter(n=>!n.hide);

  /* ================================================================
     SIDEBAR
     ================================================================ */
  const Sidebar = ({mobile}) => (
    <div className={mobile?"fixed inset-0 z-50":"hidden md:flex"}>
      {mobile && <div className="fixed inset-0 bg-black/60" onClick={()=>setMob(false)}/>}
      <div className={`${mobile?"fixed left-0 top-0 h-full z-50":"relative"} w-64 bg-slate-800 text-white flex flex-col min-h-screen`}>
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Car size={20}/></div>
            <div><div className="font-bold text-sm">{settings.company}</div><div className="text-[11px] text-slate-400">v{settings.ver}</div></div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>nav(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${pg===n.id?"bg-blue-600 text-white shadow-lg shadow-blue-600/30":"text-slate-300 hover:bg-slate-700/70 hover:text-white"}`}>
              <n.i size={18}/>{n.l}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
            <div><div className="text-sm font-medium">{user.name}</div><div className="text-[11px] text-slate-400">{user.role}</div></div>
          </div>
          <button onClick={()=>setUser(null)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/70 rounded-xl transition-colors"><LogOut size={16}/>Sign Out</button>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     DASHBOARD PAGE
     ================================================================ */
  const DashPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card icon={Car} title="Total Fleet" val={dash.tot} sub={`${dash.av} available`} color="blue"/>
        <Card icon={Activity} title="Active Rentals" val={dash.act} sub="Ongoing" color="yellow"/>
        <Card icon={Calendar} title="Today" val={dash.tdb} sub="Bookings" color="purple"/>
        <Card icon={DollarSign} title="Monthly Rev." val={fMoney(dash.mr)} sub="This month" color="green"/>
        <Card icon={Clock} title="Pending" val={fMoney(dash.pend)} sub="Outstanding" color="red"/>
        <Card icon={Gauge} title="Utilization" val={`${dash.util}%`} sub="Fleet usage" color="cyan"/>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Revenue Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revChart}><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="n" fontSize={11} tick={{fill:"#94a3b8"}}/><YAxis fontSize={11} tick={{fill:"#94a3b8"}}/><Tooltip/><Area type="monotone" dataKey="rev" stroke="#2563eb" fill="url(#cg)" strokeWidth={2.5} name="Revenue"/></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Vehicle Types</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RPie><Pie data={typeChart} cx="50%" cy="50%" outerRadius={75} innerRadius={40} dataKey="value" label={({name,value})=>`${name}: ${value}`} fontSize={11}>
              {typeChart.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
            </Pie><Tooltip/><Legend iconSize={10} wrapperStyle={{fontSize:"12px"}}/></RPie>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Booking Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusChart}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" fontSize={11} tick={{fill:"#94a3b8"}}/><YAxis fontSize={11} tick={{fill:"#94a3b8"}}/><Tooltip/><Bar dataKey="value" radius={[6,6,0,0]} name="Count">
              {statusChart.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
            </Bar></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Recent Bookings</h3>
          <div className="space-y-2.5">
            {bookings.slice(0,6).map(b=>(
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div><div className="font-medium text-sm text-slate-800">{cn(b.cid)}</div><div className="text-xs text-gray-400">{vl(b.vid)}</div></div>
                <SBadge s={b.status}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================
     SEARCH BAR
     ================================================================ */
  const SearchBar = ({ph,right}) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={srch} onChange={e=>{setSrch(e.target.value);setCurPg(1);}} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder={ph}/>
      </div>
      <div className="flex gap-2">{right}</div>
    </div>
  );

  /* ================================================================
     VEHICLES PAGE
     ================================================================ */
  const VehPage = () => {
    const f = vehicles.filter(v=>!srch||[v.plate,v.brand,v.model,v.type,v.status,v.fuel].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase())));
    const s = sorted(f,sf,sd);
    const p = s.slice((curPg-1)*pp,curPg*pp);
    return (
      <div>
        <SearchBar ph="Search by plate, brand, model, type..." right={canEdit && <button onClick={()=>openVF()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"><Plus size={16}/>Add Vehicle</button>}/>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b"><tr>
              <TH f="plate">Plate</TH><TH f="brand">Brand</TH><TH f="model">Model</TH><TH f="type">Type</TH><TH f="fuel">Fuel</TH><TH f="daily">Rate/Day</TH><TH f="status">Status</TH><THA>Actions</THA>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {p.map(v=>(
                <tr key={v.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{v.plate}</td>
                  <td className="px-4 py-3">{v.brand}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3 text-xs">{v.fuel}</td>
                  <td className="px-4 py-3 font-medium">{fMoney(v.daily)}</td>
                  <td className="px-4 py-3"><SBadge s={v.status}/></td>
                  <td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end">
                    <button onClick={()=>setView({t:"vehicle",d:v})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Eye size={15}/></button>
                    {canEdit&&<button onClick={()=>openVF(v)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={15}/></button>}
                    {isAdmin&&<button onClick={()=>setDel({t:"vehicle",id:v.id,l:v.plate})} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={15}/></button>}
                  </div></td>
                </tr>
              ))}
              {!p.length && <EmptyRow cols={8} msg="No vehicles found"/>}
            </tbody>
          </table>
        </div>
        <Pages total={f.length} pg={curPg} pp={pp} set={setCurPg}/>
      </div>
    );
  };

  /* ================================================================
     BOOKINGS PAGE
     ================================================================ */
  const BkPage = () => {
    const f = bookings.filter(b=>!srch||[b.bid,cn(b.cid),vl(b.vid),b.status].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase())));
    const s = sorted(f,sf,sd);
    const p = s.slice((curPg-1)*pp,curPg*pp);
    return (
      <div>
        <SearchBar ph="Search by ID, customer, vehicle, status..." right={canEdit && <button onClick={()=>openBF()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"><Plus size={16}/>New Booking</button>}/>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b"><tr>
              <TH f="bid">Booking #</TH><THs>Customer</THs><THs>Vehicle</THs><TH f="pickup">Pickup</TH><TH f="ret">Return</TH><TH f="status">Status</TH><THA>Actions</THA>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {p.map(b=>(
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-blue-600">{b.bid}</td>
                  <td className="px-4 py-3">{cn(b.cid)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{vl(b.vid)}</td>
                  <td className="px-4 py-3 text-xs">{fDate(b.pickup)}</td>
                  <td className="px-4 py-3 text-xs">{fDate(b.ret)}</td>
                  <td className="px-4 py-3"><SBadge s={b.status}/></td>
                  <td className="px-4 py-3 text-right"><div className="flex gap-0.5 justify-end flex-wrap">
                    <button onClick={()=>setView({t:"booking",d:b})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="View"><Eye size={15}/></button>
                    {canEdit&&b.status==="Confirmed"&&<button onClick={()=>updBS(b.id,"Ongoing")} className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Start Rental"><PlayCircle size={15}/></button>}
                    {canEdit&&b.status==="Ongoing"&&<button onClick={()=>updBS(b.id,"Completed")} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Complete"><CheckCircle size={15}/></button>}
                    {canEdit&&b.status==="Confirmed"&&<button onClick={()=>updBS(b.id,"Cancelled")} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500" title="Cancel"><XCircle size={15}/></button>}
                    {canEdit&&b.status==="Confirmed"&&<button onClick={()=>openBF(b)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Edit"><Edit size={15}/></button>}
                    {isAdmin&&<button onClick={()=>setDel({t:"booking",id:b.id,l:b.bid})} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500" title="Delete"><Trash2 size={15}/></button>}
                  </div></td>
                </tr>
              ))}
              {!p.length && <EmptyRow cols={7}/>}
            </tbody>
          </table>
        </div>
        <Pages total={f.length} pg={curPg} pp={pp} set={setCurPg}/>
      </div>
    );
  };

  /* ================================================================
     CUSTOMERS PAGE
     ================================================================ */
  const CustPage = () => {
    const f = customers.filter(c=>!srch||[c.name,c.phone,c.email,c.license].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase())));
    const s = sorted(f,sf,sd);
    const p = s.slice((curPg-1)*pp,curPg*pp);
    return (
      <div>
        <SearchBar ph="Search by name, phone, email, license..." right={canEdit && <button onClick={()=>openCF()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"><Plus size={16}/>Add Customer</button>}/>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b"><tr>
              <TH f="name">Name</TH><THs>Phone</THs><THs>Email</THs><THs>License</THs><TH f="nationality">Country</TH><THs>History</THs><THA>Actions</THA>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {p.map(c=>{
                const trips=bookings.filter(b=>b.cid===c.id&&b.status==="Completed").length;
                const spent=invoices.filter(i=>i.cid===c.id).reduce((s2,i)=>s2+pf(i.paid),0);
                return (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.email||"—"}</td>
                    <td className="px-4 py-3 text-xs">{c.license}</td>
                    <td className="px-4 py-3">{c.nationality||"—"}</td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-500">{trips} trips · {fMoney(spent)}</span></td>
                    <td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end">
                      <button onClick={()=>setView({t:"customer",d:c})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><Eye size={15}/></button>
                      {canEdit&&<button onClick={()=>openCF(c)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={15}/></button>}
                      {isAdmin&&<button onClick={()=>setDel({t:"customer",id:c.id,l:c.name})} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={15}/></button>}
                    </div></td>
                  </tr>
                );
              })}
              {!p.length && <EmptyRow cols={7}/>}
            </tbody>
          </table>
        </div>
        <Pages total={f.length} pg={curPg} pp={pp} set={setCurPg}/>
      </div>
    );
  };

  /* ================================================================
     INVOICES PAGE
     ================================================================ */
  const InvPage = () => {
    const f = invoices.filter(i=>!srch||[i.num,cn(i.cid),i.pStatus,i.method].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase())));
    const s = sorted(f,sf||"date",sf?sd:"desc");
    const p = s.slice((curPg-1)*pp,curPg*pp);
    return (
      <div>
        <SearchBar ph="Search by invoice #, customer, status..." right={<>
          {canEdit&&<button onClick={()=>openIF()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"><Plus size={16}/>New Invoice</button>}
          <button onClick={()=>toCSV(invoices.map(i=>({Invoice:i.num,Customer:cn(i.cid),Vehicle:vl(i.vid),Total:i.grand,Paid:i.paid,Balance:i.bal,Method:i.method,Status:i.pStatus,Date:fDate(i.date)})),"invoices.csv")} className="flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm hover:bg-gray-50"><Download size={15}/>CSV</button>
        </>}/>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b"><tr>
              <TH f="num">Invoice #</TH><THs>Customer</THs><THs>Vehicle</THs><TH f="grand">Total</TH><TH f="pStatus">Status</TH><TH f="bal">Balance</TH><THA>Actions</THA>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {p.map(i=>(
                <tr key={i.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-blue-600">{i.num}</td>
                  <td className="px-4 py-3">{cn(i.cid)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{vl(i.vid)}</td>
                  <td className="px-4 py-3 font-medium">{fMoney(i.grand)}</td>
                  <td className="px-4 py-3"><SBadge s={i.pStatus}/></td>
                  <td className="px-4 py-3 font-medium">{pf(i.bal)>0?<span className="text-red-600">{fMoney(i.bal)}</span>:<span className="text-green-600">{fMoney(0)}</span>}</td>
                  <td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end">
                    <button onClick={()=>printInv(i)} className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Print PDF"><Printer size={15}/></button>
                    <button onClick={()=>setView({t:"invoice",d:i})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="View"><Eye size={15}/></button>
                    {canEdit&&<button onClick={()=>openIF(i)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Edit"><Edit size={15}/></button>}
                  </div></td>
                </tr>
              ))}
              {!p.length && <EmptyRow cols={7}/>}
            </tbody>
          </table>
        </div>
        <Pages total={f.length} pg={curPg} pp={pp} set={setCurPg}/>
      </div>
    );
  };

  /* ================================================================
     REPORTS PAGE
     ================================================================ */
  const RepPage = () => {
    const getData = () => {
      try {
        if(rt==="bookings") return bookings.filter(b=>{if(rf.from&&new Date(b.pickup)<new Date(rf.from))return false;if(rf.to&&new Date(b.pickup)>new Date(rf.to))return false;if(rf.status&&b.status!==rf.status)return false;return true;}).map(b=>({Booking:b.bid,Customer:cn(b.cid),Vehicle:vl(b.vid),Pickup:fDate(b.pickup),Return:fDate(b.ret),Status:b.status}));
        if(rt==="revenue") return invoices.filter(i=>{if(rf.from&&new Date(i.date)<new Date(rf.from))return false;if(rf.to&&new Date(i.date)>new Date(rf.to))return false;if(rf.method&&i.method!==rf.method)return false;return true;}).map(i=>({Invoice:i.num,Customer:cn(i.cid),Vehicle:vl(i.vid),Total:i.grand?.toFixed(2),Paid:i.paid?.toFixed(2),Balance:i.bal?.toFixed(2),Method:i.method,Status:i.pStatus}));
        if(rt==="vehicles") return vehicles.filter(v=>{if(rf.type&&v.type!==rf.type)return false;return true;}).map(v=>{const vb=bookings.filter(b=>b.vid===v.id&&b.status==="Completed");const td=vb.reduce((s2,b)=>s2+calcDays(b.pickup,b.ret),0);const tr2=invoices.filter(i=>i.vid===v.id).reduce((s2,i)=>s2+pf(i.grand),0);return{Plate:v.plate,Vehicle:`${v.brand} ${v.model}`,Type:v.type,Status:v.status,Bookings:vb.length,Days_Rented:td,Revenue:tr2.toFixed(2)};});
        if(rt==="outstanding") return invoices.filter(i=>i.pStatus!=="Paid").filter(i=>{if(rf.from&&new Date(i.date)<new Date(rf.from))return false;if(rf.to&&new Date(i.date)>new Date(rf.to))return false;return true;}).map(i=>({Invoice:i.num,Customer:cn(i.cid),Total:i.grand?.toFixed(2),Paid:i.paid?.toFixed(2),Balance:i.bal?.toFixed(2),Status:i.pStatus,Date:fDate(i.date)}));
        return [];
      } catch { return []; }
    };
    const rd = getData();
    return (
      <div>
        <div className="bg-white rounded-2xl border p-5 mb-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Inp label="Report" value={rt} onChange={setRt} opts={[{v:"bookings",l:"Bookings"},{v:"revenue",l:"Revenue"},{v:"vehicles",l:"Vehicle Utilization"},{v:"outstanding",l:"Outstanding"}]}/>
            <Inp label="From" type="date" value={rf.from} onChange={v=>setRf(p=>({...p,from:v}))}/>
            <Inp label="To" type="date" value={rf.to} onChange={v=>setRf(p=>({...p,to:v}))}/>
            {rt==="bookings"&&<Inp label="Status" value={rf.status} onChange={v=>setRf(p=>({...p,status:v}))} opts={["","Confirmed","Ongoing","Completed","Cancelled"]}/>}
            {rt==="revenue"&&<Inp label="Method" value={rf.method} onChange={v=>setRf(p=>({...p,method:v}))} opts={["","Cash","Card","Online Transfer","Bank Transfer"]}/>}
            {rt==="vehicles"&&<Inp label="Type" value={rf.type} onChange={v=>setRf(p=>({...p,type:v}))} opts={["","Hatchback","Sedan","SUV","Luxury","Van","Pickup"]}/>}
            <div className="flex items-end"><button onClick={()=>toCSV(rd,`${rt}-report.csv`)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 h-[42px]"><Download size={15}/>Export CSV</button></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
          <div className="p-4 border-b bg-gray-50/50"><span className="font-semibold text-slate-700 text-sm">{rd.length} records</span></div>
          {rd.length>0?(<table className="w-full text-sm"><thead className="bg-gray-50/80 border-b"><tr>{Object.keys(rd[0]||{}).map(k=><th key={k} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{k.replace(/_/g," ")}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{rd.slice(0,50).map((r,i)=><tr key={i} className="hover:bg-gray-50">{Object.values(r).map((v2,j)=><td key={j} className="px-4 py-3">{v2}</td>)}</tr>)}</tbody></table>)
          :<div className="p-12 text-center text-gray-400">No data for selected filters</div>}
        </div>
      </div>
    );
  };

  /* ================================================================
     SETTINGS PAGE
     ================================================================ */
  const SetPage = () => (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Company Settings</h3>
        <div className="grid gap-4">
          <Inp label="Company Name" value={settings.company} onChange={v=>setSettings(p=>({...p,company:v}))}/>
          <Inp label="Currency Code" value={settings.currency} onChange={v=>setSettings(p=>({...p,currency:v}))}/>
          <Inp label="Tax Rate (%)" type="number" value={settings.tax} onChange={v=>setSettings(p=>({...p,tax:pf(v)}))}/>
        </div>
      </div>
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Data Backup & Restore</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportAll} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Download size={16}/>Export All Data (JSON)</button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 cursor-pointer"><Upload size={16}/>Import Data (JSON)<input type="file" accept=".json" onChange={importAll} className="hidden"/></label>
        </div>
        <p className="text-xs text-gray-400 mt-3">Export saves everything. Import replaces all current data. Always keep backups!</p>
      </div>
    </div>
  );

  /* ================================================================
     VIEW DETAIL MODAL
     ================================================================ */
  const ViewModal = () => {
    if(!view) return null;
    const {t,d} = view;
    const rows = (()=>{
      if(t==="vehicle") return [["Plate",d.plate],["Brand",d.brand],["Model",d.model],["Type",d.type],["Fuel",d.fuel],["Seats",d.seats],["Daily Rate",fMoney(d.daily)],["Hourly Rate",fMoney(d.hourly)],["Color",d.color],["Year",d.year],["Mileage",`${d.km??0} km`],["Status",d.status],["Registration",d.reg],["Insurance Exp.",fDate(d.ins_exp)],["Service Due",fDate(d.svc_due)]];
      if(t==="booking") return [["Booking #",d.bid],["Customer",cn(d.cid)],["Vehicle",vl(d.vid)],["Pickup",fDateTime(d.pickup)],["Return",fDateTime(d.ret)],["Pickup Loc.",d.pickup_loc],["Drop Loc.",d.drop_loc||"Same"],["Status",d.status],["Phone",d.phone],["License",d.lic],["Deposit",fMoney(d.deposit)],["Notes",d.notes||"—"]];
      if(t==="customer"){const trips=bookings.filter(b=>b.cid===d.id&&b.status==="Completed").length;const sp2=invoices.filter(i=>i.cid===d.id).reduce((s2,i)=>s2+pf(i.paid),0);return [["Name",d.name],["Phone",d.phone],["Email",d.email||"—"],["License",d.license],["License Exp.",fDate(d.lic_exp)],["Address",d.address||"—"],["Nationality",d.nationality||"—"],["ID Type",d.id_type||"—"],["ID Number",d.id_num||"—"],["Registered",fDate(d.reg_date)],["Rentals",trips],["Total Spent",fMoney(sp2)]];}
      if(t==="invoice") return [["Invoice #",d.num],["Customer",cn(d.cid)],["Vehicle",vl(d.vid)],["Days",d.days],["Base",fMoney(d.base)],["Late Fee",fMoney(d.late)],["Fuel",fMoney(d.fuel)],["Extra KM",fMoney(d.xkm)],["Subtotal",fMoney(d.sub)],["Tax",`${fMoney(d.tax)} (${d.taxRate}%)`],["Discount",`${fMoney(d.disc)} (${d.discPct}%)`],["Grand Total",fMoney(d.grand)],["Paid",fMoney(d.paid)],["Balance",fMoney(d.bal)],["Method",d.method],["Status",d.pStatus],["Date",fDate(d.date)]];
      return [];
    })();
    return (
      <Modal open={true} onClose={()=>setView(null)} title={`${t.charAt(0).toUpperCase()+t.slice(1)} Details`}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {rows.map(([l,v],i)=><div key={i}><div className="text-xs text-gray-400 mb-0.5">{l}</div><div className="font-medium text-sm text-slate-800">{v}</div></div>)}
        </div>
        {t==="invoice"&&<div className="mt-5 pt-4 border-t"><button onClick={()=>{setView(null);printInv(d);}} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700"><Printer size={16}/>Print / Download PDF</button></div>}
      </Modal>
    );
  };

  /* ================================================================
     FORM MODALS
     ================================================================ */
  const VF = () => (
    <Modal open={modal==="av"||modal==="ev"} onClose={()=>setModal(null)} title={modal==="ev"?"Edit Vehicle":"Add Vehicle"} wide>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Inp label="Plate Number" value={fd.plate} onChange={v=>setFd(p=>({...p,plate:v}))} req ph="DXB-X-12345" err={fe.plate}/>
        <Inp label="Brand" value={fd.brand} onChange={v=>setFd(p=>({...p,brand:v}))} req ph="Toyota" err={fe.brand}/>
        <Inp label="Model" value={fd.model} onChange={v=>setFd(p=>({...p,model:v}))} req ph="Camry" err={fe.model}/>
        <Inp label="Type" value={fd.type} onChange={v=>setFd(p=>({...p,type:v}))} opts={["Hatchback","Sedan","SUV","Luxury","Van","Pickup"]} req/>
        <Inp label="Fuel" value={fd.fuel} onChange={v=>setFd(p=>({...p,fuel:v}))} opts={["Petrol","Diesel","Electric","Hybrid","CNG"]} req/>
        <Inp label="Seats" type="number" value={fd.seats} onChange={v=>setFd(p=>({...p,seats:v}))} req/>
        <Inp label="Daily Rate (AED)" type="number" value={fd.daily} onChange={v=>setFd(p=>({...p,daily:v}))} req err={fe.daily}/>
        <Inp label="Hourly Rate" type="number" value={fd.hourly} onChange={v=>setFd(p=>({...p,hourly:v}))}/>
        <Inp label="Color" value={fd.color} onChange={v=>setFd(p=>({...p,color:v}))}/>
        <Inp label="Year" type="number" value={fd.year} onChange={v=>setFd(p=>({...p,year:v}))}/>
        <Inp label="Mileage (km)" type="number" value={fd.km} onChange={v=>setFd(p=>({...p,km:v}))}/>
        <Inp label="Status" value={fd.status} onChange={v=>setFd(p=>({...p,status:v}))} opts={["Available","Reserved","Rented","Under Maintenance"]}/>
        <Inp label="Registration #" value={fd.reg} onChange={v=>setFd(p=>({...p,reg:v}))}/>
        <Inp label="Insurance Exp." type="date" value={(fd.ins_exp||"").slice(0,10)} onChange={v=>setFd(p=>({...p,ins_exp:v}))}/>
        <Inp label="Service Due" type="date" value={(fd.svc_due||"").slice(0,10)} onChange={v=>setFd(p=>({...p,svc_due:v}))}/>
      </div>
      <div className="flex justify-end gap-3 mt-6"><button onClick={()=>setModal(null)} className="px-4 py-2.5 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button><button onClick={saveV} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">Save Vehicle</button></div>
    </Modal>
  );

  const BF = () => {
    const av = vehicles.filter(v=>v.status==="Available"||v.id===fd.vid);
    const bkVeh = vs(fd.vid);
    const estDays = fd.pickup&&fd.ret ? calcDays(fd.pickup,fd.ret) : 0;
    const estCost = estDays * pf(bkVeh?.daily);
    return (
      <Modal open={modal==="ab"||modal==="eb"} onClose={()=>setModal(null)} title={modal==="eb"?"Edit Booking":"New Booking"} wide>
        <div className="grid grid-cols-2 gap-4">
          <Inp label="Customer" value={fd.cid} onChange={v=>{const c2=customers.find(x=>x.id===v);setFd(p=>({...p,cid:v,phone:c2?.phone||p.phone,lic:c2?.license||p.lic}));}} opts={customers.map(c=>({v:c.id,l:c.name}))} req err={fe.cid}/>
          <Inp label="Vehicle" value={fd.vid} onChange={v=>setFd(p=>({...p,vid:v}))} opts={av.map(v=>({v:v.id,l:`${v.brand} ${v.model} — ${v.plate} (${fMoney(v.daily)}/day)`}))} req err={fe.vid}/>
          <Inp label="Pickup Date & Time" type="datetime-local" value={(fd.pickup||"").slice(0,16)} onChange={v=>setFd(p=>({...p,pickup:v}))} req err={fe.pickup}/>
          <Inp label="Return Date & Time" type="datetime-local" value={(fd.ret||"").slice(0,16)} onChange={v=>setFd(p=>({...p,ret:v}))} req err={fe.ret}/>
          <Inp label="Pickup Location" value={fd.pickup_loc} onChange={v=>setFd(p=>({...p,pickup_loc:v}))} req ph="Office/Address" err={fe.pickup_loc}/>
          <Inp label="Drop Location" value={fd.drop_loc} onChange={v=>setFd(p=>({...p,drop_loc:v}))} ph="Same if empty"/>
          <Inp label="Contact Number" value={fd.phone} onChange={v=>setFd(p=>({...p,phone:v}))} req ph="+971..." err={fe.phone}/>
          <Inp label="Driving License" value={fd.lic} onChange={v=>setFd(p=>({...p,lic:v}))} req err={fe.lic}/>
          <Inp label="Security Deposit" type="number" value={fd.deposit} onChange={v=>setFd(p=>({...p,deposit:v}))} ph="0"/>
          <Inp label="Notes" value={fd.notes} onChange={v=>setFd(p=>({...p,notes:v}))} rows={2}/>
        </div>
        {estDays>0&&bkVeh&&<div className="mt-4 p-3.5 bg-blue-50 rounded-xl text-sm border border-blue-100"><strong>Estimate:</strong> {estDays} days × {fMoney(bkVeh.daily)} = <strong className="text-blue-700">{fMoney(estCost)}</strong> <span className="text-gray-500">+ {settings.tax}% VAT</span></div>}
        <div className="flex justify-end gap-3 mt-6"><button onClick={()=>setModal(null)} className="px-4 py-2.5 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button><button onClick={saveB} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">Save Booking</button></div>
      </Modal>
    );
  };

  const CF = () => (
    <Modal open={modal==="ac"||modal==="ec"} onClose={()=>setModal(null)} title={modal==="ec"?"Edit Customer":"Add Customer"} wide>
      <div className="grid grid-cols-2 gap-4">
        <Inp label="Full Name" value={fd.name} onChange={v=>setFd(p=>({...p,name:v}))} req err={fe.name}/>
        <Inp label="Phone" value={fd.phone} onChange={v=>setFd(p=>({...p,phone:v}))} req ph="+971..." err={fe.phone}/>
        <Inp label="Email" type="email" value={fd.email} onChange={v=>setFd(p=>({...p,email:v}))}/>
        <Inp label="License Number" value={fd.license} onChange={v=>setFd(p=>({...p,license:v}))} req err={fe.license}/>
        <Inp label="License Expiry" type="date" value={(fd.lic_exp||"").slice(0,10)} onChange={v=>setFd(p=>({...p,lic_exp:v}))}/>
        <Inp label="Nationality" value={fd.nationality} onChange={v=>setFd(p=>({...p,nationality:v}))}/>
        <Inp label="ID Type" value={fd.id_type} onChange={v=>setFd(p=>({...p,id_type:v}))} opts={["Emirates ID","Passport","National ID"]}/>
        <Inp label="ID Number" value={fd.id_num} onChange={v=>setFd(p=>({...p,id_num:v}))}/>
        <div className="col-span-2"><Inp label="Address" value={fd.address} onChange={v=>setFd(p=>({...p,address:v}))} rows={2}/></div>
      </div>
      <div className="flex justify-end gap-3 mt-6"><button onClick={()=>setModal(null)} className="px-4 py-2.5 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button><button onClick={saveC} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">Save Customer</button></div>
    </Modal>
  );

  const IF = () => {
    const avBk = fd._avail || bookings.filter(b=>b.status==="Completed");
    const selBk = bookings.find(b=>b.id===fd.bid);
    const selVh = vs(selBk?.vid);
    const calc = selBk&&selVh ? calcInv(selBk,selVh,fd) : null;
    return (
      <Modal open={modal==="ai"||modal==="ei"} onClose={()=>setModal(null)} title={modal==="ei"?"Edit Invoice":"Generate Invoice"} wide>
        <div className="grid grid-cols-2 gap-4">
          {!fd.id&&<Inp label="Booking" value={fd.bid} onChange={v=>setFd(p=>({...p,bid:v}))} opts={avBk.map(b=>({v:b.id,l:`${b.bid} — ${cn(b.cid)} (${vl(b.vid)})`}))} req err={fe.bid}/>}
          {fd.id&&<div><div className="text-xs text-gray-400">Invoice</div><div className="font-bold text-slate-800">{fd.num}</div></div>}
          <Inp label="Late Fee" type="number" value={fd.late} onChange={v=>setFd(p=>({...p,late:v}))}/>
          <Inp label="Fuel Charge" type="number" value={fd.fuel} onChange={v=>setFd(p=>({...p,fuel:v}))}/>
          <Inp label="Extra KM Fee" type="number" value={fd.xkm} onChange={v=>setFd(p=>({...p,xkm:v}))}/>
          <Inp label="Tax Rate (%)" type="number" value={fd.taxRate} onChange={v=>setFd(p=>({...p,taxRate:v}))}/>
          <Inp label="Discount (%)" type="number" value={fd.disc} onChange={v=>setFd(p=>({...p,disc:v}))}/>
          <Inp label="Payment Method" value={fd.method} onChange={v=>setFd(p=>({...p,method:v}))} opts={["Cash","Card","Online Transfer","Bank Transfer"]}/>
          <Inp label="Amount Paid" type="number" value={fd.paid} onChange={v=>setFd(p=>({...p,paid:v}))}/>
        </div>
        {calc&&<div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm space-y-1.5 border">
          <div className="flex justify-between"><span className="text-gray-600">Base ({calc.days} days × {fMoney(selVh?.daily)}/day)</span><span className="font-medium">{fMoney(calc.base)}</span></div>
          {pf(fd.late)>0&&<div className="flex justify-between"><span className="text-gray-600">Late Fee</span><span>{fMoney(calc.late)}</span></div>}
          {pf(fd.fuel)>0&&<div className="flex justify-between"><span className="text-gray-600">Fuel</span><span>{fMoney(calc.fuel)}</span></div>}
          {pf(fd.xkm)>0&&<div className="flex justify-between"><span className="text-gray-600">Extra KM</span><span>{fMoney(calc.xkm)}</span></div>}
          <div className="flex justify-between font-semibold border-t pt-1.5"><span>Subtotal</span><span>{fMoney(calc.sub)}</span></div>
          <div className="flex justify-between text-gray-600"><span>VAT ({calc.taxRate}%)</span><span>{fMoney(calc.tax)}</span></div>
          {calc.disc>0&&<div className="flex justify-between text-emerald-600"><span>Discount ({calc.discPct}%)</span><span>-{fMoney(calc.disc)}</span></div>}
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Grand Total</span><span className="text-blue-700">{fMoney(calc.grand)}</span></div>
        </div>}
        <div className="flex justify-end gap-3 mt-6"><button onClick={()=>setModal(null)} className="px-4 py-2.5 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button><button onClick={saveI} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">Save Invoice</button></div>
      </Modal>
    );
  };

  /* ================================================================
     MAIN LAYOUT
     ================================================================ */
  const titles = {dashboard:"Dashboard",vehicles:"Vehicle Management",bookings:"Booking Management",customers:"Customer Management",invoices:"Invoice Management",reports:"Reports & Analytics",settings:"Settings"};

  try {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar/>
        {mob&&<Sidebar mobile/>}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="bg-white border-b px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={()=>setMob(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl"><Menu size={20}/></button>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">{titles[pg]||"Dashboard"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden sm:block">{user.name}</span>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{user.name[0]}</div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {pg==="dashboard"&&<DashPage/>}
            {pg==="vehicles"&&<VehPage/>}
            {pg==="bookings"&&<BkPage/>}
            {pg==="customers"&&<CustPage/>}
            {pg==="invoices"&&<InvPage/>}
            {pg==="reports"&&<RepPage/>}
            {pg==="settings"&&<SetPage/>}
          </main>
        </div>
        <VF/><BF/><CF/><IF/><ViewModal/>
        <Confirm open={!!del} onClose={()=>setDel(null)} onOk={()=>{if(del?.t==="vehicle")delV(del.id);if(del?.t==="booking")delB(del.id);if(del?.t==="customer")delC(del.id);}} title={`Delete ${del?.t||"item"}?`} msg={`Are you sure you want to delete "${del?.l}"? This cannot be undone.`}/>
      </div>
    );
  } catch(err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg">
          <div className="flex items-center gap-3 mb-4"><AlertTriangle size={24} className="text-red-600"/><h1 className="text-xl font-bold text-red-600">Application Error</h1></div>
          <p className="text-gray-600 mb-4">Something went wrong. Please refresh the page or contact support.</p>
          <pre className="bg-gray-50 p-4 rounded-xl text-xs overflow-auto border text-red-700">{String(err?.message||err)}</pre>
          <button onClick={()=>window.location.reload()} className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium">Reload Page</button>
        </div>
      </div>
    );
  }
}
