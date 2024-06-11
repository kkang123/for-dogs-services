// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Product } from "@/interface/product";

// import { auth, storage, db } from "@/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { Timestamp, collection, setDoc, doc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// import SEOMetaTag from "@/components/SEOMetaTag";

// import ProductHeader from "@/components/Header/ProductHeader";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// import photo from "@/assets/icon-photo.svg";

// import Swal from "sweetalert2";

// function ProductUpload() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState<string | null>(null);
//   const goToProductPage = () => {
//     if (userId) navigate(`/productlist/${userId}`);
//   };

//   const [isLoading, setIsLoading] = useState(true);
//   const [sellerId, setSellerId] = useState<string>("");
//   const [productName, setProductName] = useState<string>("");
//   const [productPrice, setProductPrice] = useState<number | null>(null);
//   const [productQuantity, setProductQuantity] = useState<number | null>(null);
//   const [productDescription, setProductDescription] = useState<string>("");
//   const [productCategory, setProductCategory] = useState<string>("");

//   const [productImage, setProductImage] = useState<string[]>([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const [newProduct, setNewProduct] = useState<Product>({
//     id: Date.now(),
//     sellerId: sellerId,
//     productName: productName,
//     productPrice: productPrice,
//     productQuantity: productQuantity,
//     productDescription: productDescription,
//     productCategory: productCategory,
//     productImage: [],
//     createdAt: Timestamp.fromDate(new Date()),
//     updatedAt: Timestamp.fromDate(new Date()),
//   });

//   const handlePrevClick = () => {
//     setCurrentImageIndex(
//       (prevIndex) => (prevIndex - 1 + productImage.length) % productImage.length
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImage.length);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         setSellerId(user.uid);
//         setNewProduct((prevProduct) => ({
//           ...prevProduct,
//           sellerId: user.uid,
//         }));
//       }
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

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

//     await setNewProduct((prevProduct) => ({
//       ...prevProduct,
//       productImage: productImage,
//       sellerId: sellerId,
//       productName: productName,
//       productPrice: productPrice ? productPrice : 0,
//       productQuantity: productQuantity ? productQuantity : 0,
//       productDescription: productDescription,
//       productCategory: productCategory,
//     }));

//     try {
//       const productRef = doc(
//         collection(db, "products"),
//         newProduct.id.toString()
//       );
//       await setDoc(productRef, newProduct);
//       Swal.fire({
//         icon: "success",
//         title: "제품 업로드 완료",
//         text: "제품이 성공적으로 업로드되었습니다.",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           goToProductPage();
//         }
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Error: ", error.message);
//       }
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
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

//     setNewProduct((prevProduct: Product) => ({
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
//     setNewProduct((prevProduct) => ({
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
//           title="For Dogs - ProductUpload"
//           description="상품 업로드 페이지입니다."
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
//                   accept=".jpg, .jpeg, .png, .webp"
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

// export default ProductUpload;

// 2

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Product } from "@/interface/product";

// import { basicAxios } from "@/api/axios";
// import SEOMetaTag from "@/components/SEOMetaTag";

// import ProductHeader from "@/components/Header/ProductHeader";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import photo from "@/assets/icon-photo.svg";
// import Swal from "sweetalert2";

// function ProductUpload() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState<string | null>(null);
//   const goToProductPage = () => {
//     if (userId) navigate(`/productlist/${userId}`);
//   };

//   const [isLoading, setIsLoading] = useState(true);
//   const [sellerId, setSellerId] = useState<string>("");
//   const [productName, setProductName] = useState<string>("");
//   const [productPrice, setProductPrice] = useState<number | null>(null);
//   const [productQuantity, setProductQuantity] = useState<number | null>(null);
//   const [productDescription, setProductDescription] = useState<string>("");
//   const [productCategory, setProductCategory] = useState<string>("");
//   const [productImages, setProductImages] = useState<string[]>([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     // Mock user authentication check
//     const mockUserId = "mockUserId";
//     setUserId(mockUserId);
//     setSellerId(mockUserId);
//     setIsLoading(false);
//   }, []);

//   const handlePrevClick = () => {
//     setCurrentImageIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + productImages.length) % productImages.length
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
//   };

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
//       productImages.length === 0
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "비어있는 상품 정보를 작성해주세요.",
//       });
//       return;
//     }

//     const newProduct = {
//       productName,
//       productPrice,
//       productQuantity,
//       productDescription,
//       productCategory,
//       productImages,
//     };

//     try {
//       const response = await basicAxios.post("/products/register", newProduct);

