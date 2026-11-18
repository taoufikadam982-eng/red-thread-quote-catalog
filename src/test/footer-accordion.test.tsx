import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FooterAccordionRow } from '@/components/footer-accordion';

afterEach(cleanup);

describe('mobile footer accordion rows', () => {
  it('starts collapsed and keeps hidden links out of the keyboard order', () => {
    render(<FooterAccordionRow id="catalogue" title="CATALOGUE"><a href="/catalogue">Écrans</a></FooterAccordionRow>);
    const trigger = screen.getByRole('button', { name: 'CATALOGUE' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('footer-panel-catalogue')).toHaveAttribute('inert');
  });

  it('opens on the first tap and closes on the second', () => {
    render(<FooterAccordionRow id="sesa" title="SESA INFORMATIQUE"><a href="/contact">Nous contacter</a></FooterAccordionRow>);
    const trigger = screen.getByRole('button', { name: 'SESA INFORMATIQUE' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('footer-panel-sesa')).not.toHaveAttribute('inert');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('footer-panel-sesa')).toHaveAttribute('inert');
  });
});
