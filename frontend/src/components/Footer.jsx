import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-cinema-border bg-cinema-deep mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <span className="font-display text-xl tracking-widest text-gradient-gold">CINEBOOK</span>
          </div>

          <nav className="flex gap-6 text-sm text-cinema-muted">
            <Link to="/"        className="hover:text-cinema-gold transition-colors">Movies</Link>
            <Link to="/login"   className="hover:text-cinema-gold transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-cinema-gold transition-colors">Sign Up</Link>
          </nav>

          <p className="text-cinema-muted text-sm">
            © {new Date().getFullYear()} CineBook. Built for movie lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}