//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "제품 업로드 완료",
//           text: "제품이 성공적으로 업로드되었습니다.",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             goToProductPage();
//           }
//         });
//       } else {
//         throw new Error("제품 업로드 중 문제가 발생했습니다.");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
//       });
//       console.error("Error adding product: ", error);
//     }
//   };

//   const onChange = (
//     event: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const name = event.target.name;
//     const value = event.target.value;

//     switch (name) {
//       case "productName":
//         setProductName(value);
//         break;
//       case "productDescription":
//         setProductDescription(value);
//         break;
//       case "productCategory":
//         setProductCategory(value);
//         break;
//       case "productPrice":
//         setProductPrice(Number(value));
//         break;
//       case "productQuantity":
//         setProductQuantity(Number(value));
//         break;
//       default:
//         break;
//     }
//   };

//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
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
//     const uploadPromises = files.map(async (file) => {
//       const formData = new FormData();
//       formData.append("imageFiles", file);
//       try {
//         const response = await basicAxios.post(
//           "/products/images/upload",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         if (response.status === 200) {
//           const data = response.data;
//           downloadURLs.push(data.imageUrl);
//         } else {
//           console.error(`파일 업로드 실패: ${file.name}`);
//         }
//       } catch (error) {
//         console.error(`업로드 실패: ${file.name}`, error);
//       }
//     });

//     await Promise.all(uploadPromises);
//     setProductImages(downloadURLs);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <header>
//         <ProductHeader showBackspaseButton={true} showEditButton={false} />
//         <SEOMetaTag
//           title="For Dogs - ProductUpload"
//           description="상품 업로드 페이지입니다."
//         />
//       </header>

//       <main>
//         <form
//           className="flex justify-center mt-[70px] "
//           style={{ minWidth: "800px" }}
//         >
//           <section>
//             <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
//               {productImages[currentImageIndex] ? (
//                 <img
//                   className="object-fill w-full h-full"
//                   src={productImages[currentImageIndex]}
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
//                   accept=".jpg, .jpeg, .png, .webp"
//                   style={{ display: "none" }}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="productName">Product Name</Label>
//               <Input
//                 id="productName"
//                 name="productName"
//                 value={productName}
//                 onChange={onChange}
//               />

//               <Label htmlFor="productPrice">Product Price</Label>
//               <Input
//                 id="productPrice"
//                 name="productPrice"
//                 type="number"
//                 value={productPrice !== null ? productPrice.toString() : ""}
//                 onChange={onChange}
//               />

//               <Label htmlFor="productQuantity">Product Quantity</Label>
//               <Input
//                 id="productQuantity"
//                 name="productQuantity"
//                 type="number"
//                 value={
//                   productQuantity !== null ? productQuantity.toString() : ""
//                 }
//                 onChange={onChange}
//               />

//               <Label htmlFor="productDescription">Product Description</Label>
//               <Textarea
//                 id="productDescription"
//                 name="productDescription"
//                 value={productDescription}
//                 onChange={onChange}
//               />

//               <Label htmlFor="productCategory">Product Category</Label>
//               <Input
//                 id="productCategory"
//                 name="productCategory"
//                 value={productCategory}
//                 onChange={onChange}
//               />

//               {/* <Label htmlFor="productImages">Product Images</Label>
//               <Input
//                 id="productImages"
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileSelect}
//               /> */}

//               {/* {productImages.length > 0 && (
//                   <div>
//                     <button type="button" onClick={handlePrevClick}>
//                       Previous
//                     </button>
//                     <img src={productImages[currentImageIndex]} alt="Product" />
//                     <button type="button" onClick={handleNextClick}>
//                       Next
//                     </button>
//                   </div>
//                 )} */}

//               <Button onClick={handleSaveProduct}>Save Product</Button>
//             </div>

//             {/* // 12 */}
//           </section>
//         </form>
//       </main>
//     </>
//   );
// }

// export default ProductUpload;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Product } from "@/interface/product";

// import { basicAxios } from "@/api/axios";
// import SEOMetaTag from "@/components/SEOMetaTag";

// import ProductHeader from "@/components/Header/ProductHeader";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import photo from "@/assets/icon-photo.svg";
// import Swal from "sweetalert2";

// function ProductUpload() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState<string | null>(null);
//   const goToProductPage = () => {
//     if (userId) navigate(`/productlist/${userId}`);
//   };

//   const [isLoading, setIsLoading] = useState(true);
//   const [sellerId, setSellerId] = useState<string>("");
//   const [productName, setProductName] = useState<string>("");
//   const [productPrice, setProductPrice] = useState<number | null>(null);
//   const [productQuantity, setProductQuantity] = useState<number | null>(null);
//   const [productDescription, setProductDescription] = useState<string>("");
//   const [productCategory, setProductCategory] = useState<string>("");
//   const [productImages, setProductImages] = useState<string[]>([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const mockUserId = "mockUserId";
//     setUserId(mockUserId);
//     setSellerId(mockUserId);
//     setIsLoading(false);
//   }, []);

