import { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { customerReviews, googleReviews } from '@/lib/storefront';

function GoogleMark() {
  return <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"/>
    <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"/>
  </svg>;
}

function Stars({ count, label }: { count: number; label: string }) {
  return <span className="google-stars" role="img" aria-label={label}>
    {Array.from({ length: 5 }, (_, i) => <Star key={i} aria-hidden="true" fill="currentColor" strokeWidth={0} className={i < count ? '' : 'is-empty'}/>)}
  </span>;
}

export function GoogleBadge() {
  return <a className="google-badge" href={googleReviews.url} target="_blank" rel="noopener noreferrer" aria-label={`Note Google ${googleReviews.ratingLabel} sur 5, ${googleReviews.reviewCount} avis Google — ouvrir la fiche SESA Informatique dans un nouvel onglet`}>
    <GoogleMark/>
    <span className="google-badge-body">
      <span className="google-badge-score"><strong>{googleReviews.ratingLabel}</strong><span>/5</span><Stars count={5} label={`Note ${googleReviews.ratingLabel} sur 5`}/></span>
      <span className="google-badge-count">{googleReviews.reviewCount} avis Google</span>
    </span>
  </a>;
}

export function GoogleReviewCard() {
  const review = googleReviews.featured;
  return <figure className="google-review-card">
    <div className="google-review-head">
      <GoogleMark/>
      <Stars count={review.stars} label="Avis 5 étoiles sur Google"/>
    </div>
    <blockquote>« {review.quote} »</blockquote>
    <figcaption><strong>{review.author}</strong><span>{review.role}</span></figcaption>
    <a className="google-review-link" href={googleReviews.url} target="_blank" rel="noopener noreferrer">Voir tous les avis sur Google <span aria-hidden="true">→</span></a>
  </figure>;
}

export function CustomerReviewsSection() {
  const [touching, setTouching] = useState(false);
  return <section className="customer-reviews" aria-labelledby="customer-reviews-title">
    <div className="site-width customer-reviews-heading">
      <p className="customer-reviews-label">AVIS CLIENTS GOOGLE</p>
      <h2 id="customer-reviews-title">La confiance de nos clients à Rabat</h2>
      <a className="customer-reviews-summary" href={googleReviews.url} target="_blank" rel="noopener noreferrer">
        <GoogleMark/><strong>{googleReviews.ratingLabel} / 5</strong><Stars count={5} label="Note Google 4,6 sur 5"/><span>Basé sur {googleReviews.reviewCount} avis Google</span>
      </a>
    </div>
    <div className="customer-reviews-marquee" tabIndex={0} aria-label="Témoignages clients" onTouchStart={() => setTouching(true)} onTouchEnd={() => setTouching(false)} onTouchCancel={() => setTouching(false)}>
      <div className={`customer-reviews-track${touching ? ' is-touching' : ''}`}>
        {[0, 1].map(copy => <div className="customer-reviews-group" key={copy} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>
          {customerReviews.map(review => <figure className="customer-review" key={review.author}>
            <div className="customer-review-top"><Stars count={review.stars} label={`${review.stars} étoiles sur 5`}/><Quote aria-hidden="true"/></div>
            <blockquote>« {review.quote} »</blockquote>
            <figcaption><span className="customer-review-avatar" aria-hidden="true">{review.author.split(' ').map(word => word[0]).slice(0, 2).join('')}</span><span><strong>{review.author}</strong><span>{review.role}</span><small>{review.source === 'google' ? 'Avis Google' : 'Témoignage fourni'}</small></span>{review.source === 'google' && <GoogleMark/>}</figcaption>
          </figure>)}
        </div>)}
      </div>
    </div>
    <div className="site-width customer-reviews-bottom"><a href={googleReviews.url} target="_blank" rel="noopener noreferrer">Voir tous les avis sur Google <span aria-hidden="true">→</span></a></div>
  </section>;
}
