import { photoCredits } from '../data/photos';

export default function PhotoCredits() {
  return (
    <div className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">WITH THANKS TO THE PHOTOGRAPHERS</p>
        <h1>Image credits</h1>
        <p>
          Menu photography is representative of the named dish or dish family. Actual recipes,
          portions and presentation vary. Images are fitted into cards with CSS; the source
          photographs retain their original licences. Web copies are resized and compressed to WebP.
        </p>
      </div>
      <div className="credits-grid">
        {Object.entries(photoCredits).map(([key, photo]) => (
          <article key={key}>
            <img
              src={photo.path}
              alt={photo.representativeOf}
              width="320"
              height="220"
              loading="lazy"
            />
            <h2>{photo.representativeOf}</h2>
            <p>{photo.author}</p>
            <a href={photo.source} target="_blank" rel="noreferrer">
              Original photograph
            </a>
            {' · '}
            <a
              href={photo.licenseUrl || 'https://commons.wikimedia.org/wiki/Commons:Licensing'}
              target="_blank"
              rel="noreferrer"
            >
              {photo.license}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
