import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getKeyboardLayoutForLocale,
  getAcceptLanguageHeader,
  generateInjectionScript,
  QWERTY_US,
  QWERTY_UK,
  QWERTZ_DE,
  AZERTY_FR,
  TURKISH_Q,
  SPANISH,
  ITALIAN,
  JCUKEN_RU,
  PERSIAN_FA,
} from '../js/keyboardLayouts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runTests() {
  console.log('--- Running Tests for Cloaq-Extended ---')

  console.log('Test 1: Testing getKeyboardLayoutForLocale across all supported locales...')
  assert.strictEqual(getKeyboardLayoutForLocale('de-DE'), QWERTZ_DE)
  assert.strictEqual(getKeyboardLayoutForLocale('de-AT'), QWERTZ_DE)
  assert.strictEqual(getKeyboardLayoutForLocale('fr-FR'), AZERTY_FR)
  assert.strictEqual(getKeyboardLayoutForLocale('tr-TR'), TURKISH_Q)
  assert.strictEqual(getKeyboardLayoutForLocale('es-ES'), SPANISH)
  assert.strictEqual(getKeyboardLayoutForLocale('it-IT'), ITALIAN)
  assert.strictEqual(getKeyboardLayoutForLocale('en-GB'), QWERTY_UK)
  assert.strictEqual(getKeyboardLayoutForLocale('ru-RU'), JCUKEN_RU)
  assert.strictEqual(getKeyboardLayoutForLocale('fa-IR'), PERSIAN_FA)
  assert.strictEqual(getKeyboardLayoutForLocale('en-US'), QWERTY_US)
  assert.strictEqual(getKeyboardLayoutForLocale(''), QWERTY_US)
  assert.strictEqual(getKeyboardLayoutForLocale(null), QWERTY_US)
  console.log('  PASS: Layout mapping matches country locales correctly.')

  console.log('Test 2: Verifying authentic key mappings for all layouts...')
  assert.strictEqual(QWERTZ_DE.KeyZ, 'y')
  assert.strictEqual(QWERTZ_DE.KeyY, 'z')
  assert.strictEqual(AZERTY_FR.KeyA, 'q')
  assert.strictEqual(AZERTY_FR.KeyQ, 'a')
  assert.strictEqual(TURKISH_Q.KeyI, 'ı')
  assert.strictEqual(TURKISH_Q.BracketLeft, 'ğ')
  assert.strictEqual(QWERTY_UK.Digit3, '£')
  assert.strictEqual(JCUKEN_RU.KeyQ, 'й')
  assert.strictEqual(PERSIAN_FA.KeyQ, 'ض')
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
  assert.strictEqual(
    getAcceptLanguageHeader('en-CA'),
    'en-CA,en-US;q=0.9,en;q=0.8,fr-CA;q=0.7'
  )
  assert.strictEqual(getAcceptLanguageHeader(null), null)
  assert.strictEqual(getAcceptLanguageHeader(''), null)
  console.log('  PASS: Accept-Language headers generated accurately.')

  console.log('Test 4: Testing generated injection script for anti-bot & prototype stealth...')
  const injectionScript = generateInjectionScript('de-DE', 'Europe/Berlin')
  assert.ok(injectionScript.includes('de-DE'))
  assert.ok(injectionScript.includes('getLayoutMap'))

  // Setup realistic simulated browser environment
  class MockNavigatorProto {}
  const mockNavInstance = Object.create(MockNavigatorProto.prototype)
  mockNavInstance.keyboard = {}

  class MockKeyboardLayoutMap {
    constructor() {
      throw new TypeError('Illegal constructor')
    }
  }
  MockKeyboardLayoutMap.prototype[Symbol.toStringTag] = 'KeyboardLayoutMap'

  const mockWindow = {
    Navigator: MockNavigatorProto,
    KeyboardLayoutMap: MockKeyboardLayoutMap,
    navigator: mockNavInstance,
    Intl: {
      DateTimeFormat: function () {},
    },
  }
  mockWindow.Intl.DateTimeFormat.prototype.resolvedOptions = function () {
    return { locale: 'en-US' }
  }

  const runInEnv = new Function(
    'window',
    'navigator',
    'Navigator',
    'KeyboardLayoutMap',
    'Intl',
    injectionScript
  )
  runInEnv(
    mockWindow,
    mockWindow.navigator,
    mockWindow.Navigator,
    mockWindow.KeyboardLayoutMap,
    mockWindow.Intl
  )

  // 4a. Check navigator language and stealth prototype descriptors
  assert.strictEqual(mockWindow.navigator.language, 'de-DE')
  assert.deepStrictEqual(
    Array.from(mockWindow.navigator.languages),
    ['de-DE', 'de', 'en-US', 'en']
  )
  // CRITICAL ANTI-BOT CHECK: language must NOT be own property on navigator instance
  assert.strictEqual(mockWindow.navigator.hasOwnProperty('language'), false)
  assert.strictEqual(MockNavigatorProto.prototype.hasOwnProperty('language'), true)
  assert.strictEqual(mockWindow.navigator.hasOwnProperty('languages'), false)
  assert.strictEqual(MockNavigatorProto.prototype.hasOwnProperty('languages'), true)

  const langDesc = Object.getOwnPropertyDescriptor(MockNavigatorProto.prototype, 'language')
  assert.strictEqual(langDesc.get.name, 'get language')
  assert.strictEqual(langDesc.get.toString(), 'function get language() { [native code] }')
  assert.strictEqual(
    Function.prototype.toString.call(langDesc.get),
    'function get language() { [native code] }'
  )

  // 4b. Check Intl consistency
  const dtf = new mockWindow.Intl.DateTimeFormat()
  assert.strictEqual(dtf.resolvedOptions().locale, 'de-DE')

  // 4c. Check keyboard.getLayoutMap stealth
  const spoofedMap = await mockWindow.navigator.keyboard.getLayoutMap()
  assert.ok(spoofedMap instanceof MockKeyboardLayoutMap)
  assert.strictEqual(
    Object.prototype.toString.call(spoofedMap),
    '[object KeyboardLayoutMap]'
  )
  // CRITICAL ANTI-BOT CHECK: instance should have no own enumerable/non-enumerable properties
  assert.deepStrictEqual(Object.getOwnPropertyNames(spoofedMap), [])
  assert.strictEqual(spoofedMap.hasOwnProperty('get'), false)

  assert.strictEqual(spoofedMap.get('KeyZ'), 'y')
  assert.strictEqual(spoofedMap.get('KeyY'), 'z')
  assert.strictEqual(spoofedMap.has('KeyZ'), true)
  assert.strictEqual(spoofedMap.has('NonExistent'), false)
  assert.strictEqual(spoofedMap.size, Object.keys(QWERTZ_DE).length)

  // Function toString masking checks
  assert.strictEqual(spoofedMap.get.name, 'get')
  assert.strictEqual(spoofedMap.get.toString(), 'function get() { [native code] }')
  assert.strictEqual(spoofedMap.has.name, 'has')
  assert.strictEqual(spoofedMap.has.toString(), 'function has() { [native code] }')
  assert.strictEqual(
    MockKeyboardLayoutMap.prototype.get.call(spoofedMap, 'KeyZ'),
    'y'
  )

  // Map iteration check
  let entriesCount = 0
  for (const [k, v] of spoofedMap) {
    if (k === 'KeyZ') assert.strictEqual(v, 'y')
    entriesCount++
  }
  assert.strictEqual(entriesCount, spoofedMap.size)
  console.log('  PASS: DOM injection script stealth and WebIDL prototype conformity verified.')

  console.log('Test 5: Testing manifest.json validity...')
  const manifestRaw = fs.readFileSync(
    path.join(__dirname, '../manifest.json'),
    'utf-8'
  )
  const manifest = JSON.parse(manifestRaw)
  assert.strictEqual(manifest.manifest_version, 3)
  assert.strictEqual(manifest.version, '1.3.1')
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
  assert.ok(fs.existsSync(path.join(rootDir, 'js/debugger.js')))
  const buildDir = path.join(rootDir, 'build')
  if (fs.existsSync(buildDir)) {
    assert.ok(fs.existsSync(path.join(buildDir, 'manifest.json')))
    assert.ok(fs.existsSync(path.join(buildDir, 'html/popup.html')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/background.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/ipManager.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/keyboardLayouts.js')))
  }
  console.log('  PASS: Source files and build integrity verified.')

  console.log('\nAll 6 tests passed successfully!')
}

runTests().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
