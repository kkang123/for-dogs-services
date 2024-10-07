const ProductEditSkeleton = () => {
  return (
    <>
      <div className="min-w-[786px]">
        <section className="flex justify-center gap-14 w-full">
          <div>
            <div className="relative rounded w-[480px] h-[420px] bg-gray-200 animate-skeleton"></div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="col-span-3 grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-center w-full h-24 bg-gray-200 cursor-pointer rounded animate-skeleton"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-col space-y-8">
            <div className="w-[195px] h-[40px] mt-7 bg-gray-200 animate-skeleton"></div>
            <div className="w-[195px] h-[40px] bg-gray-200 animate-skeleton"></div>
            <div className="w-[195px] h-[40px] bg-gray-200 animate-skeleton"></div>
            <div className="w-[195px] h-[80px] bg-gray-200 animate-skeleton"></div>
            <div className="w-[195px] h-[45px] bg-gray-200 animate-skeleton"></div>
            <div className="flex justify-center">
              <div className="mt-8 w-[85px] h-[40px] bg-gray-200 animate-skeleton"></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductEditSkeleton;
