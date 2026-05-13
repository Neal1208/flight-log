import { useState, useRef, useCallback } from 'react';

export default function VoiceInput() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }

  if (!supported) return null;

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors
        ${listening ? 'bg-danger animate-pulse' : 'bg-accent'}`}
      title="点击并聚焦输入框后说话"
    >
      {listening ? '⏹' : '🎤'}
    </button>
  );
}
