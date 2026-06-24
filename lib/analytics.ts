import { Valuation, KPIData, CityStats, MonthlyData } from '@/types/valuation';

export function computeKPIs(data: Valuation[]): KPIData {
  return {
    total_valuations: data.length,
    portfolio_value: data.reduce((s, v) => s + (v.mb_research_value || 0), 0),
    buy_count: data.filter(v => v.recommendation_type === 'Buy').length,
    sell_count: data.filter(v => v.recommendation_type === 'Sell').length,
    investment_count: data.filter(v => v.recommendation_type === 'Investment').length,
    residential_count: data.filter(v => v.property_type === 'Residential').length,
    commercial_count: data.filter(v => v.property_type === 'Commercial').length,
  };
}

export function computeCityStats(data: Valuation[]): CityStats[] {
  const map = new Map<string, CityStats>();
  for (const v of data) {
    if (!map.has(v.city)) {
      map.set(v.city, { city: v.city, total: 0, residential: 0, commercial: 0, portfolio_value: 0, buy: 0, sell: 0, investment: 0 });
    }
    const s = map.get(v.city)!;
    s.total++;
    s.portfolio_value += v.mb_research_value || 0;
    if (v.property_type === 'Residential') s.residential++;
    else s.commercial++;
    if (v.recommendation_type === 'Buy') s.buy++;
    else if (v.recommendation_type === 'Sell') s.sell++;
    else s.investment++;
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function computeMonthlyData(data: Valuation[]): MonthlyData[] {
  const map = new Map<string, MonthlyData>();
  const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  for (const v of data) {
    const key = `${v.year}-${v.month}`;
    if (!map.has(key)) {
      map.set(key, { month: v.month, year: v.year, count: 0, buy: 0, sell: 0, investment: 0, residential: 0, commercial: 0, portfolio_value: 0 });
    }
    const m = map.get(key)!;
    m.count++;
    m.portfolio_value += v.mb_research_value || 0;
    if (v.recommendation_type === 'Buy') m.buy++;
    else if (v.recommendation_type === 'Sell') m.sell++;
    else m.investment++;
    if (v.property_type === 'Residential') m.residential++;
    else m.commercial++;
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
}

export function formatCrore(val: number): string {
  if (val >= 1e7) return `₹${(val / 1e7).toFixed(0)} Cr`;
  if (val >= 1e5) return `₹${(val / 1e5).toFixed(0)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
}
