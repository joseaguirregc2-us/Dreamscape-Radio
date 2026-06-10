import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Coins, 
  ArrowUpRight, 
  Download, 
  Sparkles, 
  Upload, 
  Tag, 
  CheckCircle,
  Plus
} from 'lucide-react';

interface ShopItem {
  id: string;
  title: string;
  category: 'Presets' | 'Loops' | 'Sample Packs' | 'Artwork';
  price: number;
  creator: string;
  downloads: number;
  rating: number;
  isPurchased?: boolean;
}

export const Marketplace: React.FC = () => {
  // Virtual Balance state (earned through listening milestones!)
  const [balance, setBalance] = useState<number>(350);
  const [purchasedIds, setPurchasedIds] = useState<string[]>(['it-1']);
  const [items, setItems] = useState<ShopItem[]>([
    { id: 'it-1', title: 'Deep space dub delay chords', category: 'Presets', price: 80, creator: 'Helix_Audio', downloads: 142, rating: 4.8 },
    { id: 'it-2', title: 'Analog Berlin Sub Kick Engine', category: 'Sample Packs', price: 150, creator: 'Kompakt_Wav', downloads: 98, rating: 4.9 },
    { id: 'it-3', title: 'Aurora high arpeggio loops', category: 'Loops', price: 100, creator: 'Celeste_9', downloads: 110, rating: 4.7 },
    { id: 'it-4', title: 'Titan heavy furnace percussions', category: 'Loops', price: 120, creator: 'Forge_Core', downloads: 88, rating: 4.5 },
    { id: 'it-5', title: 'Cosmic holographic art cover', category: 'Artwork', price: 60, creator: 'Prism_Space', downloads: 304, rating: 4.9 },
  ]);

  // Form states to upload custom sets
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<'Presets' | 'Loops' | 'Sample Packs'>('Presets');
  const [uploadPrice, setUploadPrice] = useState<number>(50);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const buyItem = (item: ShopItem) => {
    if (purchasedIds.includes(item.id)) return;
    if (balance < item.price) {
      alert('Créditos insuficientes. Sintoniza más tiempo los mundos para recolectar creditos.');
      return;
    }

    setBalance((prev) => prev - item.price);
    setPurchasedIds((prev) => [...prev, item.id]);
    
    // Simulate catalog downloads
    setItems((prev) => 
      prev.map((i) => i.id === item.id ? { ...i, downloads: i.downloads + 1 } : i)
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newItem: ShopItem = {
      id: Math.random().toString(),
      title: uploadTitle,
      category: uploadCategory,
      price: uploadPrice,
      creator: 'Jose_Gomez_X (Tú)',
      downloads: 0,
      rating: 5.0,
    };

    setItems((prev) => [newItem, ...prev]);
    setUploadTitle('');
    setSuccessMsg('¡Set comercializado con éxito! Los sintonizadores globales del Dreamscape Universe recibirán notificaciones para adquirirlo en breve.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const claimBonus = () => {
    setBalance((prev) => prev + 100);
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="marketplace-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-pink-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Frecuencia Co-op & Marketplace</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Adquiere o vende sintonías, bucles rítmicos y wallpapers holográficos con otros arquitectos del universo.</p>
        </div>

        {/* Currency Widget */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#17111b] border border-pink-500/25 px-3 py-1.5 rounded-full">
            <Coins size={14} className="text-pink-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-medium text-slate-400">Balance:</span>
            <span className="text-xs font-mono font-bold text-pink-300">{balance} OrbitCoins</span>
          </div>

          <button 
            onClick={claimBonus}
            className="text-[9.5px] font-mono bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors"
          >
            Obtener Bono Diario (+100)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Market Catalogs */}
        <div className="md:col-span-8 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5">Módulos Disponibles para Descargar</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="marketplace-items-grid">
            {items.map((item) => {
              const isPurchased = purchasedIds.includes(item.id);

              return (
                <div 
                  key={item.id}
                  className="bg-[#050608]/90 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-slate-850 cursor-default select-none relative"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] uppercase tracking-widest font-mono font-bold bg-white/[0.03] text-slate-400 border border-white/5 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Por @{item.creator}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight mt-3 leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Rating: ⭐ {item.rating.toFixed(1)} ({item.downloads} descargas)</p>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/[0.03]">
                    <div className="flex items-center gap-1">
                      <Coins size={11} className="text-pink-400" />
                      <span className="text-xs font-mono font-bold text-white">{item.price} <span className="text-[8px] text-pink-400/80 uppercase font-light">Coins</span></span>
                    </div>

                    <button
                      onClick={() => buyItem(item)}
                      disabled={isPurchased && item.category !== 'Artwork'}
                      className={`text-[10px] px-3.5 py-1.5 rounded-md cursor-pointer font-bold select-none transition-all flex items-center gap-1.5 ${
                        isPurchased 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                          : 'bg-pink-500 hover:bg-pink-600 border border-transparent text-white shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                      }`}
                    >
                      {isPurchased ? (
                        <>
                          <Download size={11} /> Descargar
                        </>
                      ) : (
                        'Adquirir'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sell Form Panel */}
        <div className="md:col-span-4 bg-[#0e1017]/50 rounded-xl p-5 border border-white/5 space-y-4" id="marketplace-sell-card">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5">Vender tu Composición</span>
            <p className="text-[10px] text-slate-400 leading-normal font-sans">Publica tus secuencias rítmicas para comercializarlas y recibir créditos automáticos.</p>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg text-xs leading-normal flex items-start gap-1.5 font-sans">
              <CheckCircle size={14} className="shrink-0 text-emerald-450 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-350 block font-sans">Título Comercial:</label>
              <input
                type="text"
                placeholder="ej: Secuencia de Óxido titan"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/50"
                id="input-sell-title"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-350 block font-sans">Categoría:</label>
              <select
                value={uploadCategory}
                onChange={(e: any) => setUploadCategory(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none cursor-pointer"
                id="select-sell-cat"
              >
                <option value="Presets">Parámetro Preset</option>
                <option value="Loops">Bucle Rítmico</option>
                <option value="Sample Packs">Paquete de Samples</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-350 block font-sans">Precio de Oferta:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={uploadPrice}
                  onChange={(e) => setUploadPrice(Number(e.target.value))}
                  className="w-24 text-xs bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
                  id="input-sell-price"
                />
                <span className="text-xs text-slate-400 font-mono font-medium uppercase">OrbitCoins</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/35 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              id="btn-sell-submit"
            >
              <Upload size={12} /> Publicar en el Universo
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
