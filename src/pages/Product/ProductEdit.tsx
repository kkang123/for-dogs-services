// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import { basicAxios } from "@/api/axios";

// import { userState } from "@/recoil/userState";
// import { Product } from "@/interface/product";
// import useAuth from "@/hooks/useAuth";

// import ProductHeader from "@/components/Header/ProductHeader";
// import SEOMetaTag from "@/components/SEOMetaTag";

// import photo from "@/assets/icon-photo.svg";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// import Swal from "sweetalert2";

// function ProductEdit() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [sellerId, setSellerId] = useState<string>("");
//   const [productName, setProductName] = useState<string>("");
//   const [productPrice, setProductPrice] = useState<number | null>(null);
//   const [productQuantity, setProductQuantity] = useState<number | null>(null);
//   const [productDescription, setProductDescription] = useState<string>("");
//   const [productCategory, setProductCategory] = useState<string>("");
//   const [productImage, setProductImage] = useState<string[]>([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const user = useRecoilValue(userState);

//   const { checkAndRefreshToken } = useAuth();

//   if (id === undefined) {
//     throw new Error("ID is missing");
//   }

//   const idNumber = Number(id);

//   const [editedProduct, setEditedProduct] = useState<Product>({
//     productName: productName,
//     productPrice: productPrice,
//     productQuantity: productQuantity,
//     productDescription: productDescription,
//     productCategory: productCategory,
//     productImages: [],
//   });

//   const handlePrevClick = () => {
//     setCurrentImageIndex(
//       (prevIndex) => (prevIndex - 1 + productImage.length) % productImage.length
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
//   };

//   try{
//     const response = await basicAxios.patch("/products/{productId}",
//     )
//   }

//   useEffect(() => {
//     const loadProductData = async () => {
//       const productSnap = await getDoc(doc(db, "products", id));

//       if (productSnap.exists()) {
//         const productData = productSnap.data() as Product;
//         setSellerId(productData.sellerId);
//         setProductName(productData.productName);
//         setProductPrice(productData.productPrice);
//         setProductQuantity(productData.productQuantity);
//         setProductDescription(productData.productDescription);
//         setProductCategory(productData.productCategory);
//         setProductImage(productData.productImages);
//         setEditedProduct(productData);
//       }

//       setIsLoading(false);
//     };

//     loadProductData();
//   }, [id]);

//   const handleSaveProduct = async (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();

//     if (
//       !productName ||
//       productPrice === null ||
//       productPrice <= 0 ||
//       productPrice >= 100000000 ||
//       productQuantity === null ||
//       productQuantity <= 0 ||
//       !productDescription ||
//       !productCategory ||
//       productImage.length === 0
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "비어있는 상품 정보를 작성해주세요.",
//       });
//       return;
//     }

//     await setEditedProduct((prevProduct) => ({
//       ...prevProduct,
//       productImage: productImage,
//       sellerId: sellerId,
//       productName: productName,
//       productPrice: productPrice ? productPrice : 0,
//       productQuantity: productQuantity ? productQuantity : 0,
//       productDescription: productDescription,
//       productCategory: productCategory,
//       updatedAt: Timestamp.fromDate(new Date()),
//     }));

//     try {
//       await updateDoc(doc(db, "products", id), {
//         ...editedProduct,
//         createdAt: editedProduct.createdAt.toDate(),
//         updatedAt: serverTimestamp(),
//       });
//       Swal.fire({
//         icon: "success",
//         title: "제품 수정 완료",
//         text: "제품이 성공적으로 수정되었습니다.",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate(`/productdetail/${id}`);
//         }
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Error: ", error.message);
//       }
//       Swal.fire({
//         icon: "error",
//         title: "제품 수정 실패",
//         text: "제품 수정 중 문제가 발생했습니다. 다시 시도해주세요.",
//       });
//       if (error instanceof Error) {
//         console.error("Error adding document: ", error.message);
//       }
//     }
//   };

//   const onChange = (
//     event: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     event.preventDefault();
//     const name = event.target.getAttribute("name");
//     const value = event.target.value;
//     let parsedValue: string | number | null;

