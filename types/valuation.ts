export interface Valuation {
  id?: string;
  property_name: string; developer_name: string; city: string;
  property_type: 'Residential' | 'Commercial'; unit_type: string;
  sbua: number; carpet_area: number; received_date: string; sent_date: string;
  recommendation_type: 'Buy' | 'Sell' | 'Investment'; mb_research_value: number;
  month: string; year: number; quarter: string; created_at?: string;
}
export interface CityStats { city: string; total: number; residential: number; commercial: number; portfolio_value: number; buy: number; sell: number; investment: number; }
export interface KPIData { total_valuations: number; portfolio_value: number; buy_count: number; sell_count: number; investment_count: number; residential_count: number; commercial_count: number; }
export interface MonthlyData { month: string; year: number; count: number; buy: number; sell: number; investment: number; residential: number; commercial: number; portfolio_value: number; }
export interface EnquiryForm { name: string; company: string; email: string; phone: string; city: string; property_type: string; property_value: string; requirement: string; message: string; }
