import { useMemo, useRef, useState } from 'react';

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type SpeechWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export function useSpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecognitionApi = useMemo(() => {
    const speechWindow = window as SpeechWindow;
    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  }, []);

  const supported = Boolean(SpeechRecognitionApi);

  function start() {
    if (!SpeechRecognitionApi || listening) {
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let nextTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        nextTranscript += event.results[index][0].transcript;
      }

      setTranscript(nextTranscript.trim());
    };

    recognition.onerror = (event) => {
      setSpeechError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    setTranscript('');
    setSpeechError('');
    setListening(true);
    recognition.start();
  }

  function stop() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function reset() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setTranscript('');
    setSpeechError('');
    setListening(false);
  }

  return {
    transcript,
    setTranscript,
    listening,
    supported,
    speechError,
    start,
    stop,
    reset,
  };
}
