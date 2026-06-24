import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Valuation } from '@/types/valuation';

interface AppStore {
  valuations: Valuation[];
  isLoggedIn: boolean;
  analystEmail: string;
  setValuations: (v: Valuation[]) => void;
  addValuations: (v: Valuation[]) => void;
  login: (email: string) => void;
  logout: () => void;
}

const DEMO_DATA: Valuation[] = [
  { property_name:'Prestige Towers A-101', developer_name:'Prestige Group', city:'Mumbai', property_type:'Commercial', unit_type:'Office', sbua:2500, carpet_area:1800, received_date:'2025-01-10', sent_date:'2025-01-13', recommendation_type:'Buy', mb_research_value:45000000, month:'January', year:2025, quarter:'Q1' },
  { property_name:'DLF Park Place 503', developer_name:'DLF', city:'Gurugram', property_type:'Residential', unit_type:'3 BHK', sbua:1850, carpet_area:1320, received_date:'2025-01-14', sent_date:'2025-01-17', recommendation_type:'Investment', mb_research_value:18500000, month:'January', year:2025, quarter:'Q1' },
  { property_name:'Brigade Metropolis 12C', developer_name:'Brigade Group', city:'Bengaluru', property_type:'Residential', unit_type:'2 BHK', sbua:1200, carpet_area:890, received_date:'2025-02-05', sent_date:'2025-02-08', recommendation_type:'Buy', mb_research_value:9800000, month:'February', year:2025, quarter:'Q1' },
  { property_name:'Phoenix Market City 4F', developer_name:'Phoenix Mills', city:'Pune', property_type:'Commercial', unit_type:'Office', sbua:4200, carpet_area:3100, received_date:'2025-02-10', sent_date:'2025-02-14', recommendation_type:'Investment', mb_research_value:75000000, month:'February', year:2025, quarter:'Q1' },
  { property_name:'Godrej Infinity 8B', developer_name:'Godrej Properties', city:'Pune', property_type:'Residential', unit_type:'2 BHK', sbua:1050, carpet_area:780, received_date:'2025-03-01', sent_date:'2025-03-04', recommendation_type:'Buy', mb_research_value:7200000, month:'March', year:2025, quarter:'Q1' },
  { property_name:'Sobha City Tower 5', developer_name:'Sobha Group', city:'Gurugram', property_type:'Residential', unit_type:'4 BHK', sbua:3200, carpet_area:2400, received_date:'2025-03-10', sent_date:'2025-03-13', recommendation_type:'Buy', mb_research_value:32000000, month:'March', year:2025, quarter:'Q1' },
  { property_name:'Embassy Golf Links', developer_name:'Embassy Group', city:'Bengaluru', property_type:'Commercial', unit_type:'Office', sbua:8500, carpet_area:7100, received_date:'2025-04-01', sent_date:'2025-04-04', recommendation_type:'Investment', mb_research_value:280000000, month:'April', year:2025, quarter:'Q2' },
  { property_name:'Lodha World One 42F', developer_name:'Lodha Group', city:'Mumbai', property_type:'Residential', unit_type:'3 BHK', sbua:2100, carpet_area:1550, received_date:'2025-04-12', sent_date:'2025-04-15', recommendation_type:'Sell', mb_research_value:62000000, month:'April', year:2025, quarter:'Q2' },
  { property_name:'Oberoi Exquisite B-702', developer_name:'Oberoi Realty', city:'Mumbai', property_type:'Residential', unit_type:'4 BHK', sbua:3100, carpet_area:2300, received_date:'2025-05-01', sent_date:'2025-05-05', recommendation_type:'Sell', mb_research_value:58000000, month:'May', year:2025, quarter:'Q2' },
  { property_name:'Hiranandani Gardens 3A', developer_name:'Hiranandani', city:'Mumbai', property_type:'Residential', unit_type:'2 BHK', sbua:980, carpet_area:720, received_date:'2025-05-08', sent_date:'2025-05-11', recommendation_type:'Buy', mb_research_value:14500000, month:'May', year:2025, quarter:'Q2' },
  { property_name:'RMZ Millenia Park', developer_name:'RMZ Corp', city:'Chennai', property_type:'Commercial', unit_type:'Office', sbua:6200, carpet_area:5100, received_date:'2025-05-15', sent_date:'2025-05-19', recommendation_type:'Investment', mb_research_value:195000000, month:'May', year:2025, quarter:'Q2' },
  { property_name:'Omkar Alta Monte 901', developer_name:'Omkar Realtors', city:'Mumbai', property_type:'Residential', unit_type:'3 BHK', sbua:1800, carpet_area:1340, received_date:'2025-06-01', sent_date:'2025-06-04', recommendation_type:'Buy', mb_research_value:38000000, month:'June', year:2025, quarter:'Q2' },
  { property_name:'Prestige Kew Gardens', developer_name:'Prestige Group', city:'Bengaluru', property_type:'Residential', unit_type:'2 BHK', sbua:1350, carpet_area:1000, received_date:'2025-06-08', sent_date:'2025-06-11', recommendation_type:'Investment', mb_research_value:11200000, month:'June', year:2025, quarter:'Q2' },
  { property_name:'DLF Cyber City Block C', developer_name:'DLF', city:'Gurugram', property_type:'Commercial', unit_type:'Office', sbua:12000, carpet_area:10200, received_date:'2025-06-14', sent_date:'2025-06-18', recommendation_type:'Buy', mb_research_value:420000000, month:'June', year:2025, quarter:'Q2' },
  { property_name:'Shapoorji Pallonji 12B', developer_name:'SP Group', city:'Pune', property_type:'Residential', unit_type:'3 BHK', sbua:1650, carpet_area:1220, received_date:'2025-06-20', sent_date:'2025-06-23', recommendation_type:'Sell', mb_research_value:17800000, month:'June', year:2025, quarter:'Q2' },
];

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      valuations: DEMO_DATA,
      isLoggedIn: false,
      analystEmail: '',
      setValuations: (v) => set({ valuations: v }),
      addValuations: (v) => set({ valuations: [...get().valuations, ...v] }),
      login: (email) => set({ isLoggedIn: true, analystEmail: email }),
      logout: () => set({ isLoggedIn: false, analystEmail: '' }),
    }),
    { name: 'mb-research-store', partialize: (s) => ({ valuations: s.valuations, isLoggedIn: s.isLoggedIn, analystEmail: s.analystEmail }) }
  )
);
