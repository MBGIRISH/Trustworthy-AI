'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, CheckCircle, Sparkles, Terminal, ChevronDown } from 'lucide-react';

interface QuerySubmissionProps {
  onSubmit: (query: string, domain: string) => void;
  exampleQueries: Array<{
    title: string;
    domain: string;
    query: string;
  }>;
}

export function QuerySubmissionView({
  onSubmit,
  exampleQueries,
}: QuerySubmissionProps) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('Auto-Detect');
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const domains = [
    'Auto-Detect',
    'Structural Engineering',
    'Software Development',
    'Infrastructure & Energy',
    'Healthcare Systems',
    'Financial Modeling',
    'Standards Reference',
  ];

  const handleExampleClick = (index: number) => {
    const example = exampleQueries[index];
    setQuery(example.query);
    setDomain(example.domain);
    setSelectedExample(index);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query, domain);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090000] overflow-hidden selection:bg-red-500/30">
      {/* Global Mouse Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(220, 38, 38, 0.07), transparent 40%)`
        }}
      />

      {/* Futuristic Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Animated ambient glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-red-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[60%] w-[30rem] h-[30rem] bg-red-800/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-4">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center mb-4 relative group">
                {/* Logo Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-full"></div>
                <h1 className="relative text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-500 hover:scale-[1.02]">
                  <span className="text-white">Trustworthy</span>
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent"> AI</span>
                </h1>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                  Multi-Agent Technical Verification
                </h2>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light">
                  Enterprise-grade hallucination detection powered by 9 specialized verification agents. Real-time fact-checking, mathematical validation, and standards compliance in seconds.
                </p>
              </div>
            </div>

            {/* Stat Pills - Premium Glassmorphism */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
              {[
                { label: '9 Agents Online', icon: Zap },
                { label: '6 MCP Servers', icon: Shield },
                { label: '96.8% Verified', icon: CheckCircle },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="px-5 py-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-2 text-xs md:text-sm font-mono text-gray-300 hover:border-red-500/50 hover:bg-red-950/30 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                  >
                    <Icon size={16} className="text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                    {stat.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Query Input Area - Ultra Premium Terminal */}
          <div className="space-y-5 relative max-w-4xl mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative group bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_-15px_rgba(220,38,38,0.3)] transition-all duration-500 focus-within:border-red-500/50 focus-within:shadow-[0_0_60px_-15px_rgba(220,38,38,0.5)]">
              {/* Terminal header */}
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20"></div>
                </div>
                <div className="flex-1 text-center flex items-center justify-center gap-2">
                  <Terminal size={14} className="text-gray-500" />
                  <span className="text-xs font-mono text-gray-500">trustworthy_ai_terminal_v9.sh</span>
                </div>
              </div>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your technical query — engineering calculation, code snippet, standards reference, or any technical claim you need verified..."
                className="w-full min-h-[160px] md:min-h-[200px] px-6 py-5 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-sm resize-none"
                style={{ lineHeight: '1.6' }}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/50 to-orange-600/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="relative w-full px-5 py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500/50 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                >
                  {domains.map((d) => (
                    <option key={d} value={d} className="bg-gray-900">
                      {d}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!query.trim()}
                className="group relative px-8 py-4 rounded-xl disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100 overflow-hidden"
              >
                {/* Button background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-700 opacity-100 group-disabled:opacity-50 group-disabled:from-gray-800 group-disabled:to-gray-900"></div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,white_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>

                <div className="relative flex items-center gap-2 drop-shadow-md">
                  <Zap size={20} className={query.trim() ? "animate-pulse" : ""} />
                  INITIALIZE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Example Queries Section - Glassmorphic Cards */}
          <div className="space-y-6 mt-20 pt-16 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                  <Sparkles size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  Try an Example
                </h3>
                <p className="text-sm text-gray-500 mt-2 font-light">Select a pre-configured query to see the pipeline in action</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exampleQueries.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(idx)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden text-left backdrop-blur-xl ${
                    selectedExample === idx
                      ? 'border-red-500/50 bg-red-950/30 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)] transform -translate-y-1 scale-[1.02]'
                      : 'border-white/10 bg-white/[0.02] hover:border-red-500/30 hover:bg-red-950/20 hover:shadow-[0_0_25px_-5px_rgba(220,38,38,0.2)] hover:-translate-y-1'
                  }`}
                >
                  {/* Subtle sweep gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold tracking-wide">
                        {example.domain.split(' ')[0]}
                      </span>
                      {selectedExample === idx && (
                        <CheckCircle size={18} className="text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-red-100 transition-colors drop-shadow-sm">
                      {example.title}
                    </h4>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed line-clamp-2 font-light">
                      {example.query}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
            
            {[
              {
                icon: Zap,
                title: 'Instant Results',
                desc: '5-6 second turnaround with massively parallel LPU agent processing',
              },
              {
                icon: Shield,
                title: 'Enterprise Grade',
                desc: 'Bank-level security with a 9-agent deterministic verification pipeline',
              },
              {
                icon: CheckCircle,
                title: 'Proven Accuracy',
                desc: '96.8% verified confidence across 1,247+ complex technical domains',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="text-center space-y-4 group p-6 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-500">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:bg-red-500/20 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <Icon size={28} className="text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  </div>
                  <h4 className="font-bold text-white text-lg tracking-wide">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 py-8 mt-20 bg-black/40 backdrop-blur-md">
        <p className="text-center text-xs text-gray-500 font-mono tracking-widest">
          POWERED BY GROQ LPU · LANGGRAPH · 9-AGENT VERIFICATION PIPELINE
        </p>
      </div>
    </div>
  );
}
