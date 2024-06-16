// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import { userState } from "@/recoil/userState";

// import { useInfiniteQuery } from "react-query";
// import { useInView } from "react-intersection-observer";
// import { basicAxios } from "@/api/axios";

// import SEOMetaTag from "@/components/SEOMetaTag";
// import { Product } from "@/interface/product";
// import ProductHeader from "@/components/Header/ProductHeader";

// function ProductList() {
//   const userInfo = useRecoilValue(userState);
//   const { userId } = userInfo;
//   const [currentImageIndex] = useState(0);

//   const fetchProducts = async ({ pageParam = null }) => {
//     try {
//       const response = await basicAxios.get("/products/search", {
//         params: {
//           seller: userId,
//           pageParam: pageParam,
//         },
//       });

//       console.log("Response data:", response.data);

//       return {
//         data: response.data.result.content,
//         nextStart: response.data.nextStart,
//       };
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       throw new Error("Error fetching products");
//     }
//   };

//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     isError,
//     isLoading,
//   } = useInfiniteQuery("products", fetchProducts, {
//     getNextPageParam: (lastPage) => {
//       return lastPage.nextStart;
//     },
//   });

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage]);

//   if (isLoading) {
//     return <div className="flex justify-center mt-10">Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error occurred.</div>;
//   }

//   return (
//     <>
//       <header className="h-20">
//         <ProductHeader
//           showProductManagement={true}
//           showHomeButton={true}
//           showUploadButton={true}
//         />
//         <SEOMetaTag
//           title="For Dogs - ProductList"
//           description="판매 중인 상품 리스트 페이지입니다."
//         />
//       </header>
//       <main className="mt-16">
//         <div>
//           <div className="flex flex-wrap justify-start">
//             {data?.pages.map((page, pageIndex) => (
//               <React.Fragment key={pageIndex}>
//                 {page.data.map((product: Product, index: number) => (
//                   <Link
//                     key={index}
//                     to={`/productdetail/${product.productId}`}
//                     className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
//                   >
//                     <div className="shadow border-2 rounded h-[380px]">
//                       {product.productImages[currentImageIndex] ? (
//                         <img
//                           className="w-full h-[300px] rounded"
//                           src={product.productImages[currentImageIndex]}
//                           alt={`Uploaded image ${currentImageIndex + 1}`}
//                         />
//                       ) : null}
//                       <div className="m-1">
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productName}
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productPrice}원
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
//                           남은 수량 : {product.productQuantity}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </React.Fragment>
//             ))}

//             <div ref={ref}></div>
//           </div>
//           {hasNextPage && (
//             <button onClick={() => fetchNextPage()}>다음 페이지</button>
//           )}
//         </div>
//         {isFetchingNextPage && <div>Loading more...</div>}
//       </main>
//     </>
//   );
// }

// export default ProductList;

// 중복 발생

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import { userState } from "@/recoil/userState";

// import { useInfiniteQuery } from "react-query";
// import { useInView } from "react-intersection-observer";
// import { basicAxios } from "@/api/axios";

// import SEOMetaTag from "@/components/SEOMetaTag";
// import { Product } from "@/interface/product";
// import ProductHeader from "@/components/Header/ProductHeader";

// function ProductList() {
//   const userInfo = useRecoilValue(userState);
//   const { userId } = userInfo;
//   const [currentImageIndex] = useState(0);

//   const fetchProducts = async ({ pageParam = 0 }) => {
//     try {
//       const pageSize = pageParam === 0 ? 9 : 3;
//       const response = await basicAxios.get("/products/search", {
//         params: {
//           seller: userId,
//           page: pageParam,
//           size: pageSize,
//         },
//       });

//       console.log("Response data:", response.data);

//       return {
//         data: response.data.result.content,
//         nextStart: pageParam + 1,
//       };
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       throw new Error("Error fetching products");
//     }
//   };

