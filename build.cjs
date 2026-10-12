const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { execSync } = require('child_process')

async function build() {
  console.log('--- Building Cloaq Extension ---')

  const rootDir = __dirname
  const buildDir = path.join(rootDir, 'build')
  const jsDir = path.join(rootDir, 'js')
  const bitsDir = path.join(jsDir, 'bits')

  // 1. Generate Zero-Latency MAIN-world bit-carrier files and contentSpoof.js
  console.log('Generating zero-latency MAIN-world pre-shield scripts...')
  const kbModuleUrl = pathToFileURL(path.join(jsDir, 'keyboardLayouts.js')).href
  const { BIT_FILE_COUNT, generateContentSpoofScript } = await import(kbModuleUrl)

  if (!fs.existsSync(bitsDir)) {
    fs.mkdirSync(bitsDir, { recursive: true })
  }
  for (let i = 0; i < BIT_FILE_COUNT; i++) {
    const bitFile = path.join(bitsDir, `b${i}.js`)
    fs.writeFileSync(bitFile, `(window.__cloaq_b=window.__cloaq_b||[]).push(${i});\n`, 'utf-8')
  }

  const contentSpoofPath = path.join(jsDir, 'contentSpoof.js')
  fs.writeFileSync(contentSpoofPath, generateContentSpoofScript(), 'utf-8')
  console.log(`Generated ${BIT_FILE_COUNT} bit-carrier scripts + js/contentSpoof.js`)

  // 2. Compile Tailwind CSS
  console.log('Compiling Tailwind CSS...')
  const cssDir = path.join(rootDir, 'css')
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true })
  }
  try {
    execSync('npx tailwindcss -i ./tailwind.css -o ./css/style.css --minify', {
      cwd: rootDir,
      stdio: 'inherit',
    })
  } catch (e) {
    console.error('Tailwind compilation failed:', e)
    process.exit(1)
  }

  // 3. Clean and create build directory
  console.log('Preparing build directory...')
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true })
  }
  fs.mkdirSync(buildDir, { recursive: true })

  // 4. Copy extension assets
  const itemsToCopy = ['html', 'css', 'img', 'js', '_locales', 'manifest.json']

  itemsToCopy.forEach((item) => {
    const src = path.join(rootDir, item)
    const dest = path.join(buildDir, item)
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true })
      console.log(`Copied ${item} -> build/${item}`)
    } else {
      console.warn(`Warning: ${item} not found!`)
    }
  })

  console.log('Build complete! Files are ready in ./build/')
}

build().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
