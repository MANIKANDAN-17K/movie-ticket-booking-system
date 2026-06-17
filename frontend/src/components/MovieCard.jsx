import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    genre,
    language,
    duration,
    releaseDate,
    posterUrl,
    rating,
    ticketPrice,
  } = movie

  return (
    <Link to={`/movies/${id}`} className="block group">
      <article className="bg-cinema-card border border-cinema-border rounded-xl overflow-hidden card-hover shadow-card">

        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-cinema-deep">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { e.target.src = `https://placehold.co/300x450/1A1A27/8A8AA8?text=${encodeURIComponent(title)}` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-cinema-black/80 backdrop-blur-sm border border-cinema-gold/40 rounded-md px-2 py-0.5 flex items-center gap-1">
              <span className="text-cinema-gold text-xs">★</span>
              <span className="text-cinema-gold text-xs font-semibold">{rating}</span>
            </div>
          )}

          {/* Genre badge */}
          {genre && (
            <div className="absolute top-2 left-2 bg-cinema-black/70 backdrop-blur-sm rounded-md px-2 py-0.5">
              <span className="text-cinema-muted text-[11px] uppercase tracking-wider">{genre}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-cinema-light text-base leading-tight mb-1 group-hover:text-cinema-gold transition-colors truncate">
            {title}
          </h3>

          <div className="flex items-center gap-3 text-cinema-muted text-xs mb-3">
            {language && <span>{language}</span>}
            {duration && (
              <>
                <span className="w-px h-3 bg-cinema-border" />
                <span>{duration} min</span>
              </>
            )}
            {releaseDate && (
              <>
                <span className="w-px h-3 bg-cinema-border" />
                <span>{new Date(releaseDate).getFullYear()}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-cinema-gold font-bold text-sm">
              {ticketPrice != null ? `₹${ticketPrice}` : 'See details'}
            </span>
            <span className="text-xs text-cinema-muted bg-cinema-deep px-2 py-1 rounded-md group-hover:text-cinema-gold transition-colors">
              Book →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}