//   const handlePrevClick = () => {
//     setCurrentImageIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + productImages.length) % productImages.length
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
//   };

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
//       productImages.length === 0
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "비어있는 상품 정보를 작성해주세요.",
//       });
//       return;
//     }

//     const newProduct = {
//       productName,
//       productPrice,
//       productQuantity,
//       productDescription,
//       productCategory,
//       productImages,
//     };

//     try {
//       const response = await basicAxios.post("/products/register", newProduct);

//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "제품 업로드 완료",
//           text: "제품이 성공적으로 업로드되었습니다.",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             goToProductPage();
//           }
//         });
//       } else {
//         throw new Error("제품 업로드 중 문제가 발생했습니다.");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "제품 업로드 실패",
//         text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
//       });
//       console.error("Error adding product: ", error);
//     }
//   };

//   const onChange = (
//     event: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const name = event.target.name;
//     const value = event.target.value;

//     switch (name) {
//       case "productName":
//         setProductName(value);
//         break;
//       case "productDescription":
//         setProductDescription(value);
//         break;
//       case "productCategory":
//         setProductCategory(value);
//         break;
//       case "productPrice":
//         setProductPrice(Number(value));
//         break;
//       case "productQuantity":
//         setProductQuantity(Number(value));
//         break;
//       default:
//         break;
//     }
//   };

//   const handleFileSelect = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
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
//     const uploadPromises = files.map(async (file) => {
//       const formData = new FormData();
//       formData.append("imageFiles", file);
//       try {
//         const response = await basicAxios.post(
//           "/products/images/upload",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         if (response.status === 200) {
//           const data = response.data;
//           console.log("Server response data:", data);
//           if (
//             data &&
//             data.result &&
//             data.result.uploadedImages &&
//             data.result.uploadedImages[0] &&
//             data.result.uploadedImages[0].imageFileUrl
//           ) {
//             const imageUrl = data.result.uploadedImages[0].imageFileUrl;
//             console.log(`Uploaded file URL: ${imageUrl}`);
//             downloadURLs.push(imageUrl);
//           } else {
//             console.error("imageFileUrl not found in response data");
//           }
//         } else {
//           console.error(`파일 업로드 실패: ${file.name}`);
//         }
//       } catch (error) {
//         console.error(`업로드 실패: ${file.name}`, error);
//       }
//     });

//     await Promise.all(uploadPromises);
//     setProductImages(downloadURLs);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <header>
//         <ProductHeader showBackspaseButton={true} showEditButton={false} />
//         <SEOMetaTag
//           title="For Dogs - ProductUpload"
//           description="상품 업로드 페이지입니다."
//         />
//       </header>

//       <main>
//         <form
//           className="flex justify-center mt-[70px] "
//           style={{ minWidth: "800px" }}
//         >
//           <section>
//             <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
//               {productImages[currentImageIndex] ? (
//                 <img
//                   className="object-fill w-full h-full"
//                   src={productImages[currentImageIndex]}
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
//                   accept=".jpg, .jpeg, .png, .webp"
//                   style={{ display: "none" }}
//                 />
//               </div>
//             </div>

//             <div>
//               <Input
//                 className="border-gray-700 mt-8 hover:none border-b-2"
//                 type="text"
//                 name="productName"
//                 placeholder="상품 이름"
//                 value={productName}
//                 onChange={onChange}
//               />

//               <Input
//                 className="border-gray-700 mt-3 hover:none border-b-2"
//                 name="productPrice"
//                 placeholder="상품 가격"
//                 type="number"
//                 value={productPrice || ""}
//                 onChange={onChange}
//               />

//               <Input
//                 className="border-gray-700 mt-2 hover:none border-b-2"
//                 type="number"
//                 name="productQuantity"
//                 placeholder="상품 수량"
//                 value={productQuantity || ""}
//                 onChange={onChange}
//               />

//               <div>
//                 <Textarea
//                   className="border-black mt-3"
//                   placeholder="상품 설명을 적어주세요."
//                   name="productDescription"
//                   value={productDescription}
//                   onChange={onChange}
//                 />
//               </div>

