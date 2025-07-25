export default function Header({ title, description }) {
  return (
    <>
      <div className="text-center mb-16 relative">
        {/* Cyberpunk border lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent h-px top-0 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent h-px bottom-0 animate-pulse delay-500"></div>

        {/* Glitch effect on title */}
        <h1 className="text-7xl font-black mb-6 relative">
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent tracking-wider neon-text">
            {title}
          </span>
          {/* Glitch overlay */}
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent tracking-wider opacity-0 animate-glitch">
            {title}
          </span>
        </h1>

        {/* Cyberpunk description */}
        <p className="text-cyan-300 text-xl font-mono max-w-3xl mx-auto leading-relaxed tracking-wider animate-neon-flicker">
          <span className="text-fuchsia-400">[</span>
          {description}
          <span className="text-purple-400">]</span>
        </p>

        {/* Animated corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400 animate-neon-flicker"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-fuchsia-400 animate-neon-flicker delay-300"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400 animate-neon-flicker delay-500"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 animate-neon-flicker delay-700"></div>
      </div>
    </>
  );
}