//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     isError,
//     isLoading,
//   } = useInfiniteQuery("products", fetchProducts, {
//     getNextPageParam: (lastPage) => {
//       const hasMorePages = lastPage?.data?.length > 0;
//       return hasMorePages ? lastPage.nextStart : undefined;
//     },
//   });

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage]);

//   if (isLoading) {
//     return <div className="flex justify-center mt-10">Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error occurred.</div>;
//   }

//   return (
//     <>
//       <header className="h-20">
//         <ProductHeader
//           showProductManagement={true}
//           showHomeButton={true}
//           showUploadButton={true}
//         />
//         <SEOMetaTag
//           title="For Dogs - ProductList"
//           description="판매 중인 상품 리스트 페이지입니다."
//         />
//       </header>
//       <main className="mt-16">
//         <div>
//           <div className="flex flex-wrap justify-start">
//             {data?.pages.map((page, pageIndex) => (
//               <React.Fragment key={pageIndex}>
//                 {page.data.map((product: Product, index: number) => (
//                   <Link
//                     key={index}
//                     to={`/productdetail/${product.productId}`}
//                     className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
//                   >
//                     <div className="shadow border-2 rounded h-[380px]">
//                       {product.productImages[currentImageIndex] ? (
//                         <img
//                           className="w-full h-[300px] rounded"
//                           src={product.productImages[currentImageIndex]}
//                           alt={`Uploaded image ${currentImageIndex + 1}`}
//                         />
//                       ) : null}
//                       <div className="m-1">
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productName}
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                           {product.productPrice}원
//                         </div>
//                         <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
//                           남은 수량 : {product.productQuantity}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </React.Fragment>
//             ))}

//             <div ref={ref}></div>
//           </div>
//           {isFetchingNextPage && <div>Loading more...</div>}
//         </div>
//       </main>
//     </>
//   );
// }

// export default ProductList;

// 중복 제거

// import React, { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import { userState } from "@/recoil/userState";
// import { useInfiniteQuery } from "react-query";
// import { useInView } from "react-intersection-observer";
// import { basicAxios } from "@/api/axios";
// import SEOMetaTag from "@/components/SEOMetaTag";
// import { Product } from "@/interface/product";
// import ProductHeader from "@/components/Header/ProductHeader";

// function ProductList() {
//   const userInfo = useRecoilValue(userState);
//   const { userId } = userInfo;
//   const [currentImageIndex] = useState(0);

//   const fetchProducts = async ({ pageParam = 0 }) => {
//     try {
//       const pageSize = pageParam === 0 ? 9 : 3;
//       const response = await basicAxios.get("/products/search", {
//         params: {
//           seller: userId,
//           page: pageParam,
//           size: pageSize,
//         },
//       });

//       console.log("Response data:", response.data);

//       return {
//         data: response.data.result.content,
//         nextStart: pageParam + 1,
//       };
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       throw new Error("Error fetching products");
//     }
//   };

//   const {
//     data,
//     fetchNextPage,
//     isFetchingNextPage,
//     hasNextPage,
//     isError,
//     isLoading,
//   } = useInfiniteQuery("products", fetchProducts, {
//     getNextPageParam: (lastPage) => {
//       const hasMorePages = lastPage?.data?.length > 0;
//       return hasMorePages ? lastPage.nextStart : undefined;
//     },
//   });

//   const { ref, inView } = useInView({
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage]);

//   const uniqueProducts = useMemo(() => {
//     const allProducts = data?.pages.flatMap((page) => page.data) || [];
//     const productMap = new Map();
//     allProducts.forEach((product) => {
//       productMap.set(product.productId, product);
//     });
//     return Array.from(productMap.values());
//   }, [data]);

//   if (isLoading) {
//     return <div className="flex justify-center mt-10">Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error occurred.</div>;
//   }