//               <div className="mt-1 relative">
//                 <select
//                   name="productCategory"
//                   value={productCategory}
//                   onChange={onChange}
//                   className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//                 >
//                   <option value="NONE">카테고리를 선택하세요</option>
//                   <option value="FOOD">사료</option>
//                   <option value="SNACK">간식</option>
//                   <option value="CLOTHING">의류</option>
//                   <option value="TOY">장난감</option>
//                   <option value="ACCESSORY">용품</option>
//                   <option value="SUPPLEMENT">영양제</option>
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                   <svg
//                     className="fill-current h-4 w-4"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M10 12l6-6H4l6 6zm0 1l6 6H4l6-6z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex justify-center">
//                 <Button className="mt-3" onClick={handleSaveProduct}>
//                   완료
//                 </Button>
//               </div>
//             </div>
//           </section>
//         </form>
//       </main>
//     </>
//   );
// }

// export default ProductUpload;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/interface/product";

import { basicAxios } from "@/api/axios";
import SEOMetaTag from "@/components/SEOMetaTag";

import ProductHeader from "@/components/Header/ProductHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import photo from "@/assets/icon-photo.svg";
import Swal from "sweetalert2";

function ProductUpload() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const goToProductPage = () => {
    if (userId) navigate(`/productlist/${userId}`);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string>("");
  const [product, setProduct] = useState<Product>({
    productName: "",
    productPrice: 0,
    productQuantity: 0,
    productDescription: "",
    productCategory: "NONE",
    productImages: [],
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const mockUserId = "mockUserId";
    setUserId(mockUserId);
    setSellerId(mockUserId);
    setIsLoading(false);
  }, []);

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.productImages.length) %
        product.productImages.length
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.productImages.length
    );
  };

  const handleSaveProduct = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

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
      });
      return;
    }

    //   try {
    //     const response = await basicAxios.post("/products/register", product);
    //     console.log("서버 응답 데이터:", response.data);

    //     if (response.status === 200) {
    //       Swal.fire({
    //         icon: "success",
    //         title: "제품 업로드 완료",
    //         text: "제품이 성공적으로 업로드되었습니다.",
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           goToProductPage();
    //         }
    //       });
    //     } else {
    //       throw new Error("제품 업로드 중 문제가 발생했습니다.");
    //     }
    //   } catch (error) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "제품 업로드 실패",
    //       text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
    //     });
    //     console.error("제품 추가 중 에러: ", error);
    //   }
    // };

    try {
      const response = await basicAxios.post("/products/register", product);
      console.log("서버 응답 데이터:", response.data);

      if (response.status === 201) {
        if (response.data.ok) {
          Swal.fire({
            icon: "success",
            title: "제품 업로드 완료",
            text: "제품이 성공적으로 업로드되었습니다.",
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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "제품 업로드 실패",
        text: "제품 업로드 중 문제가 발생했습니다. 다시 시도해주세요.",
      });
      console.error("제품 추가 중 에러: ", error);
    }
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = event.target.name;
    const value = event.target.value;

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
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("imageFiles", file);
      try {
        const response = await basicAxios.post(
          "/products/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header>
        <ProductHeader showBackspaseButton={true} showEditButton={false} />
        <SEOMetaTag
          title="For Dogs - ProductUpload"
          description="상품 업로드 페이지입니다."
        />
      </header>

      <main>
        <form
          className="flex justify-center mt-[70px] "
          style={{ minWidth: "800px" }}
        >
          <section>
            <div className="rounded border-2 shadow-lg shadow-gray-600 w-[480px] h-[420px] relative">
              {product.productImages[currentImageIndex] ? (
                <img
                  className="object-fill w-full h-full"
                  src={product.productImages[currentImageIndex]}
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

              <div className="absolute bottom-2 right-2   gap-1.5 ">
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

            <div>
              <Input
                className="border-gray-700 mt-8 hover:none border-b-2"
                type="text"
                name="productName"
                placeholder="상품 이름"
                value={product.productName}
                onChange={onChange}
              />

              <Input
                className="border-gray-700 mt-3 hover:none border-b-2"
                name="productPrice"
                placeholder="상품 가격"
                type="number"
                value={product.productPrice || ""}
                onChange={onChange}
              />

              <Input
                className="border-gray-700 mt-2 hover:none border-b-2"
                type="number"
                name="productQuantity"
                placeholder="상품 수량"
                value={product.productQuantity || ""}
                onChange={onChange}
              />

              <div>
                <Textarea
                  className="border-black mt-3"
                  placeholder="상품 설명을 적어주세요."
                  name="productDescription"
                  value={product.productDescription}
                  onChange={onChange}
                />
              </div>

              <div className="mt-1 relative">
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
                <Button className="mt-3" onClick={handleSaveProduct}>
                  완료
                </Button>
              </div>
            </div>
          </section>
        </form>
      </main>
    </>
  );
}

export default ProductUpload;
