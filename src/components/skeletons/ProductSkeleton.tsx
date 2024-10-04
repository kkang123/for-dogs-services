const ProductSkeleton = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="shadow border-2 rounded w-[380px] h-[380px] flex-shrink-0 animate-pulse bg-gray-200">
        <div className="w-full h-[300px] bg-gray-300 rounded animate-skeleton"></div>
        <div className="m-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded animate-skeleton"></div>
          <div className="h-4 bg-gray-300 rounded animate-skeleton"></div>
          <div className="h-4 bg-gray-300 rounded animate-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
