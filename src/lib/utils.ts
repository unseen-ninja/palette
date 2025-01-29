/**
 * Reads the contents of a file at the specified path and returns it as a string.
 *
 * @param {string} path - The path to the file to be read.
 * @return {Promise<string>} A promise that resolves to the contents of the file as a string.
 * @throws {Error} If there was an error reading the file, an error with a message containing the path and the error is thrown.
 */
export async function readFile (path: string): Promise<string> {
  try {
    const file = await Deno.readTextFile(path);
    return file;
  } catch (error) {
    throw new Error(`Error reading file: ${path}\n${error}`)
  }
}



/**
 * Writes the given data to the specified file.
 *
 * @param {string} filePath - The path of the file to write to.
 * @param {string} fileContents - The data to write to the file.
 */
export async function writeFile (filePath: string, fileContents: string) {
  try {
    await Deno.writeTextFile(filePath, fileContents)
    console.log(`${filePath} written successfully`)
  } catch (error) {
    throw new Error(`Error writing file: ${filePath}\n${error}`)
  }
}



/**
 * Reads a JSON file from the given file path and returns the parsed JSON data.
 *
 * @param filePath - The path to the JSON file.
 * @return - A promise that resolves to the parsed JSON data.
 */
export async function readJSON (path: string): Promise<any> {
  try {
    const file = await Deno.readTextFile(path);
    return await JSON.parse(file)
  } catch (error) {
    throw new Error(`Error reading JSON file: ${path}\n${error}`)
  }
}



/**
 * Minifies a string by removing extra whitespace and line breaks.
 */
export function minifyString(input: string): string {
  return input
    .replace(/\s+/g, ' ')   // Replace consecutive whitespace with a single space
    .replace(/[\r\n]/g, '') // Remove line breaks
    .trim()                 // Remove leading and trailing whitespace
}



/**
 * Adjusts the value based on the given amount and operation.
 *
 * @param {number} value - The value to be adjusted.
 * @param {number} amount - The amount to adjust the value by.
 * @param {'add' | 'subtract'} operation - The operation to perform: 'add' or 'subtract'.
 * @return {number} The adjusted value.
 */
export function adjustValue (value: number, amount: number, operation: 'add' | 'subtract'): number {
  return operation === 'add' ? value + amount : value - amount
}



/**
 * Builds a string representation of an LCH colour value.
 *
 * @param {LCH} colour - The LCH colour object containing the lightness, chroma, and hue values.
 * @return {string} The string representation of the LCH colour value.
 */
export function buildLCHString ({lightness, chroma, hue}: LCH): string {
  return `lch(${lightness}% ${chroma} ${hue})`
}



/**
 * Builds a string representation of a CMYK colour value.
 *
 * @param {CMYK} colour - The CMYK colour object containing the cyan, magenta, yellow, and key values.
 * @return {string} The string representation of the CMYK colour value.
 */
export function buildCYMKString ({ cyan, magenta, yellow, key }: CMYK): string {
  function r(value: number): number {
    return Math.round((value + Number.EPSILON) * 100)
  }
  return `${r(cyan)}% ${r(magenta)}% ${r(yellow)}% ${r(key)}%`
}
