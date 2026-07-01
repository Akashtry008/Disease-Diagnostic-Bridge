import { FileText, ShieldAlert, Zap, Search, Award, ChevronRight, Beaker, BrainCircuit, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';

const DiagnosticReport = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', opacity: 0.5 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid var(--border)', borderRadius: '50%' }} />
          <div style={{ 
            position: 'absolute', top: 0, left: 0, 
            width: '48px', height: '48px', border: '4px solid var(--primary)', 
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
        <p className="label-xs" style={{ color: 'var(--text-secondary)' }}>Synthesizing Intelligence Report...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.05 }}>
        <Search size={80} />
        <p className="label-xs" style={{ marginTop: '1.5rem' }}>Awaiting Signal Input</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '8rem' }}
    >
      {data.plainLanguage && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquareText size={18} />
            </div>
            <h3 className="label-xs" style={{ color: '#3b82f6', letterSpacing: '0.1em' }}>Patient & Caregiver Translation (Simple English)</h3>
          </div>
          <div className="card-pro" style={{ padding: '2rem 2.5rem', borderLeft: '4px solid #3b82f6', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.02)', boxShadow: '0 4px 20px -2px rgba(59, 130, 246, 0.05)' }}>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e3a8a' }}>{data.plainLanguage.title}</h4>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 400 }}>
              {data.plainLanguage.description.split(/(\*\*.*?\*\*)/g).map((chunk, ci) => {
                if (chunk.startsWith('**') && chunk.endsWith('**')) {
                  return <strong key={ci} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{chunk.slice(2, -2)}</strong>;
                }
                return chunk;
              })}
            </p>
            {data.plainLanguage.whatToDo && (
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(59, 130, 246, 0.06)', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                <p style={{ fontSize: '0.95rem', color: '#1e40af', fontWeight: 500, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>Recommended Next Step:</span>
                  {data.plainLanguage.whatToDo}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} />
          </div>
          <h3 className="label-xs" style={{ color: 'var(--text-secondary)' }}>01 / Clinical Summary</h3>
        </div>
        <div className="card-pro" style={{ padding: '2.5rem' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 400, color: 'var(--text-primary)' }}>{data.summary}</p>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} />
          </div>
          <h3 className="label-xs" style={{ color: 'var(--text-secondary)' }}>02 / Diagnostic Details</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {data.matches.map((match, idx) => (
            <div key={idx} className="card-pro">
              <div className="report-header-flex" style={{ marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{match.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} color="var(--primary)" />
                    <span className="label-xs" style={{ color: 'var(--primary)' }}>Validated Peer-Reviewed Match</span>
                  </div>
                </div>
                <span className="badge-pro" style={{ 
                  background: match.confidence === 'HIGH' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.05)', 
                  color: match.confidence === 'HIGH' ? 'var(--primary)' : '#ef4444',
                  border: '1px solid currentColor'
                }}>
                  {match.confidence} CONFIDENCE
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {match.evidence.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div className="dot-indicator" style={{ marginTop: '0.6rem', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {ev.split(/(\[.*?\])/).map((part, pi) => 
                        part.startsWith('[') ? (
                          <span key={pi} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>
                            {part}
                          </span>
                        ) : part
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {match.contraindications && (
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <ChevronRight size={18} color="var(--primary)" />
                    <h5 className="label-xs" style={{ color: 'var(--text-primary)' }}>Differential Analysis</h5>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', paddingLeft: '2rem', lineHeight: 1.5 }}>
                    {match.contraindications}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {data.recommendedTests && data.recommendedTests.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Beaker size={18} />
            </div>
            <h3 className="label-xs" style={{ color: 'var(--text-secondary)' }}>03 / Recommended Diagnostic Pathway</h3>
          </div>
          <div className="card-pro" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.recommendedTests.map((test, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="dot-indicator" style={{ marginTop: '0.5rem', flexShrink: 0, background: 'var(--primary)' }} />
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{test}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.clinicalReasoning && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={18} />
            </div>
            <h3 className="label-xs" style={{ color: 'var(--text-secondary)' }}>04 / Clinical Reasoning Pathway</h3>
          </div>
          <div className="card-pro" style={{ padding: '2rem', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {data.clinicalReasoning}
            </p>
          </div>
        </section>
      )}

      <section>
        <div className="card-pro disclaimer-card-layout" style={{ backgroundColor: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '2rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h4 className="label-xs" style={{ color: '#ef4444', marginBottom: '0.4rem' }}>Clinical Disclaimer</h4>
            <p style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.5 }}>
              This research synthesis is generated by an autonomous system for educational triangulation only. It is not a clinical diagnosis. Final determination must be made by a board-certified medical professional.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default DiagnosticReport;
