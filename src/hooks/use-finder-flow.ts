import { useEffect, useRef, useState } from 'react';

export function useFinderFlow(questionCount: number) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  function cancelTransition() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    locked.current = false;
    setIsTransitioning(false);
  }
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  function choose(option: string) {
    if (locked.current || step >= questionCount) return;
    locked.current = true;
    setIsTransitioning(true);
    setSelected(option);
    timer.current = setTimeout(() => {
      setAnswers(previous => [...previous.slice(0, step), option]);
      setStep(step + 1);
      setSelected('');
      timer.current = null;
      locked.current = false;
      setIsTransitioning(false);
    }, 250);
  }
  function back() {
    if (step === 0) return;
    cancelTransition();
    setStep(step - 1);
    setSelected(answers[step - 1] ?? '');
  }
  function restart() {
    cancelTransition();
    setStep(0); setAnswers([]); setSelected('');
  }
  return { answers, step, selected, isTransitioning, choose, back, restart };
}