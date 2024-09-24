// declare module "*.svg" {
//   import React from "react";
//   const src: string;
//   export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
//   export default src;
// }

declare module "*.svg" {
  import React from "react";

  const content: string; // 기본 export
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>; // ReactComponent로 export

  export default content; // 기본 export로 string을 반환
}
