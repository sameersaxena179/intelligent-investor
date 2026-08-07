import React, { useState } from 'react';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';

export default function SearchSection({ onSearch, loading }) {
  const [inputValue, setInputValue] = useState('Value Strategy');
  const [maxPe, setMaxPe] = useState(15); // Default value investor threshold
  const presets = ['Defensive Portfolio', 'Aggressive Growth', 'Value Strategy'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue, maxPe);
  };

  const handlePresetClick = (preset) => {
    setInputValue(preset);
    onSearch(preset, maxPe);
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* Top Row: Search Input and Submit Button */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search strategies..."
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : 'Traverse Graph'}
          </button>
        </div>

        {/* Bottom Row: P/E Ratio Slider Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
          <SlidersHorizontal size={18} color="#94a3b8" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
              <span>Maximum P/E Ratio Threshold</span>
              <span style={{ fontWeight: 'bold', color: '#818cf8' }}>{maxPe}</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="200" 
              step="1"
              value={maxPe} 
              onChange={(e) => setMaxPe(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>
      </form>

      {/* Presets Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Presets:</span>
        {presets.map((item) => (
          <button key={item} type="button" onClick={() => handlePresetClick(item)} style={styles.pill}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  input: { 
    width: '100%', 
    padding: '0.875rem 1rem 0.875rem 2.75rem', 
    backgroundColor: '#1e293b', 
    border: '1px solid #334155', 
    borderRadius: '0.5rem', 
    color: '#fff', 
    fontSize: '1rem', 
    boxSizing: 'border-box' 
  },
  button: { 
    padding: '0.875rem 1.5rem', 
    backgroundColor: '#6366f1', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '0.5rem', 
    fontWeight: '600', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem' 
  },
  pill: { 
    backgroundColor: 'transparent', 
    border: '1px solid #334155', 
    color: '#cbd5e1', 
    padding: '0.25rem 0.75rem', 
    borderRadius: '9999px', 
    fontSize: '0.85rem', 
    cursor: 'pointer' 
  }
};