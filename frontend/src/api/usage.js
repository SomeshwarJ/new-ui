const BASE = '/api/usage';

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const get = async (path) => {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Usage API error: ${res.status}`);
    return res.json();
};

export const fetchUsageTotals = (days = 30) => get(`/totals?days=${days}`);
export const fetchUsageByModel = (days = 30) => get(`/by-model?days=${days}`);
export const fetchUsageByUser = (days = 30) => get(`/by-user?days=${days}`);
export const fetchUsageByProvider = (days = 30) => get(`/by-provider?days=${days}`);
export const fetchUsageByDepartment = (days = 30) => get(`/by-department?days=${days}`);
export const fetchUsageSummary = (days = 30) => get(`/summary?days=${days}`);
export const fetchUsageTimeline = (days = 30) => get(`/timeline?days=${days}`);
