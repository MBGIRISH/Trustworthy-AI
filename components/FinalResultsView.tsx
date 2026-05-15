'use client';

import { useState, useEffect } from 'react';
import type { VerificationState } from '@/hooks/useMockVerification';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, ThumbsUp, ThumbsDown, Download, ArrowRight, Copy, Check, Sparkles, Activity } from 'lucide-react';

interface FinalResultsViewProps {
  state: VerificationState;
  onNewQuery: () => void;
  onViewAudit: () => void;
}

export function FinalResultsView({
  state,
  onNewQuery,
  onViewAudit,
}: FinalResultsViewProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    let current = 0;
    const target = state.finalScore || 0;
    const interval = setInterval(() => {
      if (current < target) {
        current += 0.01;
        setAnimatedScore(Math.min(current, target));
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [state.finalScore]);

  // Agent chart data from real verdicts
  const chartData = state.agents
    .filter(a => ['fact-verifier', 'math-validator', 'code-analyzer', 'standards-agent', 'reasoning-agent'].includes(a.id))
    .map((agent) => ({
      name: agent.name.split(' ')[0],
      confidence: agent.confidence || 0,
    }));

  const domainWeightLabels: Record<string, Record<string, string>> = {
    'Structural Engineering': { Math: '30%', Standards: '25%', Reasoning: '15%', Fact: '15%', Code: '15%' },
    'Software Development': { Code: '45%', Reasoning: '25%', Math: '10%', Fact: '10%', Standards: '10%' },
    'Infrastructure & Energy': { Math: '35%', Standards: '25%', Reasoning: '20%', Fact: '15%', Code: '5%' },
    'Healthcare Systems': { Fact: '30%', Standards: '25%', Math: '25%', Reasoning: '10%', Code: '10%' },
    'Financial Modeling': { Math: '40%', Fact: '20%', Reasoning: '20%', Code: '10%', Standards: '10%' },
    'Standards Reference': { Standards: '50%', Fact: '20%', Math: '10%', Code: '10%', Reasoning: '10%' },
    'General Technical': { Fact: '20%', Math: '20%', Code: '20%', Standards: '20%', Reasoning: '20%' },
  };

  const weights = domainWeightLabels[state.domain] || domainWeightLabels['General Technical'];

  const verdictColor =
    state.finalVerdict === 'APPROVED'
      ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_40px_rgba(34,197,94,0.15)]'
      : state.finalVerdict === 'WARNING'
      ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_40px_rgba(249,115,22,0.15)]'
      : 'border-red-500/50 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.15)]';

  const verdictBgColor =
    state.finalVerdict === 'APPROVED'
      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
      : state.finalVerdict === 'WARNING'
      ? 'bg-gradient-to-r from-orange-500 to-yellow-400'
      : 'bg-gradient-to-r from-red-600 to-red-400';

  const verdictTextColor =
    state.finalVerdict === 'APPROVED'
      ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]'
      : state.finalVerdict === 'WARNING'
      ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]'
      : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]';

  const handleCopyReport = () => {
    const report = JSON.stringify({
      jobId: state.jobId,
      domain: state.domain,
      verdict: state.finalVerdict,
      score: state.finalScore,
      claims: state.claims.length,
      evidence: state.evidenceChain.length,
      agents: state.agents.filter(a => a.confidence !== null).map(a => ({ name: a.name, confidence: a.confidence, status: a.status })),
    }, null, 2);
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pt-20 pb-16 px-6 md:px-8 min-h-screen bg-[#090000] overflow-hidden">
      {/* Global Mouse Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 38, 38, 0.05), transparent 40%)`
        }}
      />

      {/* Futuristic Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Hero Verdict Banner - Glassmorphic */}
        <div className={`relative p-8 md:p-10 rounded-[2rem] border backdrop-blur-2xl transition-all duration-700 animate-in fade-in slide-in-from-top-8 ${verdictColor}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-[2rem] pointer-events-none"></div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles size={24} className={state.finalVerdict === 'APPROVED' ? 'text-green-400' : state.finalVerdict === 'WARNING' ? 'text-orange-400' : 'text-red-500'} />
                <h2 className={`text-6xl md:text-7xl font-black tracking-tighter ${verdictTextColor}`}>
                  {state.finalVerdict}
                </h2>
              </div>
              <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl">
                {state.finalVerdict === 'APPROVED'
                  ? 'All claims verified. Response is highly accurate and structurally sound.'
                  : state.finalVerdict === 'WARNING'
                  ? 'Some claims require attention. Review uncertainties before production use.'
                  : 'Critical issues detected. Response cannot be trusted in current state.'}
              </p>
              <div className="inline-flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full border border-white/10 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-2"><Activity size={14} className="text-red-400" /> {state.jobId}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>{state.domain}</span>
              </div>
            </div>
            
            <div className="text-right bg-black/40 p-6 rounded-3xl border border-white/5 min-w-[200px]">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Composite Score</p>
              <div className="text-7xl font-mono font-black text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {(animatedScore * 100).toFixed(1)}<span className="text-3xl text-gray-500">%</span>
              </div>
              <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${verdictBgColor} rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${animatedScore * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Composite Score Breakdown */}
          <div className="group relative border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl p-6 hover:border-red-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Activity size={14} className="text-red-500" />
              Score Breakdown
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" domain={[0, 1]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value) => [(value as number * 100).toFixed(1) + '%', 'Confidence']}
                  />
                  <Bar dataKey="confidence" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-3">
                Domain Weights Algorithm
              </p>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-gray-900 shadow-inner">
                {Object.entries(weights).map(([, pct], i) => {
                  const colors = ['bg-red-500', 'bg-orange-500', 'bg-red-400', 'bg-orange-400', 'bg-red-600'];
                  return <div key={i} className={`${colors[i]} relative group cursor-pointer`} style={{ width: pct }}>
                    <div className="absolute inset-0 bg-white/0 hover:bg-white/20 transition-colors"></div>
                  </div>;
                })}
              </div>
              <div className="text-[10px] text-gray-500 font-mono grid grid-cols-2 gap-2 mt-4">
                {Object.entries(weights).map(([name, pct]) => (
                  <div key={name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                    <span>{name}</span>
                    <span className="text-gray-300">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Verified Response */}
          <div className="group relative border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl p-6 hover:border-orange-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
              <span>Verified Response</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">{state.claims.length} claims</span>
            </h3>
            
            <div className="flex gap-4 text-[10px] font-mono tracking-wider mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" /><span className="text-gray-300">VERIFIED</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]" /><span className="text-gray-300">UNCERTAIN</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]" /><span className="text-gray-300">FLAGGED</span></div>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {state.claims.map((claim) => {
                const status =
                  claim.factResult?.status ||
                  claim.mathResult?.status ||
                  claim.codeResult?.status ||
                  claim.standardResult?.status ||
                  claim.reasoningResult?.status ||
                  'verified';
                const color =
                  status === 'verified' ? 'border-l-green-500 bg-gradient-to-r from-green-500/10'
                  : status === 'uncertain' ? 'border-l-orange-500 bg-gradient-to-r from-orange-500/10'
                  : 'border-l-red-500 bg-gradient-to-r from-red-500/10';

                return (
                  <div key={claim.id} className={`border-l-2 pl-4 py-3 rounded-r-xl ${color} to-transparent backdrop-blur-sm transition-all hover:translate-x-1`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-1.5 py-0.5 rounded uppercase tracking-wider">{claim.id}</span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{claim.type}</span>
                    </div>
                    <span className="text-sm text-gray-200 leading-relaxed font-light">{claim.content}</span>
                  </div>
                );
              })}
              {state.claims.length === 0 && (
                <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">No claims extracted</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Evidence Chain */}
          <div className="group relative border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl p-6 hover:border-red-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
              <span>Evidence Chain</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">{state.evidenceChain.length} sources</span>
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {state.evidenceChain.length > 0 ? (
                state.evidenceChain.map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors relative overflow-hidden group/ev">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500 to-orange-500 opacity-0 group-hover/ev:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded tracking-widest uppercase border border-red-500/20">
                        {ev.source}
                      </span>
                      {ev.supports ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <ThumbsUp className="w-3 h-3 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                          <ThumbsDown className="w-3 h-3 text-red-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed font-light">{ev.claim}</p>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-red-400 hover:text-red-300 truncate block bg-black/40 px-2 py-1.5 rounded"
                      >
                        {ev.url}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">No evidence collected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Futuristic */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/5">
          <button
            onClick={onNewQuery}
            className="flex-1 group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:bg-[length:200%_auto] text-white font-bold text-sm transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,white_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
            <span className="relative tracking-widest uppercase font-mono">New Query</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onViewAudit}
            className="flex-1 px-8 py-4 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-red-500/50 hover:bg-white/[0.05] text-white font-bold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
          >
            <span className="tracking-widest uppercase font-mono">View Full Audit Trail</span>
            <Download className="w-4 h-4 text-red-400" />
          </button>
          
          <button
            onClick={handleCopyReport}
            className="px-8 py-4 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-red-500/50 hover:bg-white/[0.05] text-white font-bold rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            <span className="tracking-widest uppercase font-mono">{copied ? 'Copied!' : 'Copy Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