//     if (name === "productPrice" || name === "productQuantity") {
//       parsedValue = value ? Number(value) : null;
//     } else {
//       parsedValue = value;
//     }

//     if (
//       name === "productName" &&
//       typeof parsedValue === "string" &&
//       parsedValue.length > 20
//     ) {
//       return;
//     }

//     switch (name) {
//       case "productName":
//         setProductName(parsedValue as string);
//         break;
//       case "productDescription":
//         setProductDescription(parsedValue as string);
//         break;
//       case "productCategory":
//         setProductCategory(parsedValue as string);
//         break;
//       case "productPrice":
//         setProductPrice(parsedValue as number);
//         break;
//       case "productQuantity":
//         setProductQuantity(parsedValue as number);
//         break;
//       default:
//         break;
//     }

//     setEditedProduct((prevProduct: Product) => ({
//       ...prevProduct,
//       [name as string]: parsedValue,
//     }));
//   };

//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     event.preventDefault();
//     const files = event.target.files;

//     if (files && files.length <= 3) {
//       const selectedFiles = Array.from(files);
//       try {
//         await handleUpload(selectedFiles);
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "이미지 초과",
//         text: "3장만 업로드해주세요.",
//       });
//     }
//   };

//   const handleUpload = async (files: File[]) => {
//     const downloadURLs: string[] = [];
//     for (const file of files) {
//       if (auth.currentUser) {
//         const imageRef = ref(storage, `${auth.currentUser.uid}/${file.name}`);
//         try {
//           const webpFile = await convertToWebP(file);
//           await uploadBytes(imageRef, webpFile);
//         } catch (error) {
//           console.error("업로드 실패: ", error);
//           return;
//         }
//         let downloadURL;
//         try {
//           downloadURL = await getDownloadURL(imageRef);
//         } catch (error) {
//           console.error("URL 가져오기 실패: ", error);
//           return;
//         }
//         downloadURLs.push(downloadURL);
//       }
//     }
//     setProductImage(downloadURLs);
//   };

//   const convertToWebP = (file: File) => {
//     return new Promise<File>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const image = new Image();
//         image.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = image.width;
//           canvas.height = image.height;
//           const context = canvas.getContext("2d");

