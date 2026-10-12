import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getKeyboardLayoutForLocale,
  getAcceptLanguageHeader,
  generateInjectionScript,
  QWERTY_US,
  QWERTZ_DE,
  AZERTY_FR,
  TURKISH_Q,
  SPANISH,
  ITALIAN,
} from '../js/keyboardLayouts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runTests() {
  console.log('--- Running Tests for Cloaq-Extended ---')

  console.log('Test 1: Testing getKeyboardLayoutForLocale...')
  assert.strictEqual(getKeyboardLayoutForLocale('de-DE'), QWERTZ_DE)
  assert.strictEqual(getKeyboardLayoutForLocale('de-AT'), QWERTZ_DE)
  assert.strictEqual(getKeyboardLayoutForLocale('fr-FR'), AZERTY_FR)
  assert.strictEqual(getKeyboardLayoutForLocale('tr-TR'), TURKISH_Q)
  assert.strictEqual(getKeyboardLayoutForLocale('es-ES'), SPANISH)
  assert.strictEqual(getKeyboardLayoutForLocale('it-IT'), ITALIAN)
  assert.strictEqual(getKeyboardLayoutForLocale('en-US'), QWERTY_US)
  assert.strictEqual(getKeyboardLayoutForLocale(''), QWERTY_US)
  assert.strictEqual(getKeyboardLayoutForLocale(null), QWERTY_US)
  assert.strictEqual(getKeyboardLayoutForLocale('fa-IR'), QWERTY_US)
  console.log('  PASS: Layout mapping matches country locales correctly.')

  console.log('Test 2: Testing German QWERTZ and French AZERTY keys...')
  assert.strictEqual(QWERTZ_DE.KeyZ, 'y')
  assert.strictEqual(QWERTZ_DE.KeyY, 'z')
  assert.strictEqual(AZERTY_FR.KeyA, 'q')
  assert.strictEqual(AZERTY_FR.KeyQ, 'a')
  assert.strictEqual(TURKISH_Q.KeyI, 'ı')
  assert.strictEqual(TURKISH_Q.BracketLeft, 'ğ')
  console.log('  PASS: Key mappings are authentic.')

  console.log('Test 3: Testing getAcceptLanguageHeader...')
  assert.strictEqual(
    getAcceptLanguageHeader('de-DE'),
    'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
  )
  assert.strictEqual(
    getAcceptLanguageHeader('fr-FR'),
    'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
  )
  assert.strictEqual(
    getAcceptLanguageHeader('tr-TR'),
    'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
  )
  assert.strictEqual(getAcceptLanguageHeader('en-US'), 'en-US,en;q=0.9')
  assert.strictEqual(
    getAcceptLanguageHeader('en-GB'),
    'en-GB,en-US;q=0.9,en;q=0.8'
  )
  assert.strictEqual(getAcceptLanguageHeader(null), null)
  assert.strictEqual(getAcceptLanguageHeader(''), null)
  console.log('  PASS: Accept-Language headers generated accurately.')

  console.log('Test 4: Testing generated injection script in simulated DOM...')
  const injectionScript = generateInjectionScript('de-DE', 'Europe/Berlin')
  assert.ok(injectionScript.includes('de-DE'))
  assert.ok(injectionScript.includes('getLayoutMap'))

  class FakeKeyboardLayoutMap {}
  FakeKeyboardLayoutMap.prototype[Symbol.toStringTag] = 'KeyboardLayoutMap'

  const fakeGlobal = {
    window: {},
    navigator: {
      language: 'fa-IR',
      languages: ['fa-IR', 'fa'],
      keyboard: {
        getLayoutMap: async () => {
          const m = new FakeKeyboardLayoutMap()
          m.get = (k) => (k === 'KeyQ' ? 'ض' : 'a')
          return m
        },
      },
    },
  }
  fakeGlobal.window.KeyboardLayoutMap = FakeKeyboardLayoutMap

  const runInEnv = new Function(
    'window',
    'navigator',
    'KeyboardLayoutMap',
    injectionScript
  )
  runInEnv(
    fakeGlobal.window,
    fakeGlobal.navigator,
    fakeGlobal.window.KeyboardLayoutMap
  )

  assert.strictEqual(fakeGlobal.navigator.language, 'de-DE')
  assert.deepStrictEqual(
    Array.from(fakeGlobal.navigator.languages),
    ['de-DE', 'de', 'en-US', 'en']
  )

  const spoofedMap = await fakeGlobal.navigator.keyboard.getLayoutMap()
  assert.ok(spoofedMap instanceof FakeKeyboardLayoutMap)
  assert.strictEqual(
    Object.prototype.toString.call(spoofedMap),
    '[object KeyboardLayoutMap]'
  )
  assert.strictEqual(spoofedMap.get('KeyZ'), 'y')
  assert.strictEqual(spoofedMap.get('KeyY'), 'z')
  assert.strictEqual(spoofedMap.has('KeyZ'), true)
  assert.strictEqual(spoofedMap.has('NonExistent'), false)
  assert.ok(spoofedMap.size > 20)

  let entriesCount = 0
  for (const [k, v] of spoofedMap) {
    if (k === 'KeyZ') assert.strictEqual(v, 'y')
    entriesCount++
  }
  assert.strictEqual(entriesCount, spoofedMap.size)
  console.log('  PASS: DOM injection script properly intercepts language and keyboard layout.')

  console.log('Test 5: Testing manifest.json validity...')
  const manifestRaw = fs.readFileSync(
    path.join(__dirname, '../manifest.json'),
    'utf-8'
  )
  const manifest = JSON.parse(manifestRaw)
  assert.strictEqual(manifest.manifest_version, 3)
  assert.strictEqual(manifest.version, '1.3.0')
  assert.ok(manifest.permissions.includes('declarativeNetRequest'))
  assert.ok(manifest.permissions.includes('alarms'))
  assert.ok(manifest.permissions.includes('storage'))
  assert.ok(manifest.permissions.includes('webNavigation'))
  assert.ok(manifest.permissions.includes('debugger'))
  assert.ok(manifest.host_permissions.includes('<all_urls>'))
  assert.strictEqual(manifest.background.service_worker, 'js/background.js')
  assert.strictEqual(manifest.background.type, 'module')
  console.log('  PASS: Manifest schema and permissions are valid.')

  console.log('Test 6: Checking source files and build integrity...')
  const rootDir = path.join(__dirname, '..')
  assert.ok(fs.existsSync(path.join(rootDir, 'manifest.json')))
  assert.ok(fs.existsSync(path.join(rootDir, 'html/popup.html')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/background.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/ipManager.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/keyboardLayouts.js')))
  const buildDir = path.join(rootDir, 'build')
  if (fs.existsSync(buildDir)) {
    assert.ok(fs.existsSync(path.join(buildDir, 'manifest.json')))
    assert.ok(fs.existsSync(path.join(buildDir, 'html/popup.html')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/background.js')))
  }
  console.log('  PASS: Source files and build integrity verified.')

  console.log('\nAll 6 tests passed successfully!')
}

runTests().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
