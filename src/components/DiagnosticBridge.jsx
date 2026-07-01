import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, Activity, Printer, Trash2 } from 'lucide-react';

const DiagnosticBridge = ({ isActive, scoredDocIds, isExporting, handleExport, handleClear, showActions, database }) => {
  const [scanIndex, setScanIndex] = useState(-1);
  const fallbackDb = database || [];
  const orderedDocs = useMemo(() => {
    if (!scoredDocIds || scoredDocIds.length === 0) return fallbackDb;

    const rankedDocs = scoredDocIds
      .map((score) => fallbackDb.find((doc) => doc.id === score.id))
      .filter(Boolean);

    return rankedDocs.length > 0 ? rankedDocs : fallbackDb;
  }, [scoredDocIds, fallbackDb]);

  const activeDoc = isActive && scanIndex >= 0 ? orderedDocs[scanIndex] : null;
  const scannedDocs = isActive ? orderedDocs.slice(0, Math.max(scanIndex + 1, 0)).map((doc) => doc.id) : [];

  useEffect(() => {
    if (!isActive) return undefined;

    let i = 0;
    const startTimer = setTimeout(() => setScanIndex(0), 0);
    const interval = setInterval(() => {
      i += 1;
      setScanIndex(i < orderedDocs.length ? i : -1);
      if (i >= orderedDocs.length) clearInterval(interval);
    }, 600);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [isActive, orderedDocs]);

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '10px', 
            backgroundColor: isActive ? 'var(--primary)' : 'rgba(16, 185, 129, 0.1)',
            color: isActive ? 'white' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reasoning Bridge</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
              <div className="dot-indicator" style={{ background: isActive ? 'var(--primary)' : 'var(--text-tertiary)' }} />
              <p className="label-xs" style={{ fontSize: '0.6rem' }}>{isActive ? 'Scanning Archives' : 'Standby Mode'}</p>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="badge-pro" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
            RETRIEVAL_LATENCY: 42ms
          </div>
          {showActions && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={handleExport} 
                disabled={isExporting}
                title="Export Clinical Report"
                style={{ 
                  width: '32px', height: '32px', borderRadius: '6px', 
                  border: '1px solid var(--border)', background: 'var(--bg-main)', 
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {isExporting ? <div className="spin" style={{ width: '12px', height: '12px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} /> : <Printer size={15} />}
              </button>
              <button 
                onClick={handleClear}
                title="Clear Analysis"
                style={{ 
                  width: '32px', height: '32px', borderRadius: '6px', 
                  border: '1px solid var(--border)', background: 'var(--bg-main)', 
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-main)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {activeDoc ? (
            <motion.div
              key={activeDoc.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="card-pro"
              style={{ 
                width: '100%', maxWidth: '600px', padding: '2.5rem', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                margin: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={14} color="var(--primary)" />
                  <span className="label-xs" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>{activeDoc.id}</span>
                </div>
                <span className="label-xs" style={{ fontSize: '0.65rem' }}>Ref: {activeDoc.year}</span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>{activeDoc.title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary-light)', paddingLeft: '1.25rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                "{activeDoc.snippet}"
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeDoc.tags.map(tag => (
                  <span key={tag} className="label-xs" style={{ background: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.1 }}>
              <Database size={64} />
              <p className="label-xs" style={{ marginTop: '1.5rem' }}>Knowledge Graph Offline</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {fallbackDb.map(doc => (
          <div 
            key={doc.id} 
            style={{ 
              width: '40px', height: '40px', borderRadius: '8px', 
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.3s ease',
              backgroundColor: activeDoc?.id === doc.id ? 'var(--primary)' : scannedDocs.includes(doc.id) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: activeDoc?.id === doc.id ? 'white' : scannedDocs.includes(doc.id) ? 'var(--primary)' : 'var(--text-tertiary)'
            }}
          >
            {doc.id.split(' ')[1]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticBridge;
