import { useState } from 'react';
import { Send, Info, Fingerprint } from 'lucide-react';

const SymptomIntake = ({ onAnalyze, isAnalyzing }) => {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onAnalyze(symptoms);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fingerprint size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Clinical Intake</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
              <div className="dot-indicator" />
              <p className="label-xs" style={{ color: 'var(--primary)', fontSize: '0.6rem' }}>Secure Signal</p>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Document the phenotype clusters, neurological markers, and observed abnormalities for triangulation.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe clinical markers..."
          />
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
            <Info size={14} color="var(--text-tertiary)" />
            <span className="label-xs" style={{ fontSize: '0.55rem' }}>Ingestion active</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !symptoms.trim()}
          className="btn-pro"
        >
          {isAnalyzing ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span>Calibrating Neural Bridge...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Initialize Analysis</span>
            </>
          )}
        </button>
      </form>

      <div className="protocol-constraints-card">
        <h4 className="label-xs" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Protocol Constraints</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="dot-indicator" style={{ marginTop: '0.4rem', flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Focus on <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Phenotype Triads</span>.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="dot-indicator" style={{ marginTop: '0.4rem', flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Validate <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Semantic Overlap</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomIntake;
