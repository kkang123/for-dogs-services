import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

import { basicAxios } from "@/api/axios";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/userState";
import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/Header/ProductHeader";
import SEOMetaTag from "@/components/SEOMetaTag";
import CartModal from "@/components/modals/cartModal";

import { Product } from "@/interface/product";

function Category() {
  const user = useRecoilValue(userState);
  const { productCategory } = useParams<{ productCategory: string }>();

  const [searchType, setSearchType] = useState<"seller" | "product">("seller");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedSellerName, setSearchedSellerName] = useState<string>("");
  const [searchedProductName, setSearchedProductName] = useState<string>("");

  const categoryMap: { [key: string]: string } = {
    음식: "FOOD",
    의류: "CLOTHING",
    간식: "SNACK",
    장난감: "TOY",
    용품: "ACCESSORY",
    영양제: "SUPPLEMENT",
  };

  const [sortType, setSortType] = useState<
    "updatedAtDesc" | "updatedAtAsc" | "priceAsc" | "priceDesc"
  >("updatedAtDesc");

  const sortField =
    sortType === "updatedAtDesc"
      ? "updatedAt,desc"
      : sortType === "updatedAtAsc"
      ? "updatedAt,asc"
      : sortType === "priceAsc"
      ? "price,asc"
      : "price,desc";

  const [currentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const fetchProducts = async ({ pageParam = 0 }) => {
    try {
      const pageSize = pageParam === 0 ? 9 : 3;
      const category = productCategory ? categoryMap[productCategory] : "";
      if (!category) throw new Error("Invalid category");

      const response = await basicAxios.get("/products", {
        params: {
          category,
          page: pageParam,
          size: pageSize,
          sort: sortField,
          seller: searchedSellerName || undefined,
          name: searchedProductName || undefined,
        },
      });

      const products: Product[] = response.data.result.content;
      const nextStart =
        response.data.result.content.length > 0 ? pageParam + 1 : undefined;

      return { data: products, nextStart };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
    remove,
    refetch,
  } = useInfiniteQuery("products", fetchProducts, {
    getNextPageParam: (lastPage) => lastPage.nextStart,
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    remove();
    refetch();
  }, [sortType, searchedSellerName, searchedProductName, refetch, remove]);

  const handleSearch = () => {
    if (searchType === "seller") {
      setSearchedSellerName(searchTerm);
      setSearchedProductName(""); // 상품 이름 초기화
    } else {
      setSearchedProductName(searchTerm);
      setSearchedSellerName(""); // 판매자 이름 초기화
    }
  };

  const uniqueProducts = useMemo(() => {
    const allProducts = data?.pages.flatMap((page) => page.data) || [];
    const productMap = new Map();
    allProducts.forEach((product) => {
      productMap.set(product.productId, product);
    });
    return Array.from(productMap.values()).filter(
      (product) => product.productQuantity > 0
    );
  }, [data]);

  if (isLoading) {
    return (
      <>
        <header className="h-[78px]">
          <ProductHeader showHomeButton={true} />
        </header>
        <main className="flex justify-center pt-5">
          <div>상품을 불러오는 중입니다.</div>
        </main>
        <footer></footer>
      </>
    );
  }

  if (isError) {
    return <div>Error occurred.</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showHomeButton={true} showProductCart={true} />
        <SEOMetaTag
          title="For Dogs - Category"
          description="카테고리 페이지입니다."
        />
      </header>
      <main className="mt-16">
        <div>
          <h1 className="text-4xl px-4">{productCategory}</h1>

          <div className="flex justify-between mt-4">
            <div className="flex justify-end gap-2 pr-7 ml-7 mb-4">
              <Button
                variant={sortType.includes("updatedAt") ? "default" : "ghost"}
                size={"sm"}
                onClick={() =>
                  setSortType(
                    sortType === "updatedAtDesc"
                      ? "updatedAtAsc"
                      : "updatedAtDesc"
                  )
                }
              >
                날짜순 {sortType === "updatedAtDesc" ? "▼" : "▲"}
              </Button>
              <Button
                variant={sortType.includes("price") ? "default" : "ghost"}
                size={"sm"}
                onClick={() =>
                  setSortType(
                    sortType === "priceAsc" ? "priceDesc" : "priceAsc"
                  )
                }
              >
                가격순 {sortType === "priceAsc" ? "▲" : "▼"}
              </Button>
            </div>

            <div className="flex justify-end mr-7 mb-2">
              <select
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as "seller" | "product")
                }
                className="border p-1 mr-2 rounded"
              >
                <option value="seller">판매자 이름</option>
                <option value="product">상품 이름</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-1 mr-2 rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch} size="sm">
                확인
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-max gap-4">
              {uniqueProducts.length > 0 ? (
                uniqueProducts.map((product: Product) => (
                  <Link
                    key={product.productId}
                    to={`/sellproduct/${product.productId}`}
                    className="flex justify-center items-center"
                  >
                    <div className="shadow border-2 rounded w-[380px] h-[380px] flex-shrink-0">
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
                          남은 수량: {product.productQuantity}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div>상품이 없습니다.</div>
              )}
              <div ref={ref}></div>
            </div>
          </div>

          {isFetchingNextPage && (
            <div className="text-center">
              상품을 불러오는 중입니다. 잠시만 기다려주세요!
            </div>
          )}
        </div>

        {user.userRole === "BUYER" && (
          <div>
            <Button
              onClick={toggleModal}
              className="fixed flex justify-center items-center bottom-8 left-8 z-50 rounded-full bg-zinc-800"
            >
              장바구니 보기
            </Button>
            <CartModal isOpen={isModalOpen} toggleModal={toggleModal} />
          </div>
        )}
      </main>
      <footer className="h-10"></footer>
    </>
  );
}

export default Category;
