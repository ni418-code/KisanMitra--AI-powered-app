import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Truck, Warehouse, Clock, ArrowRight } from 'lucide-react';

interface LogisticsStatusBannerProps {
  onGoToLogistics: () => void;
}

export const LogisticsStatusBanner: React.FC<LogisticsStatusBannerProps> = ({ onGoToLogistics }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    if (!user) return;
    const res = await api.getLogisticsTasks();
    if (res.success && res.data) setTasks(res.data.tasks || []);
  };

  useEffect(() => {
    fetchTasks();
    const onUpdated = () => fetchTasks();
    window.addEventListener('km-logistics-updated', onUpdated);
    const interval = setInterval(fetchTasks, 10000);
    return () => {
      window.removeEventListener('km-logistics-updated', onUpdated);
      clearInterval(interval);
    };
  }, [user]);

  const active = tasks.filter((task) => task.status === 'active');
  if (!user || active.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl bg-amber-50 border-2 border-amber-400 rounded-2xl shadow-2xl p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-amber-950 uppercase tracking-wider">Active Logistics / Storage Tracker</p>
            <p className="text-[11px] text-amber-900 mt-0.5">
              {active.length} task{active.length > 1 ? 's' : ''} still open — popup stays until the driver completes the ride / lot is stored.
            </p>
            <div className="mt-1.5 space-y-1">
              {active.map((task) => (
                <p key={task.id} className="text-[11px] text-slate-700 font-semibold flex items-center gap-1.5 truncate">
                  {task.type === 'transport' ? <Truck className="w-3.5 h-3.5 text-blue-700 shrink-0" /> : <Warehouse className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                  <span className="truncate">{task.title}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={onGoToLogistics} className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5">
          Open Logistics & Storage <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
