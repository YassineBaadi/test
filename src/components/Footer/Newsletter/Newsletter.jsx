export default function Newsletter({ handleNewsletter, newsletterSuccess }) {
  return (
    <>
      <div className="transition-all duration-200 translate-y-8 hover:scale-105 hover:shadow-lg rounded-lg mb-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white cursor-default">
          Newsletter
        </h2>
        <p className="mb-2 text-gray-500 dark:text-gray-400 text-xs cursor-default">
          Promotions qui choquent, nouvelles sorties et actualités directement
          dans votre boîte mail !
        </p>
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={handleNewsletter}>
          <input
            type="email"
            required
            placeholder="Votre email..."
            className="rounded-lg px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-300 shadow-sm focus:shadow-yellow-200 max-w-full sm:flex-1"
          />
          <button
            type="submit"
            className="bg-rosy hover:bg-pine text-white px-4 py-2 rounded-r-sm rounded-l-sm transition-all duration-200 cursor-pointer hover:rounded-tl-3xl hover:rounded-br-3xl hover:scale-103 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-pine/70 animate-pulse-once flex-shrink-0 min-w-[90px] 
            max-w-full">
            <span className="relative z-10">S'inscrire</span>
          </button>
        </form>
        {newsletterSuccess && (
          <div className="mt-3 px-4 py-2 bg-pine text-white rounded-lg shadow-lg animate-toast-in text-sm font-semibold inline-block absolute lg:top-[8rem] left-0">
            Inscription réussie !
          </div>
        )}
      </div>
    </>
  );
}
