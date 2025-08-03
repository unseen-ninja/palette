import { readFile, writeFile } from "../lib/utils.ts"



/**
 * Builds a div representing a single colour.
 *
 * @param {Colour} colour - The colour object to be represented.
 * @return {string} The HTML string representing the div.
 */
function buildColourDiv({ name, hex }: Colour): string {
  return `
  <div
    aria-label="${name}"
    class="palette-entry"
    style="--swatch-colour: #${hex}"
    onClick="clickTrigger('#${hex}')"
  ">
  </div>
  `
}



/**
 * Builds a table HTML string representing a list of colours.
 *
 * @param {Colour[]} palette - An array of Colour objects.
 * @return {string} The HTML string representing the table.
 */
function buildPalette(palette: Colour[]): string {

  const [accentSwatches, baseSwatched] = palette.reduce(
    (rows, colour) => {
      rows[colour.role === 'accent' ? 0 : 1].push(buildColourDiv(colour))
      return rows
    },
    [[] as string[], [] as string[]]
  )

  return [ accentSwatches.join(''), baseSwatched.join('')].join('')
}



/**
 * Builds a README file based on the provided palette and settings.
 *
 * @param {Colour[]} palette - An array of Colour objects representing the colours to be included in the README file.
 * @param {Settings} settings - The settings object containing the configuration for the README file.
 * @return {Promise<void>} A promise that resolves when the README file has been successfully built and written to disk.
 */
export async function buildDocsFile(palette: Colour[]): Promise<void> {
  const output = buildPalette(palette);

  return readFile('./src/templates/docs.tpl')
    .then(template => template.replace('%PALETTE%', output)
      .replace('%DATE%', new Date().getFullYear().toString()))
    .then(template => writeFile('docs/index.html', template));
}
