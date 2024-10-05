const ProductDetailSkeleton = () => {
  return (
    <div style={{ minWidth: "1300px" }} className="center">
      <div className="flex w-full gap-12 pt-[70px] pb-[80px] justify-center">
        <div className="w-[580px] h-[580px] bg-gray-200 animate-pulse"></div>
        <div className="flex flex-col gap-20 w-[600px]">
          <div className="w-[300px] h-[40px] bg-gray-200 animate-pulse mt-8 ml-auto"></div>

          <div className=" w-[200px] h-[30px] bg-gray-200 animate-pulse mt-3 ml-auto"></div>

          <div className="w-[250px] h-[30px] bg-gray-200 animate-pulse mt-8 ml-auto"></div>
          <div className="border-b-2 mt-4"></div>

          <div className="w-[100px] h-[40px] bg-gray-200 animate-pulse mt-2 ml-auto"></div>
        </div>
      </div>

      <div className="mx-12 text-4xl mt-12">상품 설명</div>
      <div
        className="mx-10 mt-3 border-4 border-LightBlue-500 rounded overflow-hidden"
        style={{ height: "8em" }}
      >
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
