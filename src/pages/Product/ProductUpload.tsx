import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";
import ProductHeader from "@/components/Header/ProductHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { userState } from "@/recoil/userState";
import useAuth from "@/hooks/useAuth";

import photo from "@/assets/icon-photo.svg";
import cancelBtn from "@/assets/cancel_btn.svg";

import { Product } from "@/interface/product";

function ProductUpload() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const { checkAndRefreshToken } = useAuth();

  const goToProductPage = () => {
    if (user.userId) navigate(`/productlist/${user.userId}`);
  };

  const [product, setProduct] = useState<Product>({
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "NONE",
    productImages: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    await checkAndRefreshToken();

    const {
      productName,
      productPrice,
      productQuantity,
      productDescription,
      productCategory,
      productImages,
    } = product;

    if (
      !productName ||
      productPrice <= 0 ||
      productPrice >= 100000000 ||
      productQuantity <= 0 ||
      !productDescription ||
      !productCategory ||
      productCategory === "NONE" ||
      productImages.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "비어있는 상품 정보를 작성해주세요.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const response = await basicAxios.post("/products", product);

      if (response.status === 201) {
        if (response.data.ok) {
          Swal.fire({
            icon: "success",
            title: "제품 업로드 완료",
            text: "제품이 성공적으로 업로드되었습니다.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "확인",
          }).then((result) => {
            if (result.isConfirmed) {
              goToProductPage();
            }
          });
        } else {
          console.error("서버 응답에 문제가 있습니다:", response.data);
          throw new Error("서버 응답에 문제가 있습니다.");
        }
      } else {
        console.error("응답 상태 코드:", response.status);
        throw new Error("제품 업로드 중 문제가 발생했습니다.");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: "제품 업로드 실패",
          text: `${
            error.response?.data?.error?.message ||
            "알 수 없는 에러가 발생했습니다."
          }`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
        console.error("제품 추가 중 에러: ", error);
      } else {
        Swal.fire({
          icon: "error",
          title: "제품 업로드 실패",
          text: "알 수 없는 에러가 발생했습니다.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });
        console.error("알 수 없는 에러: ", error);
      }
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "productPrice" || name === "productQuantity") {
      const numericValue = Math.max(Number(value), 0);
      value = numericValue.toString();
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "productPrice" || name === "productQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length <= 3) {
      const selectedFiles = Array.from(files);

      await deleteUploadedImages();

      try {
        await handleUpload(selectedFiles);
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "이미지 초과",
        text: "3장만 업로드해주세요.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    }
  };

  const handleUpload = async (files: File[]) => {
    const downloadURLs: string[] = [];
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("imageFiles", file);
      try {
        const response = await basicAxios.post("/products/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const data = response.data;
          console.log("Server response data:", data);
          if (
            data &&
            data.result &&
            data.result.uploadedImages &&
            data.result.uploadedImages[0] &&
            data.result.uploadedImages[0].imageFileUrl
          ) {
            const imageUrl = data.result.uploadedImages[0].imageFileUrl;
            console.log(`Uploaded file URL: ${imageUrl}`);
            downloadURLs.push(imageUrl);
            console.log("downloadURLs", downloadURLs);
          } else {
            console.error("imageFileUrl not found in response data");
          }
        } else {
          console.error(`파일 업로드 실패: ${file.name}`);
        }
      } catch (error) {
        console.error(`업로드 실패: ${file.name}`, error);
      }
    });

    await Promise.all(uploadPromises);
    setProduct((prevProduct) => ({
      ...prevProduct,
      productImages: downloadURLs,
    }));
  };

  const deleteUploadedImages = async (imageUrl?: string) => {
    try {
      await checkAndRefreshToken();

      const imageUrlsToDelete = imageUrl ? [imageUrl] : product.productImages;

      const deletePromises = imageUrlsToDelete.map(async (imageUrl) => {
        const response = await basicAxios.delete("/products/images", {
          params: { imageUrls: imageUrl },
        });
        return response;
      });

      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (response.status === 204) {
          console.log(`이미지 삭제 성공: ${response.config.params.imageUrls}`);
        } else {
          console.error(
            `이미지 삭제 실패: ${response.config.params.imageUrls}`
          );
        }
      });
    } catch (error) {
      console.error("업로드된 이미지를 삭제하는 중 오류 발생: ", error);
    }
  };

  const handleDeleteClick = (imageUrl: string) => {
    Swal.fire({
      icon: "warning",
      title: "이미지를 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUploadedImages(imageUrl);

        setProduct((prevProduct) => ({
          ...prevProduct,
          productImages: prevProduct.productImages.filter(
            (image) => image !== imageUrl
          ),
        }));

        if (currentImageIndex >= product.productImages.length - 1) {
          setCurrentImageIndex(0);
        }
      }
    });
  };

  const handleEmptyImageClick = () => {
    const fileInput = document.getElementById("picture");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <>
      <header>
        <ProductHeader
          showPageBackSpaceButton={true}
          onBackspaceClick={deleteUploadedImages}
        />
        <SEOMetaTag
          title="For Dogs - ProductUpload"
          description="상품 업로드 페이지입니다."
        />
      </header>

      <main className="mt-44 overflow-x-auto h-screen">
        <div className="min-w-[768px]">
          <section className="flex justify-center gap-14 w-full">
            <div>
              <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
                {product.productImages[currentImageIndex] ? (
                  <img
                    className="object-fill w-full h-full"
                    src={product.productImages[currentImageIndex]}
                    alt={`Uploaded image ${currentImageIndex + 1}`}
                  />
                ) : null}

                <div className="absolute bottom-2 right-2  gap-1.5 ">
                  <Label htmlFor="picture" className="cursor-pointer">
                    <img src={photo} alt="photo-btn" />
                  </Label>
                  <Input
                    className="cursor-pointer"
                    id="picture"
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept=".jpg, .jpeg, .png, .webp"
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6">
                {product.productImages.length === 0 ? (
                  <div className="col-span-3 grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="relative flex items-center justify-center w-full h-24 bg-gray-200 border border-dashed border-gray-400 cursor-pointer rounded"
                      >
                        <span className="text-gray-400 text-4xl">+</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  product.productImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        className="object-fit w-full h-24 rounded"
                        src={image}
                        alt={`Uploaded thumbnail ${index + 1}`}
                      />
                      <img
                        src={cancelBtn}
                        className="absolute top-0 right-0 h-6 w-6 p-1"
                        alt="이미지 삭제 버튼"
                        onClick={() => handleDeleteClick(image)}
                      />
                    </div>
                  ))
                )}

                {product.productImages.length > 0 &&
                  product.productImages.length < 3 &&
                  [...Array(3 - product.productImages.length)].map(
                    (_, index) => (
                      <div
                        key={index}
                        className="relative flex items-center justify-center w-full h-24 bg-gray-200 border border-dashed border-gray-400 cursor-pointer rounded"
                        onClick={handleEmptyImageClick}
                      >
                        <span className="text-gray-400 text-4xl">+</span>
                      </div>
                    )
                  )}
              </div>
            </div>

            <div className="flex-col space-y-8">
              <Input
                className="border-gray-700  hover:none border-b-2 mt-7"
                type="text"
                name="productName"
                placeholder="상품 이름"
                value={product.productName}
                onChange={onChange}
              />

              <Input
                className="border-gray-700 hover:none border-b-2"
                name="productPrice"
                placeholder="상품 가격"
                type="number"
                value={product.productPrice || ""}
                onChange={onChange}
                min="0"
              />

              <Input
                className="border-gray-700 hover:none border-b-2"
                type="number"
                name="productQuantity"
                placeholder="상품 수량"
                value={product.productQuantity || ""}
                onChange={onChange}
                min="0"
              />

              <div>
                <Textarea
                  className="border-black"
                  placeholder="상품 설명을 적어주세요."
                  name="productDescription"
                  value={product.productDescription}
                  onChange={onChange}
                />
              </div>

              <div className="relative">
                <select
                  name="productCategory"
                  value={product.productCategory}
                  onChange={onChange}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="NONE">카테고리를 선택하세요</option>
                  <option value="FOOD">사료</option>
                  <option value="SNACK">간식</option>
                  <option value="CLOTHING">의류</option>
                  <option value="TOY">장난감</option>
                  <option value="ACCESSORY">용품</option>
                  <option value="SUPPLEMENT">영양제</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l6-6H4l6 6zm0 1l6 6H4l6-6z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="mt-8" onClick={handleSaveProduct}>
                  상품 등록
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default ProductUpload;
