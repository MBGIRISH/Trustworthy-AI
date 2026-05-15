'use client';

import { useState, useEffect } from 'react';
import type { VerificationState } from '@/hooks/useMockVerification';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { ChevronDown, Download, Filter, FileText, Search, Activity, Database, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface AuditTrailViewProps {
  state: VerificationState;
}

export function AuditTrailView({ state }: AuditTrailViewProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const filteredLogs = state.feedLog.filter((log) => {
    const matchesAgent = agentFilter === 'all' || log.agent === agentFilter;
    const matchesSearch = searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesSearch;
  });

  const uniqueAgents = [...new Set(state.feedLog.map(l => l.agent))];

  const claimTableData = state.claims.map((claim) => ({
    id: claim.id,
    type: claim.type,
    content: claim.content,
    factStatus: claim.factResult?.status || '—',
    mathStatus: claim.mathResult?.status || '—',
    codeStatus: claim.codeResult?.status || '—',
    standardStatus: claim.standardResult?.status || '—',
    reasoningStatus: claim.reasoningResult?.status || '—',
    finalStatus:
      claim.factResult?.status ||
      claim.mathResult?.status ||
      claim.codeResult?.status ||
      claim.standardResult?.status ||
      claim.reasoningResult?.status ||
      'verified',
    factEvidence: claim.factResult?.evidence || '',
    factSource: claim.factResult?.source || '',
    mathFormula: claim.mathResult?.formula || '',
    mathResult: claim.mathResult?.result || '',
    codeIssues: claim.codeResult?.issues || [],
    standardRef: claim.standardResult?.standard || '',
  }));

  const getStatusColor = (status: string) => {
    if (status === 'verified')
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    if (status === 'uncertain')
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    if (status === 'flagged')
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    return 'bg-gray-800/50 text-gray-400 border border-gray-700/50';
  };

  const getLogTypeColor = (agent: string) => {
    const colors: Record<string, string> = {
      'ORCHESTRATOR': 'text-red-400',
      'GENERATOR': 'text-red-300',
      'FACT_VERIFIER': 'text-green-400',
      'MATH_VALIDATOR': 'text-orange-400',
      'CODE_ANALYZER': 'text-red-500',
      'STANDARDS_AGENT': 'text-amber-400',
      'REASONING_AGENT': 'text-orange-500',
      'SAFETY_GATE': 'text-red-300',
      'CORRECTION_AGENT': 'text-green-300',
      'SYSTEM': 'text-gray-500',
    };
    return colors[agent] || 'text-gray-400';
  };

  const handleDownloadAudit = () => {
    const report = {
      reportType: 'Trustworthy AI Verification Audit Report',
      generatedAt: new Date().toISOString(),
      jobId: state.jobId,
      query: state.query,
      domain: state.domain,
      verdict: state.finalVerdict,
      compositeScore: state.finalScore,
      elapsedSeconds: state.elapsedSeconds,
      claims: state.claims,
      agents: state.agents.filter(a => a.confidence !== null).map(a => ({
        name: a.name,
        status: a.status,
        confidence: a.confidence,
        latency: a.latency,
        finding: a.finding,
      })),
      evidenceChain: state.evidenceChain,
      feedLog: state.feedLog,
      verdictScores: state.verdictScores,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trustworthy-ai-audit-${state.jobId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('audit-report-container');
    if (!element) return;

    try {
      const imgData = await htmlToImage.toPng(element, { backgroundColor: '#090000', pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let position = 0;
      let heightLeft = pdfHeight;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`trustworthy-ai-audit-${state.jobId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <div id="audit-report-container" className="p-8 bg-[#090000] border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle container glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <Database className="text-red-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Audit Trail</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-black/40 rounded-2xl p-6 border border-white/5">
              <div>
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Job ID</p>
                <p className="font-mono text-red-400 text-lg">{state.jobId}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Domain</p>
                <p className="text-white font-medium">{state.domain}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Verdict</p>
                <p className={`font-bold text-lg ${state.finalVerdict === 'APPROVED' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]' : state.finalVerdict === 'WARNING' ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}>
                  {state.finalVerdict} ({(state.finalScore * 100).toFixed(1)}%)
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Duration</p>
                <p className="font-mono text-gray-300 text-lg">{state.elapsedSeconds.toFixed(1)}s</p>
              </div>
            </div>
          </div>

          {/* Feed Log Timeline */}
          <div className="mb-12 border border-white/5 bg-black/40 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Activity size={14} className="text-red-500" />
                Pipeline Timeline ({filteredLogs.length} events)
              </h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono placeholder-gray-600 focus:border-red-500/50 focus:outline-none w-48 transition-colors"
                  />
                </div>
                <div className="relative">
                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono focus:border-red-500/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All Agents</option>
                    {uniqueAgents.map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    ))}
                  </select>
                  <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="p-5 max-h-[400px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 text-xs font-mono px-3 rounded hover:bg-white/[0.02] transition-colors">
                  <span className="text-gray-600 flex-shrink-0 w-20">{log.timestamp}</span>
                  <span className={`${getLogTypeColor(log.agent)} flex-shrink-0 w-32 font-bold tracking-wider`}>[{log.agent}]</span>
                  <span className="text-gray-300 flex-1 leading-relaxed">{log.message}</span>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No matching log entries</p>
                </div>
              )}
            </div>
          </div>

          {/* Raw Claim Map Table */}
          <div className="mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Database size={14} className="text-red-500" />
              Raw Claim Map ({claimTableData.length} claims)
            </h3>
            <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/40">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">ID</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Type</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Content</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Fact</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Math</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Code</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Stds</th>
                    <th className="text-left p-4 text-gray-500 font-mono tracking-widest uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claimTableData.map((claim, idx) => (
                    <tr
                      key={claim.id}
                      className="border-b border-white/5 hover:bg-white/[0.05] cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                    >
                      <td className="p-4 font-mono text-red-400 font-bold">{claim.id}</td>
                      <td className="p-4 text-gray-400 uppercase tracking-widest text-[10px]">{claim.type}</td>
                      <td className="p-4 text-gray-300 max-w-[200px] truncate">{claim.content}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${getStatusColor(claim.factStatus)}`}>{claim.factStatus}</span></td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${getStatusColor(claim.mathStatus)}`}>{claim.mathStatus}</span></td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${getStatusColor(claim.codeStatus)}`}>{claim.codeStatus}</span></td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${getStatusColor(claim.standardStatus)}`}>{claim.standardStatus}</span></td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider ${getStatusColor(claim.finalStatus)}`}>{claim.finalStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expandable Row Details */}
            {expandedRow !== null && claimTableData[expandedRow] && (
              <div className="mt-4 p-8 rounded-2xl border border-red-500/20 bg-red-950/20 animate-in slide-in-from-top-2 fade-in">
                <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
                  Claim Details
                  <span className="text-red-400 font-mono text-sm px-2 py-1 bg-red-500/10 rounded">{claimTableData[expandedRow].id}</span>
                </h4>
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Full Content</p>
                    <p className="text-gray-200 leading-relaxed p-4 bg-black/40 rounded-xl border border-white/5">{claimTableData[expandedRow].content}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {claimTableData[expandedRow].factStatus !== '—' && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Fact Verification</p>
                        <p className="text-gray-300 mb-2">
                          Source: <span className="text-red-400 font-mono text-xs">{claimTableData[expandedRow].factSource || 'N/A'}</span>
                        </p>
                        <p className="text-gray-300">
                          Status: <span className={claimTableData[expandedRow].factStatus === 'verified' ? 'text-green-400 font-bold' : 'text-orange-400 font-bold'}>{claimTableData[expandedRow].factStatus}</span>
                        </p>
                        {claimTableData[expandedRow].factEvidence && (
                          <p className="text-xs text-gray-400 mt-3 font-light leading-relaxed border-t border-white/5 pt-3">{claimTableData[expandedRow].factEvidence}</p>
                        )}
                      </div>
                    )}
                    {claimTableData[expandedRow].mathStatus !== '—' && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Math Validation</p>
                        <p className="text-gray-300 mb-2">
                          Formula: <span className="text-red-400 font-mono text-xs bg-red-500/10 px-1.5 py-0.5 rounded">{claimTableData[expandedRow].mathFormula || 'N/A'}</span>
                        </p>
                        <p className="text-gray-300">
                          Result: <span className="text-green-400 font-bold">{claimTableData[expandedRow].mathResult}</span>
                        </p>
                      </div>
                    )}
                    {claimTableData[expandedRow].codeIssues.length > 0 && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Code Issues</p>
                        <ul className="space-y-2">
                          {claimTableData[expandedRow].codeIssues.map((issue: string, i: number) => (
                            <li key={i} className="text-xs text-red-400 flex items-start gap-2">
                              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {claimTableData[expandedRow].standardStatus !== '—' && (
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Standards Reference</p>
                        <p className="text-gray-300 font-light leading-relaxed">{claimTableData[expandedRow].standardRef}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-2">Related Evidence</p>
                    <div className="space-y-2">
                      {state.evidenceChain
                        .filter(ev => ev.claim.toLowerCase().includes(claimTableData[expandedRow].content.slice(0, 30).toLowerCase()))
                        .map((ev, i) => (
                          <div key={i} className="text-xs text-gray-400 flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                            <span className="font-mono text-red-400 uppercase tracking-widest text-[10px] bg-red-500/10 px-2 py-1 rounded">{ev.source}</span>
                            {ev.supports ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                            <span className="truncate flex-1">{ev.claim}</span>
                            {ev.url && <a href={ev.url} className="text-red-500 hover:text-red-400 font-mono underline" target="_blank" rel="noopener noreferrer">source</a>}
                          </div>
                        ))
                      }
                      {state.evidenceChain.filter(ev => ev.claim.toLowerCase().includes(claimTableData[expandedRow].content.slice(0, 30).toLowerCase())).length === 0 && (
                        <p className="text-gray-600 text-xs italic">No specific evidence linked.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center sm:justify-start">
          <button
            onClick={handleDownloadAudit}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-red-500/30 text-white font-bold rounded-2xl text-sm transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-gray-400" />
            <span className="tracking-widest uppercase font-mono">Download JSON</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-2xl text-sm transition-all duration-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transform hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4" />
            <span className="tracking-widest uppercase font-mono">Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
