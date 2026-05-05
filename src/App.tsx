/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Tv, 
  Menu, 
  X, 
  LayoutGrid, 
  List, 
  Radio, 
  Globe, 
  Info,
  ChevronRight,
  MonitorPlay,
  Play
} from 'lucide-react';
import { fetchM3U, type Channel } from './lib/m3uParser';
import { AdvancedPlayer } from './components/AdvancedPlayer';
import { cn } from './lib/utils';

const M3U_URL = 'https://bugsfreeweb.github.io/LiveTVCollector/LiveTV/Bangladesh/LiveTV.m3u';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileTab, setMobileTab] = useState<'channels' | 'categories' | 'search'>('channels');

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const data = await fetchM3U(M3U_URL);
      setChannels(data);
      if (data.length > 0) setSelectedChannel(data[0]);
      setIsLoading(false);
    };
    init();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(channels.map(c => c.category || 'General'));
    return ['All', ...Array.from(cats)].sort();
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || channel.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505]">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1], 
            rotate: [0, 90, 180, 270, 360],
            boxShadow: ["0 0 0px #3b82f6", "0 0 40px #3b82f6", "0 0 0px #3b82f6"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-brand-primary p-6 rounded-3xl bg-white/5 border border-white/10"
        >
          <MonitorPlay size={64} strokeWidth={1.5} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-3xl font-bold tracking-tighter text-white uppercase italic"
        >
          Podho <span className="text-brand-primary">TV</span>
        </motion.h1>
        <div className="mt-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-brand-primary"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-sans text-slate-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 glass-panel border-r border-white/5 flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-xl shadow-brand-primary/20">
              <MonitorPlay className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white italic">PODHO TV</h1>
          </div>

          <div className="relative group mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/40 focus:ring-4 ring-brand-primary/5 transition-all text-white placeholder-slate-600"
            />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Discovery</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all group",
                  activeCategory === cat 
                    ? "bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    activeCategory === cat ? "bg-brand-primary scale-125 shadow-[0_0_8px_#3b82f6]" : "bg-slate-700"
                  )} />
                  <span className="truncate">{cat}</span>
                </div>
                <ChevronRight size={14} className={cn("transition-transform", activeCategory === cat ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Live Infrastructure</p>
              <p className="text-[10px] text-brand-primary font-mono font-black uppercase">v2.4.0 • STABLE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Top Bar */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black shrink-0 relative z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <MonitorPlay className="text-white" size={16} />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white italic">PODHO</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setMobileTab('search')}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Active Stream Section - Always visible on desktop, dynamic on mobile */}
          <div className={cn(
            "shrink-0 bg-black pt-2 lg:pt-0",
            !selectedChannel && "hidden lg:block"
          )}>
            <div className="max-w-[1400px] mx-auto lg:p-6 lg:pb-0">
              {selectedChannel ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-zinc-900 lg:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
                    <AdvancedPlayer 
                      url={selectedChannel.url} 
                      title={selectedChannel.name}
                      poster={selectedChannel.logo}
                    />
                  </div>
                  
                  <div className="px-6 pb-4 lg:px-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/[0.03] border border-white/10 p-2 lg:p-3 flex items-center justify-center shrink-0">
                        {selectedChannel.logo ? (
                          <img src={selectedChannel.logo} alt={selectedChannel.name} className="w-full h-full object-contain" />
                        ) : (
                          <Tv className="text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg lg:text-2xl font-bold text-white tracking-tight truncate">{selectedChannel.name}</h2>
                          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1 shrink-0">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            Live
                          </div>
                        </div>
                        <p className="text-[10px] lg:text-xs text-brand-primary font-bold uppercase tracking-[0.2em] mt-0.5 opacity-80">
                          {selectedChannel.category || 'Standard Definition'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex aspect-video bg-zinc-900 rounded-3xl items-center justify-center border border-white/5 border-dashed">
                  <div className="text-center">
                    <Tv className="text-slate-800 mx-auto mb-4" size={64} />
                    <p className="text-slate-600 font-medium">Select a channel to begin transmission</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                    {activeCategory}
                    <span className="text-xs font-mono font-normal text-slate-600 bg-white/5 px-2 py-1 rounded-lg">
                      {filteredChannels.length} STREAMS
                    </span>
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all", 
                      viewMode === 'grid' ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all", 
                      viewMode === 'list' ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className={cn(
                "grid gap-4 lg:gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" 
                  : "grid-cols-1 md:grid-cols-2"
              )}>
                {filteredChannels.map((channel, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={cn(
                      "group relative text-left rounded-2xl transition-all duration-500",
                      selectedChannel?.id === channel.id
                        ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-[#050505]"
                        : "ring-1 ring-white/5 hover:ring-white/20"
                    )}
                  >
                    <div className={cn(
                      "flex flex-col h-full glass-card rounded-2xl overflow-hidden",
                      viewMode === 'list' && "flex-row items-center gap-4 p-4"
                    )}>
                      {viewMode === 'grid' && (
                        <div className="aspect-[16/10] bg-zinc-900 flex items-center justify-center p-6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          {channel.logo ? (
                            <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <Tv className="text-zinc-800 scale-150" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
                            <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl">
                              <Play className="fill-current ml-1" size={24} />
                            </div>
                          </div>
                        </div>
                      )}

                      {viewMode === 'list' && (
                        <div className="w-14 h-14 rounded-xl bg-white/5 p-3 flex items-center justify-center shrink-0 border border-white/10">
                          {channel.logo ? (
                            <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                          ) : (
                            <Tv size={20} className="text-slate-600" />
                          )}
                        </div>
                      )}

                      <div className={cn(
                        "p-4 flex-1 min-w-0 bg-gradient-to-b from-transparent to-white/[0.02]",
                        viewMode === 'list' && "p-0"
                      )}>
                        <h4 className="text-xs lg:text-sm font-bold text-slate-100 truncate group-hover:text-brand-primary transition-colors pr-8">
                          {channel.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6]/60">
                            {channel.category || 'LIVE'}
                          </span>
                        </div>
                      </div>

                      {selectedChannel?.id === channel.id && (
                        <div className="absolute top-3 right-3">
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="lg:hidden fixed right-0 top-0 bottom-0 w-80 glass-panel z-50 flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                  <h2 className="text-lg font-bold text-white tracking-widest uppercase italic">Categories</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl text-sm transition-all",
                        activeCategory === cat ? "bg-brand-primary text-white font-bold" : "text-slate-400 bg-white/5"
                      )}
                    >
                      {cat}
                      {activeCategory === cat && <ChevronRight size={16} />}
                    </button>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Search Bar (Conditional) */}
        {mobileTab === 'search' && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-zinc-900 border-t border-white/10 z-[60] flex items-center px-4 gap-3">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search channel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none"
                />
             </div>
             <button onClick={() => setMobileTab('channels')} className="text-brand-primary font-bold text-sm px-2">Done</button>
          </div>
        )}
      </main>
    </div>
  );
}
