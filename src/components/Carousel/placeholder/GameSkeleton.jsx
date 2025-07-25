// --------------------------------------------------------------------|
// ------------- Skeleton component for loading elements --------------|

export const GameSkeleton = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: {
      container: "h-32",
      circle: "w-8 h-8",
      rect1: "w-6 h-6",
      rect2: "w-10 h-6",
    },
    default: {
      container: "h-64",
      circle: "w-16 h-16",
      rect1: "w-12 h-12",
      rect2: "w-20 h-12",
    },
    medium: {
      container: "h-53",
      circle: "w-8 h-8",
      rect1: "w-6 h-6",
      rect2: "w-10 h-6",
    },
    large: {
      container: "h-96 lg:h-[450px]",
      circle: "w-24 h-24",
      rect1: "w-20 h-20",
      rect2: "w-28 h-20",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`${className} ${sizes.container} relative overflow-hidden`}>
      <div className="absolute inset-3 bg-slate-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div
            className={`${sizes.circle} bg-slate-600 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse`}></div>
          <div
            className={`${sizes.rect1} bg-slate-600 rounded mx-auto mb-2 animate-pulse`}></div>
          <div
            className={`${sizes.rect2} bg-slate-600 rounded mx-auto animate-pulse`}></div>
        </div>
      </div>
    </div>
  );
};
