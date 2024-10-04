const SkeletonHeader = () => {
  return (
    <div className="animate-pulse p-4">
      <div className="h-8 bg-gray-300 rounded w-1/12 mb-4 animate-skeleton"></div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-300 rounded w-20 animate-skeleton"></div>
          <div className="h-8 bg-gray-300 rounded w-20 animate-skeleton"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-300 rounded w-28 animate-skeleton"></div>
          <div className="h-8 bg-gray-300 rounded w-64 animate-skeleton"></div>
          <div className="h-8 bg-gray-300 rounded w-16 animate-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonHeader;
