import fs from "fs"
import path from "path"

const EXCLUDE_DIRS = new Set(["node_modules", "dist", "build", ".git"])
const BAD = /[\u202A-\u202E\u2066-\u2069\u200B-\u200F\uFEFF]/g

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(ent.name)) continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (ent.isFile()) out.push(p)
  }
  return out
}

let badFound = false
for (const file of walk(process.cwd())) {
  if (/\.(png|jpg|jpeg|gif|webp|woff2?|ttf|ico|pdf|zip)$/i.test(file)) continue
  const txt = fs.readFileSync(file, "utf8")
  if (BAD.test(txt)) {
    badFound = true
    console.error(`Hidden/bidi unicode found in: ${file}`)
  }
}

process.exit(badFound ? 1 : 0)

