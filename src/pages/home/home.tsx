import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { storage } from "@/firebase";
import { ref, getDownloadURL } from "firebase/storage";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import { userState } from "@/recoil/userState";
import LazyImage from "@/components/LazyImage";
import Header from "@/components/Header/MainHeader";
import CartModal from "@/components/modals/cartModal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Product } from "@/interface/product";

export default function Home() {
  const user = useRecoilValue(userState);

  const [sirials, setSirials] = useState<Product[]>([]);
  const [clothingProducts, setClothingProducts] = useState<Product[]>([]);
  const [snackProducts, setSnackProducts] = useState<Product[]>([]);
  const [toyProducts, setToyProducts] = useState<Product[]>([]);
  const [accessory, setAccessory] = useState<Product[]>([]);
  const [supplements, setSupplements] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageNames = ["찌비.webp", "찌비001.webp", "찌비003.webp"];

  useEffect(() => {
    imageNames.forEach((imageName) => {
      const imageRef = ref(storage, `folder/${imageName}`);

      getDownloadURL(imageRef)
        .then((url: string) => {
          setImageURLs((prevURLs: string[]) => [...prevURLs, url]);
        })
        .catch((error: Error) => {
          console.log(error);
        });
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageURLs.length);
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(timer);
  }, [imageURLs]);

  const categoryMapping: { [key: string]: string } = {
    사료: "FOOD",
    의류: "CLOTHING",
    간식: "SNACK",
    장난감: "TOY",
    용품: "ACCESSORY",
    영양제: "SUPPLEMENT",
  };

  const fetchProducts = async (
    category: string,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  ) => {
    try {
      const response = await basicAxios.get("/products", {
        params: {
          category: categoryMapping[category],
          size: 5,
        },
      });

      const products: Product[] = response.data.result.content; // 페이징된 제품 목록
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // 에러 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    fetchProducts("사료", setSirials);
    fetchProducts("간식", setSnackProducts);
    fetchProducts("의류", setClothingProducts);
    fetchProducts("장난감", setToyProducts);
    fetchProducts("용품", setAccessory);
    fetchProducts("영양제", setSupplements);
  }, []);

  return (
    <>
      <div className="min-w-[583px] overflow-x-auto">
        <header>
          <Header />
        </header>
        <SEOMetaTag
          title="For Dogs Shop - 강아지를 위한 최고의 선택"
          description="여러분의 강아지를 위해 선물을 해주세요."
        />
        <main className="mt-36 w-full">
          <div>
            <ul className="flex space-x-2 justify-around">
              {["사료", "의류", "간식", "장난감", "용품", "영양제"].map(
                (category, index) => (
                  <li
                    key={index}
                    className="relative group cursor-pointer transform transition-all duration-200 hover:scale-110"
                  >
                    <Link
                      to={`/category/${category}`}
                      className="px-2 py-1 hover:bg-white"
                    >
                      {category}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="relative w-full h-[90vh] overflow-hidden mt-5">
            {imageURLs.map((url, index) => (
              <LazyImage
                key={index}
                src={url}
                alt=""
                className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                  index !== currentImageIndex ? "opacity-0" : "opacity-100"
                }`}
              />
            ))}
          </div>

          {sirials.length > 0 && (
            <div className="flex flex-col justify-start mt-12">
              <div className="flex ml-2 ">
                <h2 className="text-3xl">사료</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/사료`}>더보기</Link>
                </Button>
              </div>

              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {sirials.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

          {clothingProducts.length > 0 && (
            <div className="flex flex-col justify-start">
              <div className="flex ml-2">
                <h2 className="text-3xl">의류</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/의류`}>더보기</Link>
                </Button>
              </div>
              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {clothingProducts.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

          {snackProducts.length > 0 && (
            <div className="flex flex-col justify-start">
              <div className="flex ml-2">
                <h2 className="text-3xl">간식</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/간식`}>더보기</Link>
                </Button>
              </div>

              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {snackProducts.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

          {toyProducts.length > 0 && (
            <div className="flex flex-col justify-start">
              <div className="flex ml-2">
                <h2 className="text-3xl">장난감</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/장난감`}>더보기</Link>
                </Button>
              </div>

              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {toyProducts.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

          {accessory.length > 0 && (
            <div className="flex flex-col justify-start">
              <div className="flex ml-2">
                <h2 className="text-3xl">용품</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/용품`}>더보기</Link>
                </Button>
              </div>
              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {accessory.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

          {supplements.length > 0 && (
            <div className="flex flex-col justify-start">
              <div className="flex ml-2">
                <h2 className="text-3xl">영양제</h2>
                <Button size="sm" className="ml-3">
                  <Link to={`/category/영양제`}>더보기</Link>
                </Button>
              </div>

              <div className="relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="flex ">
                    {supplements.map((product) => (
                      <CarouselItem
                        key={product.productId}
                        className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4 "
                      >
                        <div className="m-3 w-[300px] ">
                          <Link
                            to={`/sellproduct/${product.productId}`}
                            className="p-1 block w-full "
                          >
                            <img
                              src={product.productImages[0]}
                              alt={product.productName}
                              className="w-72 h-72 object-cover"
                            />
                            <p>{product.productName}</p>
                            <p>{product.productPrice}원</p>
                            <p>남은 수량: {product.productQuantity}</p>
                          </Link>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* 왼쪽(이전) 버튼 */}
                  <CarouselPrevious className="absolute left-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full ">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </CarouselPrevious>

                  {/* 오른쪽(다음) 버튼 */}
                  <CarouselNext className="absolute right-1 flex items-center transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </CarouselNext>
                </Carousel>
              </div>
            </div>
          )}

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

        <footer className="mt-5 text-center p-4 bg-gray-100">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} For Dogs.
          </p>
          <p className="text-sm text-gray-600">
            프론트 개발자: 김지헌 | 백엔드 개발자: 유경우
          </p>
          <p className="text-sm text-gray-400 mt-4">
            본 페이지는 현재 운영 중이지 않습니다. For Dogs는
            통신판매중개자로서, 판매자가 등록한 상품 정보와 관련된 거래의 책임을
            지지 않습니다.
          </p>
        </footer>
      </div>
    </>
  );
}
