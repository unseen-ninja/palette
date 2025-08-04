import { readFile, writeFile, adjustValue, buildTimeStamp } from "../lib/utils.ts"



/**
 * Builds a single HTML div element representing a color swatch.
 *
 * @param {Colour} colour - The color object containing the name.
 * @param {LCH} lch - The LCH color values for the swatch.
 * @param {string} variant - The swatch variant (e.g., 'regular', 'light', 'dark').
 * @returns {string} HTML string for the swatch div.
 */
function buildSwatchColour({ name }: Colour, { lightness, chroma, hue }: LCH, variant: string): string {
  const swatchCSSVar: string = variant == 'regular' ? `var(--${name.toLowerCase()})` : `var(--${name.toLowerCase()}-${variant})`

  return `
    <div
      class="swatch"
      style="--swatch-colour: ${swatchCSSVar}"
      onclick="copyToClipboard('lch(${lightness}% ${chroma} ${hue})')"
    "></div>
  `
}



/**
 * Builds an HTML card containing swatches for a color and its variants.
 *
 * @param {Colour} colour - The base color object.
 * @param {Settings} settings - Configuration for generating swatch variants.
 * @returns {string} HTML string for the swatch card.
 */
function buildSwatchCard (colour: Colour, settings: Settings): string {

  let colourSwatches = ``

  colourSwatches += buildSwatchColour(colour, colour.lch, 'regular')

  if (colour.role === 'accent') {
    const variants = settings.variants
    const offsets = settings.offsets

    for (const variant of variants) {
      const operations = settings.operations[variant]

      const lch: LCH = {
        lightness: adjustValue(colour.lch.lightness, offsets.lightness, operations.lightness),
        chroma: adjustValue(colour.lch.chroma, offsets.chroma, operations.chroma),
        hue: adjustValue(colour.lch.hue, offsets.hue, operations.hue)
      }

      colourSwatches += buildSwatchColour(colour, lch, variant)
    }
  }

  return `
    <div class="swatch-card">
      ${colourSwatches}
      <h3 class="swatch-name">${colour.name}</h3>
    </div>
  `
}



/**
 * Builds the full HTML markup for all accent color swatch cards in the palette.
 *
 * @param {Colour[]} palette - Array of color objects.
 * @param {Settings} settings - Configuration for swatch generation.
 * @returns {string} Combined HTML string for all swatch cards.
 */
function buildPalette(palette: Colour[], settings: Settings): string {
  return palette
    .filter(colour => colour.role == 'accent')
    .map(colour => buildSwatchCard(colour, settings))
    .join('')
}



/**
 * Generates the final documentation HTML file by injecting the palette and timestamp into a template.
 *
 * @param {Colour[]} palette - Array of color objects.
 * @param {Settings} settings - Configuration for swatch generation.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function buildDocsFile(palette: Colour[], settings: Settings): Promise<void> {
  const output = buildPalette(palette, settings);

  return await readFile('./src/templates/docs.tpl')
    .then(template => template.replace('%PALETTE%', output)
      .replace('%TIMESTAMP%', buildTimeStamp()))
    .then(template => writeFile('docs/index.html', template));
}
