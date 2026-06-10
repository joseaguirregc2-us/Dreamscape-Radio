import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Music4, Download, Radio, Sparkles, Check, Crown } from 'lucide-react';

interface AuthAndMonetizationProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const AuthAndMonetization: React.FC<AuthAndMonetizationProps> = ({
  userProfile,
  setUserProfile,
}) => {
  const togglePremium = () => {
    setUserProfile((prev) => ({
      ...prev,
      isPremium: !prev.isPremium,
    }));
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md space-y-6" id="monetization-widget">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="font-sans font-medium text-slate-100 flex items-center gap-2">
            <Crown size={18} className="text-yellow-400" />
            Membresía & Licencia Cyber-Radio
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Elige tu plan de acceso para Dreamscape Radio AI
          </p>
        </div>
        <button
          onClick={togglePremium}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-semibold border uppercase tracking-wider transition-all duration-300 ${
            userProfile.isPremium
              ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-450 z-20'
              : 'bg-slate-950 border-slate-850 text-slate-400'
          }`}
        >
          {userProfile.isPremium ? 'Membresía Activa' : 'Simular Compra'}
        </button>
      </div>

      {userProfile.isPremium ? (
        /* PREMIUM CONTENT STATUS CARD */
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-cyan-500/10 border border-yellow-500/35 rounded-xl space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="p-2 sm:p-2.5 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30">
              <Crown size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-slate-100 text-sm sm:text-base">¡Estás en modo Dreamscape Premium!</h3>
              <p className="text-xs text-slate-350 font-sans mt-1">
                Todas las restricciones de ancho de banda y acceso han sido desactivadas. Estás experimentando la radio en calidad espacial superior.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans text-slate-300 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <Check size={12} className="text-yellow-400" />
              <span>Audio Spatial FLAC habilitado</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className="text-yellow-400" />
              <span>Descargas Offline ilimitadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className="text-yellow-400" />
              <span>Cabina IA sin límites diarios</span>
            </div>
          </div>
        </div>
      ) : (
        /* PLANS COMPARISON TIERS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="pricing-tiers-grid">
          {/* FREE PLAN */}
          <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5 font-sans">
              <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest">Plan Actual</span>
              <h3 className="text-base font-semibold text-slate-300">Dreamscape Free</h3>
              <p className="text-xs text-slate-400">Escucha ilimitada con calidad estándar y soporte de red comunitario.</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-900 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check size={11} className="text-slate-500" />
                  <span>Radio infinita con sintesis procedural</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={11} className="text-slate-500" />
                  <span>Calidad de Audio Estándar (192kbps)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-550 line-through">
                  <span>Descargas offline</span>
                </div>
                <div className="flex items-center gap-2 text-slate-550 line-through">
                  <span>Radios personalizadas ilimitadas</span>
                </div>
              </div>
            </div>
            <span className="block text-center text-xs font-mono font-semibold py-2.5 text-slate-550 border border-slate-900 rounded-lg">
              Suscrito de por vida
            </span>
          </div>

          {/* PREMIUM PLAN */}
          <div className="p-4 bg-gradient-to-b from-purple-950/20 to-slate-950/80 border border-purple-550/30 rounded-xl space-y-4 flex flex-col justify-between relative overflow-hidden group">
            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="space-y-1.5 font-sans relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">Plan Avanzado</span>
                  <h3 className="text-base font-semibold text-purple-200">Dreamscape Premium</h3>
                </div>
                <span className="text-[10px] font-sans font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                  9.99 USD / mes
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Sintoniza la plataforma definitiva sin límites de concurrencia y calidad audiófila.</p>
              
              <div className="space-y-2 pt-3 border-t border-slate-900/60 text-xs text-slate-350">
                <div className="flex items-center gap-2 text-purple-300">
                  <Crown size={11} className="text-yellow-400" />
                  <span>Música FLAC de alta densidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download size={11} className="text-cyan-400" />
                  <span>Soporte de descargas offline habilitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={11} className="text-purple-400" />
                  <span>Cabina IA con respuestas rápidas prioritarias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio size={11} className="text-pink-400" />
                  <span>Guardado de radios ilimitados</span>
                </div>
              </div>
            </div>

            <button
              onClick={togglePremium}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-slate-950 font-sans font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide shadow-md shadow-pink-500/5 transition-all text-center active:scale-[0.98]"
              id="btn-buy-premium"
            >
              Adquirir Membresía Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
