'use client';

import { useEffect, useRef, useState } from 'react';
import type { VerificationState, AgentStatus } from '@/hooks/useMockVerification';
import { CheckCircle2, XCircle, Terminal, Activity, Cpu, Database } from 'lucide-react';

interface LiveDashboardViewProps {
  state: VerificationState;
}

export function LiveDashboardView({ state }: LiveDashboardViewProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [state.feedLog]);

  useEffect(() => {
    setDisplayedChars(0);
    let timer: NodeJS.Timeout;
    const interval = () => {
      setDisplayedChars((prev) => {
        if (prev < state.responseText.length) {
          timer = setTimeout(() => {
            interval();
          }, 15); // Faster typing effect for better feel
          return prev + 1;
        }
        return prev;
      });
    };
    interval();
    return () => clearTimeout(timer);
  }, [state.responseText]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const syntaxHighlight = (text: string) => {
    return text
      .replace(/("[\w-]+")(\s*:)/g, '<span class="text-red-400 font-bold">$1</span>$2')
      .replace(/(:?\s*"[^"]*")/g, '<span class="text-green-400">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/true|false|null/g, '<span class="text-orange-500 font-bold">$&</span>');
  };

  return (
    <div className="relative pt-20 pb-8 px-6 md:px-8 min-h-screen bg-[#090000] overflow-hidden">
      {/* Global Mouse Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 38, 38, 0.07), transparent 40%)`
        }}
      />

      {/* Futuristic Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Bar - Glassmorphism */}
        <div className="mb-8 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(220,38,38,0.05)] flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <Activity size={14} className="text-red-500 animate-pulse" />
                <span className="font-mono text-xs text-red-400 font-bold tracking-widest">
                  {state.jobId}
                </span>
              </div>
              <span className="px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase rounded-full bg-white/5 border border-white/10 text-gray-300">
                {state.domain}
              </span>
            </div>
            <p className="text-gray-300 text-sm md:text-base font-light border-l-2 border-red-500/50 pl-3">
              {state.query}
            </p>
          </div>
          
          <div className="flex items-center gap-8 bg-black/40 px-6 py-4 rounded-xl border border-white/5">
            <div className="text-center">
              <div className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                {formatTime(state.elapsedSeconds)}
              </div>
              <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mt-1">Elapsed</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Processing</span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          
          {/* Left Column - Agent Status Panel */}
          <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="text-red-500" size={18} />
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white drop-shadow-md">
                Agent Swarm Status
              </h3>
            </div>
            
            <div className="space-y-3">
              {state.agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`group relative p-4 rounded-xl border backdrop-blur-md transition-all duration-500 ${
                    agent.status === 'running'
                      ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.15)] scale-[1.02]'
                      : 'border-white/5 bg-black/40 hover:border-white/20'
                  }`}
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {agent.status === 'waiting' && (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                      {agent.status === 'running' && (
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 rounded-full border-2 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent animate-spin" />
                          <div className="absolute inset-1 rounded-full bg-red-500 animate-pulse" />
                        </div>
                      )}
                      {agent.status === 'passed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] flex-shrink-0" />
                      )}
                      {agent.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] flex-shrink-0" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white tracking-wide">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-light mt-0.5">
                        {agent.role}
                      </p>
                      {agent.finding && (
                        <p className="text-xs text-green-400 font-mono mt-2 bg-green-500/10 inline-block px-2 py-1 rounded border border-green-500/20">
                          {agent.finding}
                        </p>
                      )}
                    </div>

                    {/* Latency */}
                    {agent.latency && (
                      <div className="flex-shrink-0 bg-black/50 px-2 py-1 rounded border border-white/5">
                        <span className="text-xs font-mono text-gray-400">
                          {agent.latency}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for running agents */}
                  {agent.status === 'running' && (
                    <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-500 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Terminals */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
            
            {/* Terminal 1: Verification Feed */}
            <div className="group relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-gray-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300">
                    Live Telemetry Feed
                  </h3>
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                </div>
              </div>
              
              <div
                ref={feedRef}
                className="p-5 max-h-[300px] overflow-y-auto space-y-2 font-mono text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                {state.feedLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 animate-in slide-in-from-left-2 opacity-0 fade-in fill-mode-forwards"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="text-gray-600 flex-shrink-0">
                      {log.timestamp}
                    </span>
                    <span className={`font-bold tracking-wider flex-shrink-0 ${
                      log.agent === 'SYSTEM' ? 'text-gray-500' : 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'
                    }`}>
                      [{log.agent}]
                    </span>
                    <span className="text-gray-300 flex-1 leading-relaxed">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal 2: Response Generation */}
            <div className="group relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-orange-500/30">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-gray-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300">
                    Compiled Data Payload
                  </h3>
                </div>
              </div>
              
              <div className="p-5 max-h-[250px] overflow-auto scrollbar-thin scrollbar-thumb-white/10">
                <pre className="font-mono text-xs whitespace-pre-wrap break-words leading-relaxed">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(
                        state.responseText.slice(0, displayedChars)
                      ),
                    }}
                    className="text-gray-300"
                  />
                  {displayedChars < state.responseText.length && (
                    <span className="inline-block w-2 h-3 ml-1 bg-orange-500 animate-pulse"></span>
                  )}
                </pre>
              </div>
            </div>

            {/* Terminal 3: Verdict Preview */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                Confidence Matrix
              </h3>
              <div className="flex gap-3 flex-wrap">
                {state.agents.slice(1, 6).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col gap-1 px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition flex-1 min-w-[120px]"
                  >
                    <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">{agent.name.split(' ')[0]}</span>
                    <span className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                      {agent.confidence !== null
                        ? `${(agent.confidence * 100).toFixed(0)}%`
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
