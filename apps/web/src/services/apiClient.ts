import axios from 'axios';
import { DailyCombo, SystemPerformanceMetrics, Candidate } from '@football/types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const apiClient = {
  async getTodayCombo(date?: string): Promise<DailyCombo> {
    const res = await axios.get(`${API_BASE}/combo/today`, { params: { date } });
    return res.data.data;
  },

  async getHistory(): Promise<DailyCombo[]> {
    const res = await axios.get(`${API_BASE}/combo/history`);
    return res.data.data;
  },

  async getPerformance(): Promise<SystemPerformanceMetrics> {
    const res = await axios.get(`${API_BASE}/admin/performance`, {
      headers: { 'x-admin-key': 'admin-secret-key-123' }
    });
    return res.data.data;
  },

  async getCandidates(date: string): Promise<Candidate[]> {
    const res = await axios.get(`${API_BASE}/admin/candidates/${date}`, {
      headers: { 'x-admin-key': 'admin-secret-key-123' }
    });
    return res.data.data;
  },

  async triggerAnalysis(date?: string): Promise<any> {
    const res = await axios.post(`${API_BASE}/admin/run-analysis`, { date }, {
      headers: { 'x-admin-key': 'admin-secret-key-123' }
    });
    return res.data;
  }
};

