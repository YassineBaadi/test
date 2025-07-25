function UpgradeComponent({
  cookies,
  handleBuyUpgrade,
  upgrade_name,
  upgrade_price,
  upgrade_value,
  upgrade_icon,
  upgrade_description,
}) {
  const canAfford = cookies >= upgrade_price;

  return (
    <>
      <div className="group bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 hover:border-fuchsia-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden">
        {/* Cyberpunk background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.1)_25%,rgba(147,51,234,0.1)_75%,transparent_75%)] bg-[size:15px_15px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
              {upgrade_icon}
            </div>
            <div className="text-right">
              <p className="text-cyan-400 font-black text-lg mb-1 group-hover:text-cyan-300 transition-colors duration-300 tracking-wider">
                <span className="text-fuchsia-400">[</span>
                {upgrade_name}
                <span className="text-purple-400">]</span>
              </p>
              <p className="text-cyan-300 text-sm font-mono">
                +{upgrade_value} cookies/sec
              </p>
            </div>
          </div>

          {/* Description */}
          {upgrade_description && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
              <p className="text-slate-300 text-xs italic font-mono leading-relaxed">
                "{upgrade_description}"
              </p>
            </div>
          )}

          <button
            className={`w-full font-black py-4 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 tracking-wider ${
              canAfford
                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-slate-900 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 border border-cyan-300/50"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border border-slate-600"
            }`}
            onClick={() =>
              handleBuyUpgrade({ price: upgrade_price, value: upgrade_value })
            }
            disabled={!canAfford}>
            <span className="flex items-center justify-center gap-2">
              <span className="uppercase">HACK</span>
              <span className="text-sm font-mono">
                ({upgrade_price.toLocaleString()})
              </span>
            </span>
          </button>
        </div>

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
      </div>
    </>
  );
}

export default function Upgrade({ upgrades, clicker, handleBuyUpgrade }) {
  return (
    <>
      {upgrades.map((upgrade, index) => (
        <div
          key={upgrade.id}
          className="transform transition-all duration-500 hover:-translate-y-2"
          style={{ animationDelay: `${index * 100}ms` }}>
          <UpgradeComponent
            cookies={clicker.cookies}
            handleBuyUpgrade={handleBuyUpgrade}
            upgrade_name={upgrade.name}
            upgrade_price={upgrade.price}
            upgrade_value={upgrade.value}
            upgrade_icon={upgrade.icon}
            upgrade_description={upgrade.description}
          />
        </div>
      ))}
    </>
  );
}