//   return (
//     <>
//       <header className="h-20">
//         <ProductHeader
//           showProductManagement={true}
//           showHomeButton={true}
//           showUploadButton={true}
//         />
//         <SEOMetaTag
//           title="For Dogs - ProductList"
//           description="판매 중인 상품 리스트 페이지입니다."
//         />
//       </header>
//       <main className="mt-16">
//         <div>
//           <div className="flex flex-wrap justify-start">
//             {uniqueProducts.map((product: Product, index: number) => (
//               <Link
//                 key={index}
//                 to={`/productdetail/${product.productId}`}
//                 className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
//               >
//                 <div className="shadow border-2 rounded h-[380px]">
//                   {product.productImages[currentImageIndex] ? (
//                     <img
//                       className="w-full h-[300px] rounded"
//                       src={product.productImages[currentImageIndex]}
//                       alt={`Uploaded image ${currentImageIndex + 1}`}
//                     />
//                   ) : null}
//                   <div className="m-1">
//                     <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                       {product.productName}
//                     </div>
//                     <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
//                       {product.productPrice}원
//                     </div>
//                     <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
//                       남은 수량 : {product.productQuantity}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}

//             <div ref={ref}></div>
//           </div>
//           {isFetchingNextPage && <div>Loading more...</div>}
//         </div>
//       </main>
//     </>
//   );
// }

// export default ProductList;

// 확인 코드 추가

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/userState";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import { Product } from "@/interface/product";
import ProductHeader from "@/components/Header/ProductHeader";

function ProductList() {
  const userInfo = useRecoilValue(userState);
  const { userId } = userInfo;
  const [currentImageIndex] = useState(0);

  const fetchProducts = async ({ pageParam = 0 }) => {
    try {
      const pageSize = pageParam === 0 ? 9 : 3;
      const response = await basicAxios.get("/products/search", {
        params: {
          seller: userId,
          page: pageParam,
          size: pageSize,
        },
      });

      console.log(
        `Loaded page ${pageParam + 1}:`,
        response.data.result.content
      );

      return {
        data: response.data.result.content,
        nextStart: pageParam + 1,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Error fetching products");
    }
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery("products", fetchProducts, {
    getNextPageParam: (lastPage) => {
      const hasMorePages = lastPage?.data?.length > 0;
      return hasMorePages ? lastPage.nextStart : undefined;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const uniqueProducts = useMemo(() => {
    const allProducts = data?.pages.flatMap((page) => page.data) || [];
    const productMap = new Map();
    allProducts.forEach((product) => {
      productMap.set(product.productId, product);
    });
    return Array.from(productMap.values());
  }, [data]);

  if (isLoading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred.</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader
          showProductManagement={true}
          showHomeButton={true}
          showUploadButton={true}
        />
        <SEOMetaTag
          title="For Dogs - ProductList"
          description="판매 중인 상품 리스트 페이지입니다."
        />
      </header>
      <main className="mt-16 h-screen overflow-y-scroll">
        <div>
          <div className="flex flex-wrap justify-start">
            {uniqueProducts.map((product: Product, index: number) => (
              <Link
                key={index}
                to={`/productdetail/${product.productId}`}
                className="w-full lg:w-1/3 md:w-1/2 sm:w-full p-4"
              >
                <div className="shadow border-2 rounded h-[380px]">
                  {product.productImages[currentImageIndex] ? (
                    <img
                      className="w-full h-[300px] rounded"
                      src={product.productImages[currentImageIndex]}
                      alt={`Uploaded image ${currentImageIndex + 1}`}
                    />
                  ) : null}
                  <div className="m-1">
                    <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
                      {product.productName}
                    </div>
                    <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap">
                      {product.productPrice}원
                    </div>
                    <div className="overflow-hidden text-overflow ellipsis whitespace-nowrap font-bold">
                      남은 수량 : {product.productQuantity}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <div ref={ref}></div>
          </div>
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </main>
    </>
  );
}

export default ProductList;
