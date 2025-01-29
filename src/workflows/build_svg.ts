import { writeFile } from "../lib/utils.ts"



/**
 * Generates an SVG string representation of a circle with the specified color.
 *
 * @param {Colour} colour - The color of the circle.
 * @return {string} The SVG string representation of the circle.
 */
function createSVG ({hex}: Colour): string {
  return `
  <svg width="100%" height="100%" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="64" fill="#${hex}" />
  </svg>
  `
}



/**
 * Builds SVG previews for each colour in the palette.
 *
 * @param {Colour[]} palette - An array of Colour objects representing the colours to build SVG previews for.
 * @return {void} This function does not return a value.
 */
export function buildSVGPreviews(palette: Colour[]): void {
  palette.forEach(colour => {
    writeFile(`./assets/palette/${colour.name.toLowerCase()}.svg`, createSVG(colour));
  });
}