//           if (context) {
//             context.drawImage(image, 0, 0);
//             canvas.toBlob((blob) => {
//               if (blob) {
//                 const webpFile = new File([blob], file.name, {
//                   type: "image/webp",
//                 });
//                 resolve(webpFile);
//               } else {
//                 reject(new Error("Failed to convert image to webp."));
//               }
//             }, "image/webp");
//           } else {
//             reject(new Error("Failed to create canvas context."));
//           }
//         };
//         image.src = event.target?.result as string;
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   useEffect(() => {
//     setEditedProduct((prevProduct) => ({
//       ...prevProduct,
//       productImage: productImage,
//     }));
//   }, [productImage]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <header className="h-20">
//         <ProductHeader showBackspaseButton={true} showEditButton={false} />
//         <SEOMetaTag
//           title="For Dogs - ProductEdit"
//           description="상품 수정 페이지입니다."
//         />
//       </header>
//       <main>
//         <form
//           className="flex justify-center mt-[70px] "
//           style={{ minWidth: "800px" }}
//         >
//           <section>
//             <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
//               {productImage[currentImageIndex] ? (
//                 <img
//                   className="object-fill w-full h-full"
//                   src={productImage[currentImageIndex]}
//                   alt={`Uploaded image ${currentImageIndex + 1}`}
//                 />
//               ) : null}

//               <Button
//                 type="button"
//                 variant="outline"
//                 size="icon"
//                 onClick={handlePrevClick}
//                 className="absolute left-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pr-1 text-white bg-black border-black"
//               >
//                 &lt;
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="icon"
//                 onClick={handleNextClick}
//                 className="absolute right-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pl-1 text-white bg-black border-black"
//               >
//                 &gt;
//               </Button>

//               <div className="absolute bottom-2 right-2   gap-1.5 ">
//                 <Label htmlFor="picture" className="cursor-pointer">
//                   <img src={photo} alt="photo-btn" />
//                 </Label>
//                 <Input
//                   className="cursor-pointer"
//                   id="picture"
//                   type="file"
//                   onChange={handleFileSelect}
//                   multiple
//                   accept=".jpg, .jpeg, .png"
//                   style={{ display: "none" }}
//                 />
//               </div>
//             </div>

//             <Input
//               className="border-gray-700 mt-8 hover:none border-b-2"
//               type="text"
//               name="productName"
//               placeholder="상품 이름"
//               value={productName}
//               onChange={onChange}
//             />

//             <Input
//               className="border-gray-700 mt-3 hover:none border-b-2"
//               name="productPrice"
//               placeholder="상품 가격"
//               type="number"
//               value={productPrice || ""}
//               onChange={onChange}
//             />
//             <div>
//               <Input
//                 className="border-gray-700 mt-2 hover:none border-b-2"
//                 type="number"
//                 name="productQuantity"
//                 placeholder="상품 수량"
//                 value={productQuantity || ""}
//                 onChange={onChange}
//               />
//             </div>

//             <div>
//               <Textarea
//                 className="border-black mt-3"
//                 placeholder="상품 설명을 적어주세요."
//                 name="productDescription"
//                 value={productDescription}
//                 onChange={onChange}
//               />
//             </div>

//             <div className="mt-1 relative">
//               <select
//                 name="productCategory"
//                 value={productCategory}
//                 onChange={onChange}
//                 className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//               >
//                 <option value="">카테고리를 선택하세요</option>
//                 <option value="사료">사료</option>
//                 <option value="간식">간식</option>
//                 <option value="의류">의류</option>
//                 <option value="장난감">장난감</option>
//                 <option value="용품">용품</option>
//                 <option value="영양제">영양제</option>
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg
//                   className="fill-current h-4 w-4"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 12l6-6H4l6 6zm0 1l6 6H4l6-6z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex justify-center">
//               <Button className="mt-3" onClick={handleSaveProduct}>
//                 완료
//               </Button>
//             </div>
//           </section>
//         </form>
//       </main>
//     </>
//   );
// }

// export default ProductEdit;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { basicAxios } from "@/api/axios";
import { userState } from "@/recoil/userState";
import { Product } from "@/interface/product";
import useAuth from "@/hooks/useAuth";
import ProductHeader from "@/components/Header/ProductHeader";
import SEOMetaTag from "@/components/SEOMetaTag";
import photo from "@/assets/icon-photo.svg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

function ProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState<number | null>(null);
  const [productDescription, setProductDescription] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productImage, setProductImage] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const user = useRecoilValue(userState);
  const { checkAndRefreshToken } = useAuth();

  if (id === undefined) {
    throw new Error("ID is missing");
  }

  const [editedProduct, setEditedProduct] = useState<Product>({
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "NONE",
    productImages: [],
  });

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + productImage.length) % productImage.length
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
  };

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const response = await basicAxios.get(`/products/${productId}`);
        if (response.status === 200) {
          const productData = response.data as Product;
          setSellerId(productData.sellerId);
          setProductName(productData.productName);
          setProductPrice(productData.productPrice);
          setProductQuantity(productData.productQuantity);
          setProductDescription(productData.productDescription);
          setProductCategory(productData.productCategory);
          setProductImage(productData.productImages);
          setEditedProduct(productData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product data: ", error);
      }
    };
    loadProductData();
  }, [id]);

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (
      !productName ||
      productPrice === null ||
      productPrice <= 0 ||
      productPrice >= 100000000 ||
      productQuantity === null ||
      productQuantity <= 0 ||
      !productDescription ||
      !productCategory ||
      productImage.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "비어있는 상품 정보를 작성해주세요.",
      });
      return;
    }

    const updatedProduct: Product = {
      ...editedProduct,
      productName,
      productPrice: productPrice || 0,
      productQuantity: productQuantity || 0,
      productDescription,
      productCategory,
      productImages: productImage,
      sellerId,
    };

    try {
      await checkAndRefreshToken();
      const response = await basicAxios.patch(
        `/products/${productId}`,
        updatedProduct
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "제품 수정 완료",
          text: "제품이 성공적으로 수정되었습니다.",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/productdetail/${productId}`);
          }
        });
      }
    } catch (error) {
      console.error("Failed to update product: ", error);
      Swal.fire({
        icon: "error",
        title: "제품 수정 실패",
        text: "제품 수정 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    let parsedValue: string | number | null;

    if (name === "productPrice" || name === "productQuantity") {
      parsedValue = value ? Number(value) : null;
    } else {
      parsedValue = value;
    }

    switch (name) {
      case "productName":
        setProductName(parsedValue as string);
        break;
      case "productDescription":
        setProductDescription(parsedValue as string);
        break;
      case "productCategory":
        setProductCategory(parsedValue as string);
        break;
      case "productPrice":
        setProductPrice(parsedValue as number);
        break;
      case "productQuantity":
        setProductQuantity(parsedValue as number);
        break;
      default:
        break;
    }

    setEditedProduct((prevProduct: Product) => ({
      ...prevProduct,
      [name]: parsedValue,
    }));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const files = event.target.files;

    if (files && files.length <= 3) {
      const selectedFiles = Array.from(files);
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
      });
    }
  };

  const handleUpload = async (files: File[]) => {
    const downloadURLs: string[] = [];
    for (const file of files) {
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
          if (
            data &&
            data.result &&
            data.result.uploadedImages &&
            data.result.uploadedImages[0] &&
            data.result.uploadedImages[0].imageFileUrl
          ) {
            const imageUrl = data.result.uploadedImages[0].imageFileUrl;
            downloadURLs.push(imageUrl);
          } else {
            console.error("imageFileUrl not found in response data");
          }
        } else {
          console.error(`파일 업로드 실패: ${file.name}`);
        }
      } catch (error) {
        console.error(`업로드 실패: ${file.name}`, error);
      }
    }
    setProductImage(downloadURLs);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="h-20">
        <ProductHeader showBackspaseButton={true} showEditButton={false} />
        <SEOMetaTag
          title="For Dogs - ProductEdit"
          description="상품 수정 페이지입니다."
        />
      </header>
      <main>
        <form
          className="flex justify-center mt-[70px] "
          style={{ minWidth: "800px" }}
        >
          <section>
            <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
              {productImage[currentImageIndex] ? (
                <img
                  className="object-fill w-full h-full"
                  src={productImage[currentImageIndex]}
                  alt={`Uploaded image ${currentImageIndex + 1}`}
                />
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrevClick}
                className="absolute left-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pr-1 text-white bg-black border-black"
              >
                &lt;
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNextClick}
                className="absolute right-0 top-1/2 h-6 w-6 rounded-full font-bold pt-1 pl-1 text-white bg-black border-black"
              >
                &gt;
              </Button>

              <div className="absolute bottom-2 right-2 gap-2">
                <Label htmlFor="image">
                  <img src={photo} alt="photo" className="w-6" />
                </Label>
                <Input
                  id="image"
                  type="file"
                  name="productImage"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="border-2 border-black rounded shadow-lg shadow-gray-600 px-5 py-5 space-y-3 mt-10">
              <Label htmlFor="productName">제품 이름</Label>
              <Input
                id="productName"
                type="text"
                name="productName"
                placeholder="제품 이름"
                value={productName}
                onChange={onChange}
              />
              <Label htmlFor="productDescription">제품 설명</Label>
              <Textarea
                id="productDescription"
                name="productDescription"
                placeholder="제품 설명"
                value={productDescription}
                onChange={onChange}
              />
              <Label htmlFor="productCategory">제품 카테고리</Label>
              <Input
                id="productCategory"
                type="text"
                name="productCategory"
                placeholder="제품 카테고리"
                value={productCategory}
                onChange={onChange}
              />
              <Label htmlFor="productPrice">제품 가격</Label>
              <Input
                id="productPrice"
                type="number"
                name="productPrice"
                placeholder="제품 가격"
                value={productPrice ?? ""}
                onChange={onChange}
              />
              <Label htmlFor="productQuantity">제품 수량</Label>
              <Input
                id="productQuantity"
                type="number"
                name="productQuantity"
                placeholder="제품 수량"
                value={productQuantity ?? ""}
                onChange={onChange}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full"
                onClick={handleSaveProduct}
              >
                제품 수정
              </Button>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}

export default ProductEdit;
