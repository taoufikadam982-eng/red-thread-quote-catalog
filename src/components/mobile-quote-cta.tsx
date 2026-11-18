import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useQuote } from './quote-context';

export function MobileQuoteCta() {
  const { open, setOpen } = useQuote();
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector('.footer-bottom');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry?.isIntersecting ?? false);
    }, { rootMargin: '0px 0px 96px 0px' });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  const hidden = footerVisible || open;
  return <div className={`mobile-quote-cta md:hidden${hidden ? ' is-hidden' : ''}`} inert={hidden} aria-hidden={hidden}>
    <Button className="mobile-quote-button" onClick={() => setOpen(true)}>Demander un devis<ArrowRight aria-hidden="true"/></Button>
  </div>;
}