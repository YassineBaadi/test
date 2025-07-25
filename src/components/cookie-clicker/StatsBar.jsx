import Rules from "./Tooltip";

export default function StatsBar({ clicker }) {
  return (
    <>
      <div className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Cyberpunk background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-fuchsia-500/5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.1)_25%,rgba(147,51,234,0.1)_75%,transparent_75%)] bg-[size:20px_20px]"></div>

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="group">
              <p className="text-cyan-300 text-sm font-mono uppercase tracking-wider mb-2">
                <span className="text-fuchsia-400">[</span>
                COOKIES
                <span className="text-purple-400">]</span>
              </p>
              <p className="text-5xl font-black text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 tracking-wider">
                {clicker.cookies}
              </p>
            </div>
            <div className="group">
              <p className="text-cyan-300 text-sm font-mono uppercase tracking-wider mb-2">
                <span className="text-fuchsia-400">[</span>
                PER SECOND
                <span className="text-purple-400">]</span>
              </p>
              <p className="text-5xl font-black text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 tracking-wider">
                {clicker.cookiesPerSecond}
              </p>
            </div>
          </div>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400 animate-pulse"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-fuchsia-400 animate-pulse delay-300"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-purple-400 animate-pulse delay-500"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400 animate-pulse delay-700"></div>

        <div className="absolute top-4 right-4">
          <Rules right="0" top="0" size={35} />
        </div>
      </div>
    </>
  );
}
