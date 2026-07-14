import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Keyboard, Sparkles, RefreshCw } from 'lucide-react';

const BrailleTTS = () => {
  const [text, setText] = useState("Warrington startup founded by two brothers");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);

  // Translate mapping (Standard Grade 1 Braille Unicode)
  const brailleMap = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴',
    ' ': ' '
  };

  const translateToBraille = (str) => {
    return str
      .toLowerCase()
      .split('')
      .map(char => brailleMap[char] || '?')
      .join('');
  };

  // Retrieve browser TTS voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        // default to first english voice or default
        const defaultV = availableVoices.find(v => v.lang.includes("en")) || availableVoices[0];
        setSelectedVoice(defaultV.name);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      const voiceObj = voices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    synth.speak(utterance);
  };

  const handleCancelSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px' }}>
      
      {/* Left Panel: Text Input & TTS controls */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Keyboard size={18} color="var(--primary)" />
          Source Text Content
        </h3>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleCancelSpeak();
          }}
          placeholder="Type or paste document text here to translate..."
          style={{ minHeight: '140px', resize: 'vertical' }}
        />

        {/* Speech Controls */}
        <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Accessibility Speech Engine (TTS)</h4>
          
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Speed Rate</span>
              <strong>{rate}x</strong>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={rate} 
              onChange={(e) => setRate(parseFloat(e.target.value))}
              style={{ background: 'rgba(255,255,255,0.05)', height: '4px', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Vocal Pitch</span>
              <strong>{pitch}</strong>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.1" 
              value={pitch} 
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              style={{ background: 'rgba(255,255,255,0.05)', height: '4px', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Voice Selector</label>
            <select 
              value={selectedVoice} 
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {voices.map((voice, idx) => (
                <option key={idx} value={voice.name}>{voice.name} ({voice.lang})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={handleSpeak}
              className="btn btn-primary"
              style={{ flexGrow: 1 }}
            >
              {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {speaking ? "Stop Speech" : "Speak Aloud"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Braille Display Visualizer */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--secondary)" />
          Braille Monitor Visualizer
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          This playground shows how ETOOL translates text strings into standard Braille Unicode formats, simulating layout feeds sent to physical WebHID Braille display pins.
        </p>

        {/* Translation Output Unicode Row */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unicode braille stream</span>
          <div style={{
            fontSize: '1.75rem',
            color: 'var(--primary)',
            background: 'rgba(15,23,42,0.4)',
            padding: '12px',
            borderRadius: '8px',
            marginTop: '8px',
            letterSpacing: '3px',
            whiteSpace: 'pre-wrap',
            minHeight: '60px',
            border: '1px solid var(--border-glow)'
          }}>
            {translateToBraille(text)}
          </div>
        </div>

        {/* Braille Interactive cells display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Pin matrix (First 12 chars)</span>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
            background: 'rgba(255,255,255,0.01)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-glow)'
          }}>
            {text.slice(0, 12).split('').map((char, charIdx) => {
              const bChar = brailleMap[char.toLowerCase()] || ' ';
              // Simulate which pins are raised in the 2x3 Braille cell
              // We'll generate a pseudo-random active states for pins based on char code
              const charCode = char.toLowerCase().charCodeAt(0);
              const pins = [
                (charCode & 1) !== 0,
                (charCode & 2) !== 0,
                (charCode & 4) !== 0,
                (charCode & 8) !== 0,
                (charCode & 16) !== 0,
                (charCode & 32) !== 0
              ];
              
              return (
                <div key={charIdx} style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '8px',
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '1.25rem', color: 'var(--secondary)', fontWeight: 'bold' }}>{bChar}</div>
                  
                  {/* Pseudo pin cell grid (2 columns, 3 rows) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {pins.map((raised, pinIdx) => (
                      <div 
                        key={pinIdx}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: raised ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          boxShadow: raised ? '0 0 8px var(--primary)' : 'none',
                          transition: 'var(--transition-smooth)'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {char === ' ' ? 'space' : char}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default BrailleTTS;
