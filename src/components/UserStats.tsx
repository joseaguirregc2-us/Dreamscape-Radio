import React, { useEffect, useState } from 'react';
import { globalAudioEngine } from '../audioEngine';
import { Activity, Clock, Heart, RefreshCw, BarChart2, Calendar, LayoutGrid } from 'lucide-react';

interface UserStatsProps {
  listenedHours: number;
  setListenedHours: React.Dispatch<React.SetStateAction<number>>;
  favoriteGenre: string;
  avgBPM: number;
  streakDays: number;
}

export const UserStats: React.FC<UserStatsProps> = ({
  listenedHours,
  setListenedHours,
  favoriteGenre,
  avgBPM,
  streakDays,
}) => {
  // Real-time listen accrual when active playing
  useEffect(() => {
    const timer = setInterval(() => {
      if (globalAudioEngine.isPlaying()) {
        // Increment Listening hours by small fraction (e.g., 1 sec = 0.00028 hrs)
        setListenedHours((prev) => parseFloat((prev + 0.00028).toFixed(5)));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [setListenedHours]);

  // Mock static historical activity logs
  const [logs] = useState([
    { id: 1, action: 'Sintonizó Canal "Neo-Seoul Raindrift"', time: 'Hace 3 minutos' },
    { id: 2, action: 'Mezcla compartida: "Tormenta Eléctrica en Berlín"', time: 'Hace 2 horas' },
    { id: 3, action: 'Activo temporizador inteligente de 45m', time: 'Ayer' },
    { id: 4, action: 'Conversación con Guía IA sobre Ambient Techno', time: 'Hace 2 días' },
    { id: 5, action: 'Suscrito con éxito a la versión Beta', time: 'Hace 12 días' },
  ]);

  // Weekly listening metrics (Study, Sleep, code, chill)
  const activityData = [
    { label: 'Lun', hrs: 4.2, color: 'from-cyan-500 to-blue-500' },
    { label: 'Mar', hrs: 5.5, color: 'from-purple-500 to-indigo-500' },
    { label: 'Mié', hrs: 3.1, color: 'from-pink-500 to-red-500' },
    { label: 'Jue', hrs: 6.8, color: 'from-teal-500 to-emerald-500' },
    { label: 'Vie', hrs: 4.9, color: 'from-yellow-500 to-orange-500' },
    { label: 'Sáb', hrs: 7.2, color: 'from-cyan-400 to-purple-400' },
    { label: 'Dom', hrs: 8.5, color: 'from-purple-500 to-pink-500' },
  ];

  const maxWeeklyHrs = 9.0;

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md space-y-6" id="stats-panel">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="font-sans font-medium text-slate-100 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-400" />
            Centro de Telemetría y Estadísticas
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Métricas de escucha en tiempo real e historial analítico
          </p>
        </div>
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
      </div>

      {/* METRIC CARD GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="stats-numbers-grid">
        <div className="bg-slate-950/85 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest">Horas de Radio</span>
            <Clock size={11} className="text-cyan-400" />
          </div>
          <p className="text-lg font-mono font-bold text-slate-100 leading-none">
            {listenedHours.toFixed(3)}
          </p>
          <p className="text-[9px] text-cyan-400/80 font-sans mt-1">Incrementando en directo</p>
        </div>

        <div className="bg-slate-950/85 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest">Estilo Favorito</span>
            <Heart size={11} className="text-pink-400" />
          </div>
          <p className="text-sm font-sans font-semibold text-slate-200 leading-none truncate pt-0.5">
            {favoriteGenre}
          </p>
          <p className="text-[9px] text-slate-500 font-sans mt-1">87% de las sesiones</p>
        </div>

        <div className="bg-slate-950/85 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest">BPM Promedio</span>
            <Activity size={11} className="text-purple-400" />
          </div>
          <p className="text-lg font-mono font-bold text-slate-100 leading-none">
            {avgBPM}
          </p>
          <p className="text-[9px] text-slate-500 font-sans mt-1">Rango Chill moderado</p>
        </div>

        <div className="bg-slate-950/85 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest">Racha Diaria</span>
            <Calendar size={11} className="text-emerald-400" />
          </div>
          <p className="text-lg font-mono font-bold text-slate-100 leading-none">
            {streakDays} días
          </p>
          <p className="text-[9px] text-emerald-400/80 font-sans mt-1">¡Nivel de enfoque Zen!</p>
        </div>
      </div>

      {/* CHART & LOGS SECTION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="stats-row-visualization">
        
        {/* GRAPH VIEW */}
        <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Actividad de Escucha Semanal</span>
            <span className="text-[9px] font-sans text-slate-500">Horas por día</span>
          </div>

          <div className="flex h-36 items-end justify-between px-1.5 pt-6" id="bars-chart-container">
            {activityData.map((day) => (
              <div key={day.label} className="flex flex-col items-center group w-7">
                <div className="relative w-full flex justify-center">
                  {/* Hover tooltip */}
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-950 text-slate-200 border border-slate-800 py-0.5 px-1.5 rounded font-mono text-[9px] pointer-events-none transition-opacity z-10">
                    {day.hrs}h
                  </span>
                  {/* Growing Bar */}
                  <div
                    style={{ height: `${(day.hrs / maxWeeklyHrs) * 95}px` }}
                    className={`w-4 rounded-t bg-gradient-to-t ${day.color} transition-all duration-500 ease-out shadow-sm shadow-slate-950/45`}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-2 font-semibold">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LOGS HISTORIAL VIEW */}
        <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Registro de Actividad Reciente</span>
            <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">LOG_STREAM</span>
          </div>

          <div className="space-y-1.5 flex-1 max-h-[110px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between items-center text-[10px] py-1 border-b border-slate-900/40">
                <span className="text-slate-300 truncate font-sans w-3/4">● {log.action}</span>
                <span className="text-slate-500 font-mono text-[9px] w-1/4 text-right shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
