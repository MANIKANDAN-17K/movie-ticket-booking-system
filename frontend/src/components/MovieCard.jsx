import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const { id, title, genre, language, duration, releaseDate, posterUrl, rating, ticketPrice } = movie

  return (
    <Link to={`/movies/${id}`} className="block group animate-fadein">
      <article className="relative bg-cinema-card border border-cinema-border/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-md hover:border-cinema-gold/30">

        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-cinema-deep">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
              onError={(e) => { e.target.src = `https://placehold.co/300x450/141421/6B6B8A?text=${encodeURIComponent(title[0])}` }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cinema-card to-cinema-deep">
              <span className="text-5xl opacity-30">🎬</span>
              <span className="text-cinema-muted text-xs text-center px-2 leading-tight">{title}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Top badges */}
          <div className="absolute top-0 inset-x-0 p-2.5 flex items-start justify-between">
            {genre && (
              <span className="badge-muted text-[10px] uppercase tracking-wide backdrop-blur-sm bg-black/50">
                {genre}
              </span>
            )}
            {rating && (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-cinema-gold/30 rounded-lg px-2 py-0.5">
                <span className="text-cinema-gold text-xs">★</span>
                <span className="text-cinema-gold text-xs font-bold">{rating}</span>
              </span>
            )}
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-semibold text-sm leading-tight line-clamp-2 drop-shadow">{title}</p>
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {language && <span className="text-cinema-subtle text-xs">{language}</span>}
              {duration && <span className="text-cinema-muted text-xs">· {duration}m</span>}
            </div>
          </div>
        </div>

        {/* Price row */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <span className="text-cinema-gold font-bold text-sm">
            {ticketPrice != null ? `₹${ticketPrice}` : 'See details'}
          </span>
          <span className="text-cinema-muted text-xs group-hover:text-cinema-gold transition-colors duration-200 flex items-center gap-1">
            Book <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}