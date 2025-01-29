import { readFile, writeFile, buildLCHString, buildCYMKString } from "../lib/utils.ts"



/**
 * Builds a table row HTML string representing a single colour.
 *
 * @param {Colour} colour - The colour object to be represented in the table row.
 * @return {string} The HTML string representing the table row.
 */
function buildColourRow({ name, hex, lch, cmyk }: Colour): string {
  return `
  <tr>
    <td><img src="assets/palette/${name.toLowerCase()}.svg" width="24"></td>
    <td>${name}</td>
    <td><code>#${hex}</code></td>
    <td><code>${buildLCHString(lch)}</code></td>
    <td><code>${buildCYMKString(cmyk)}</code></td>
  </tr>
  `
}



/**
 * Builds a table HTML string representing a list of colours.
 *
 * @param {Colour[]} palette - An array of Colour objects.
 * @return {string} The HTML string representing the table.
 */
function buildTable(palette: Colour[]): string {
  const tableHeader = `
  <tr>
    <th></th>
    <th align="left">Name</th>
    <th align="left">Hex</th>
    <th align="left">LCH</th>
    <th align="left">CMYK</th>
  </tr>
  `

  const accentHeader = `
  <tr>
    <th></th>
    <th colspan="4" align="left">Accents</th>
  </tr>
  `

  const baseHeader = `
  <tr>
    <th></th>
    <th colspan="4" align="left">Bases</th>
  </tr>
  `

  const [accentRows, baseRows] = palette.reduce(
    (rows, colour) => {
      rows[colour.role === 'accent' ? 0 : 1].push(buildColourRow(colour))
      return rows
    },
    [[] as string[], [] as string[]]
  )

  return [tableHeader, accentHeader, accentRows.join(''), baseHeader, baseRows.join('')].join('')
}



/**
 * Builds a README file based on the provided palette and settings.
 *
 * @param {Colour[]} palette - An array of Colour objects representing the colours to be included in the README file.
 * @param {Settings} settings - The settings object containing the configuration for the README file.
 * @return {Promise<void>} A promise that resolves when the README file has been successfully built and written to disk.
 */
export async function buildReadmeFile(palette: Colour[], settings: Settings): Promise<void> {
  const table = buildTable(palette);
  const { tint, shade } = settings.operations;
  const lightness = settings.offsets.lightness;
  const chroma = settings.offsets.chroma;
  const hue = settings.offsets.hue;

  return readFile('./src/templates/readme.tpl')
    .then(template => template.replace('%TABLE%', table)
      .replace('%MOD.TINT%', `${tint === 'add' ? 'adding' : 'subtracting'}`)
      .replace('%MOD.SHADE%', `${shade === 'add' ? 'adding' : 'subtracting'}`)
      .replace('%MOD.LIGHTNESS%', lightness.toString())
      .replace('%MOD.CHROMA%', chroma.toString())
      .replace('%MOD.HUE%', hue.toString()))
    .then(template => writeFile('readme.md', template));
}
