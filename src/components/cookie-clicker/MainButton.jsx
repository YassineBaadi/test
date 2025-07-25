export default function MainButton({ handleCookieClick, icon }) {
  return (
    <>
      <div className="flex justify-center mb-16">
        <button
          onClick={handleCookieClick}
          className="group relative transition-all duration-500 hover:scale-110 active:scale-95 animate-float">
          {/* Cyberpunk glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-fuchsia-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse"></div>

          {/* Main button with cyberpunk design */}
          <div className="relative w-56 h-56 bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-purple-600 rounded-full shadow-2xl border-4 border-cyan-300/50 flex items-center justify-center transform transition-all duration-300 hover:shadow-cyan-400/40 hover:shadow-4xl group-hover:rotate-12 overflow-hidden animate-cyber-pulse">
            {/* Circuit pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(147,51,234,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.3),transparent_50%)]"></div>

            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan-line"></div>

            {/* Glitch overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-glitch"></div>

            <div className="text-7xl transform transition-all duration-300 group-hover:scale-110 group-active:scale-90 relative z-10 neon-text">
              {icon}
            </div>
          </div>

          {/* Click effect */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Cyberpunk particle effects */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 animate-pulse"></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-100 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-200 animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-300 animate-pulse"></div>

          {/* Corner brackets */}
          <div className="absolute -top-4 -left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-neon-flicker"></div>
          <div className="absolute -top-4 -right-4 w-6 h-6 border-r-2 border-t-2 border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 animate-neon-flicker"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border-l-2 border-b-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 animate-neon-flicker"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300 animate-neon-flicker"></div>
        </button>
      </div>
    </>
  );
}
