const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('--- Building Cloaq Extension ---')

const rootDir = __dirname
const buildDir = path.join(rootDir, 'build')

// 1. Compile Tailwind CSS
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

// 2. Clean and create build directory
console.log('Preparing build directory...')
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true })
}
fs.mkdirSync(buildDir, { recursive: true })

// 3. Copy extension assets
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
