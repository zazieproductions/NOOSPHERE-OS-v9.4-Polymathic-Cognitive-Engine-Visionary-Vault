import React, { useState } from 'react';
import { CampaignMilestone } from '../../types';
import { CAMPAIGN_MILESTONES } from '../../data/campaignMilestones';
import { audioEngine } from '../../services/audioEngine';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Plus, 
  TrendingUp, 
  ShieldAlert, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const ChronotopeTimelineView: React.FC = () => {
  const [milestones, setMilestones] = useState<CampaignMilestone[]>(CAMPAIGN_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<CampaignMilestone>(CAMPAIGN_MILESTONES[1]);

  const handleSelectMilestone = (m: CampaignMilestone) => {
    setSelectedMilestone(m);
    audioEngine.playNodeBlip(800);
  };

  const getStatusBadge = (status: CampaignMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'active':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">In Orbit (Active)</span>;
      case 'queued':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">Queued</span>;
      case 'speculative':
        return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">Speculative Future</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070d] text-zinc-100 overflow-y-auto p-4 sm:p-6 font-mono-code space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 font-display uppercase tracking-wider">
              The Chronotope: Hyperstition Campaign Matrix
            </h2>
            <p className="text-[10px] text-zinc-400">
              Dimensional roadmap engineering self-fulfilling market inevitability
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-400 flex items-center space-x-2">
          <span>Total Timeline Velocity:</span>
          <span className="font-bold text-emerald-400">8.4x Compound Growth</span>
        </div>
      </div>

      {/* Interactive Timeline Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {milestones.map((m, idx) => {
          const isSelected = selectedMilestone.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => handleSelectMilestone(m)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-purple-500/60 shadow-xl shadow-purple-950/30 ring-1 ring-purple-500/30'
                  : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">{m.phase}</span>
                  {getStatusBadge(m.status)}
                </div>

                <h4 className={`text-xs font-bold leading-snug mt-1 ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                  {m.title}
                </h4>

                <div className="text-[10px] text-purple-400 font-semibold font-mono">
                  {m.codename}
                </div>

                <div className="text-[9px] text-zinc-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{m.timeframe}</span>
                </div>
              </div>

              {/* Virality target meter */}
              <div className="mt-4 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-[9px] text-zinc-400 mb-1">
                  <span>Virality Target</span>
                  <span className="font-bold text-emerald-400">{m.viralityTarget}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded overflow-hidden">
                  <div
                    style={{ width: `${m.viralityTarget}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Phase Deep Dive */}
      <div className="p-5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-widest block">
              {selectedMilestone.phase} // {selectedMilestone.codename}
            </span>
            <h3 className="text-base font-bold text-zinc-100 font-display mt-0.5">
              {selectedMilestone.title}
            </h3>
          </div>
          <div>{getStatusBadge(selectedMilestone.status)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Strategic Objective */}
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Core Objective
            </span>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {selectedMilestone.objective}
            </p>
          </div>

          {/* Semiotic Payload */}
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Semiotic Payload & Weaponization
            </span>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {selectedMilestone.semioticPayload}
            </p>
          </div>
        </div>

        {/* Milestone Key Performance Vectors */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2">
            Target Cognitive KPIs
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedMilestone.kpis.map((kpi, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block mb-1">{kpi.label}</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
