// declare module "*.svg" {
//   const SVG: (({ styles = {}, ...props }) => JSX.Element)
//   export default SVG
// }

declare module "*.css" {
  const CSS: any
  export default CSS
}