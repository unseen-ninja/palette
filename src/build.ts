import { readJSON } from "./lib/utils.ts"

import { buildCSSFile } from "./workflows/build_css.ts"
import { buildDocsFile } from "./workflows/build_docs.ts"
import { buildReadmeFile } from "./workflows/build_readme.ts"
import { buildSVGPreviews } from "./workflows/build_svg.ts"



const data = await readJSON('./src/palette.json')

const settings:Settings = data.settings
const palette:Colour[]  = Object.keys(data.colours)
  .map((key) => ({
    name: data.colours[key].name as string,
    role: data.colours[key].role as Role,
    hex:  data.colours[key].hex  as HEX,
    lch:  data.colours[key].lch  as LCH,
    cmyk: data.colours[key].cmyk as CMYK
  }))



buildCSSFile(palette, settings)

if (!Deno.args.includes('--only-css')) {
  buildSVGPreviews(palette)
  buildReadmeFile(palette, settings)
  buildDocsFile(palette, settings)
}
