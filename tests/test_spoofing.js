import assert from 'assert'
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import {
  getKeyboardLayoutForLocale,
  getAcceptLanguageHeader,
  generateInjectionScript,
  generateContentSpoofScript,
  encodeSpoofConfigToBits,
  decodeSpoofConfigFromBits,
  BIT_FILE_COUNT,
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
import locationsConfigurations from '../js/locationsConfigurations.js'
import countryLocales from '../js/countryLocales.js'

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
    'en-CA,en-US;q=0.9,en;q=0.7'.replace('0.7', '0.8,fr-CA;q=0.7')
  )
  assert.strictEqual(getAcceptLanguageHeader(null), null)
  assert.strictEqual(getAcceptLanguageHeader(''), null)
  console.log('  PASS: Accept-Language headers generated accurately.')

  console.log('Test 4: Testing generated injection script for anti-bot & prototype stealth...')
  const injectionScript = generateInjectionScript('de-DE', 'Europe/Berlin')
  assert.ok(injectionScript.includes('de-DE'))
  assert.ok(injectionScript.includes('Europe/Berlin'))
  assert.ok(injectionScript.includes('getLayoutMap'))

  // Setup isolated VM context to avoid mutating the main Node test process globals
  const vmContext = vm.createContext({})
  vm.runInContext(
    `
    class MockNavigatorProto {}
    const mockNavInstance = Object.create(MockNavigatorProto.prototype);
    mockNavInstance.keyboard = {};

    class MockKeyboardLayoutMap {
      constructor() {
        throw new TypeError('Illegal constructor');
      }
    }
    MockKeyboardLayoutMap.prototype[Symbol.toStringTag] = 'KeyboardLayoutMap';

    globalThis.window = globalThis;
    globalThis.Navigator = MockNavigatorProto;
    globalThis.KeyboardLayoutMap = MockKeyboardLayoutMap;
    globalThis.navigator = mockNavInstance;
    `,
    vmContext
  )

  vm.runInContext(injectionScript, vmContext)

  // 4a. Check navigator language and stealth prototype descriptors
  assert.strictEqual(vm.runInContext('navigator.language', vmContext), 'de-DE')
  assert.deepStrictEqual(
    Array.from(vm.runInContext('navigator.languages', vmContext)),
    ['de-DE', 'de', 'en-US', 'en']
  )
  assert.strictEqual(vm.runInContext(`navigator.hasOwnProperty('language')`, vmContext), false)
  assert.strictEqual(vm.runInContext(`Navigator.prototype.hasOwnProperty('language')`, vmContext), true)
  assert.strictEqual(vm.runInContext(`navigator.hasOwnProperty('languages')`, vmContext), false)
  assert.strictEqual(vm.runInContext(`Navigator.prototype.hasOwnProperty('languages')`, vmContext), true)

  assert.strictEqual(
    vm.runInContext(`Object.getOwnPropertyDescriptor(Navigator.prototype, 'language').get.name`, vmContext),
    'get language'
  )
  assert.strictEqual(
    vm.runInContext(`Object.getOwnPropertyDescriptor(Navigator.prototype, 'language').get.toString()`, vmContext),
    'function get language() { [native code] }'
  )
  assert.strictEqual(
    vm.runInContext(`Function.prototype.toString.call(Object.getOwnPropertyDescriptor(Navigator.prototype, 'language').get)`, vmContext),
    'function get language() { [native code] }'
  )
  // CreepJS prototype lie checks: non-constructor methods must NOT have a .prototype property
  assert.strictEqual(
    vm.runInContext(`'prototype' in Function.prototype.toString`, vmContext),
    false
  )
  assert.deepStrictEqual(
    Array.from(vm.runInContext(`Object.getOwnPropertyNames(Function.prototype.toString)`, vmContext)),
    ['length', 'name']
  )
  assert.strictEqual(
    vm.runInContext(`'prototype' in Date.prototype.getTimezoneOffset`, vmContext),
    false
  )
  assert.deepStrictEqual(
    Array.from(vm.runInContext(`Object.getOwnPropertyNames(Date.prototype.getTimezoneOffset)`, vmContext)),
    ['length', 'name']
  )
  assert.strictEqual(
    vm.runInContext(
      `(() => { try { new Date.prototype.getTimezoneOffset(); return false; } catch (e) { return e instanceof TypeError; } })()`,
      vmContext
    ),
    true
  )

  // 4b. Check Intl & Timezone consistency + explicit locale preservation on NumberFormat/Collator/PluralRules
  assert.strictEqual(
    vm.runInContext(`new Intl.DateTimeFormat().resolvedOptions().locale`, vmContext),
    'de-DE'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.DateTimeFormat().resolvedOptions().timeZone`, vmContext),
    'Europe/Berlin'
  )
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, vmContext),
    'Europe/Berlin'
  )
  // Explicit timeZone and locale options must be respected (anti-CreepJS lie detection)
  assert.strictEqual(
    vm.runInContext(`new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).resolvedOptions().timeZone`, vmContext),
    'UTC'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.DateTimeFormat('fr-FR', { timeZone: 'Asia/Tokyo' }).resolvedOptions().locale`, vmContext),
    'fr-FR'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.DateTimeFormat('fr-FR', { timeZone: 'Asia/Tokyo' }).resolvedOptions().timeZone`, vmContext),
    'Asia/Tokyo'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.NumberFormat().resolvedOptions().locale`, vmContext),
    'de-DE'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.NumberFormat('fr-FR').resolvedOptions().locale`, vmContext),
    'fr-FR'
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.Collator('ja-JP').resolvedOptions().locale`, vmContext),
    new Intl.Collator('ja-JP').resolvedOptions().locale
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.PluralRules('ar-EG').resolvedOptions().locale`, vmContext),
    new Intl.PluralRules('ar-EG').resolvedOptions().locale
  )
  assert.strictEqual(
    vm.runInContext(`new Intl.NumberFormat().format(1234.56)`, vmContext),
    new Intl.NumberFormat('de-DE').format(1234.56)
  )
  assert.strictEqual(
    vm.runInContext(`(1234.56).toLocaleString()`, vmContext),
    (1234.56).toLocaleString('de-DE')
  )

  // 4c. Check keyboard.getLayoutMap stealth
  const spoofedMap = await vm.runInContext(`navigator.keyboard.getLayoutMap()`, vmContext)
  assert.strictEqual(
    vm.runInContext(`Object.prototype.toString.call(navigator.keyboard.getLayoutMap())`, vmContext),
    '[object Promise]'
  )
  assert.strictEqual(spoofedMap.get('KeyZ'), 'y')
  assert.strictEqual(spoofedMap.get('KeyY'), 'z')
  assert.strictEqual(spoofedMap.has('KeyZ'), true)
  assert.strictEqual(spoofedMap.has('NonExistent'), false)
  assert.strictEqual(spoofedMap.size, Object.keys(QWERTZ_DE).length)
  assert.deepStrictEqual(Object.getOwnPropertyNames(spoofedMap), [])
  assert.strictEqual(spoofedMap.hasOwnProperty('get'), false)
  assert.strictEqual(spoofedMap.get.name, 'get')
  assert.strictEqual(
    vm.runInContext(`Function.prototype.toString.call(KeyboardLayoutMap.prototype.get)`, vmContext),
    'function get() { [native code] }'
  )
  console.log('  PASS: DOM injection script stealth and WebIDL prototype conformity verified.')

  console.log('Test 5: Verifying comprehensive Date & Timezone emulation, local setters, ISO parsing, and DST accuracy...')
  // Winter in Europe/Berlin (UTC+1 -> getTimezoneOffset() === -60)
  assert.strictEqual(
    vm.runInContext(`new Date(Date.UTC(2026, 0, 15, 12, 0, 0)).getTimezoneOffset()`, vmContext),
    -60
  )
  // Summer DST in Europe/Berlin (UTC+2 -> getTimezoneOffset() === -120)
  assert.strictEqual(
    vm.runInContext(`new Date(Date.UTC(2026, 6, 15, 12, 0, 0)).getTimezoneOffset()`, vmContext),
    -120
  )
  // Local Date(y, m, d, h, min, s) constructor offset consistency check
  assert.strictEqual(
    vm.runInContext(`(new Date(2026, 0, 15, 0, 0, 0).getTime() - Date.UTC(2026, 0, 15, 0, 0, 0)) / 60000`, vmContext),
    -60
  )
  assert.strictEqual(
    vm.runInContext(`(new Date(2026, 6, 15, 0, 0, 0).getTime() - Date.UTC(2026, 6, 15, 0, 0, 0)) / 60000`, vmContext),
    -120
  )
  // Component getters in spoofed timezone
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getFullYear()`, vmContext), 2026)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getYear()`, vmContext), 126)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getMonth()`, vmContext), 6)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getDate()`, vmContext), 15)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getDay()`, vmContext), 3) // Wednesday
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getHours()`, vmContext), 14)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getMinutes()`, vmContext), 30)
  assert.strictEqual(vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).getSeconds()`, vmContext), 45)

  // Local Date.prototype.set* methods must operate in the spoofed timezone (not host OS timezone!)
  const setHoursResult = vm.runInContext(
    `(() => {
      const d = new Date(2026, 6, 15, 14, 30, 45);
      d.setHours(0, 0, 0, 0);
      return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds(), date: d.getDate() };
    })()`,
    vmContext
  )
  assert.deepStrictEqual({ ...setHoursResult }, { h: 0, m: 0, s: 0, date: 15 })

  const setDateMonthYearResult = vm.runInContext(
    `(() => {
      const d = new Date(2026, 6, 15, 14, 30, 45);
      d.setFullYear(2025, 0, 20);
      d.setMinutes(15, 20, 0);
      return { y: d.getFullYear(), yr: d.getYear(), mo: d.getMonth(), dt: d.getDate(), h: d.getHours(), min: d.getMinutes(), sec: d.getSeconds() };
    })()`,
    vmContext
  )
  assert.deepStrictEqual({ ...setDateMonthYearResult }, {
    y: 2025,
    yr: 125,
    mo: 0,
    dt: 20,
    h: 14,
    min: 15,
    sec: 20,
  })

  // ISO date-only forms YYYY, YYYY-MM, YYYY-MM-DD must remain UTC per ECMAScript spec
  assert.strictEqual(
    vm.runInContext(`new Date('2026').toISOString()`, vmContext),
    '2026-01-01T00:00:00.000Z'
  )
  assert.strictEqual(
    vm.runInContext(`new Date('2026-07').toISOString()`, vmContext),
    '2026-07-01T00:00:00.000Z'
  )
  assert.strictEqual(
    vm.runInContext(`new Date('2026-07-15').toISOString()`, vmContext),
    '2026-07-15T00:00:00.000Z'
  )
  // ISO date-time without offset must be parsed in spoofed timezone (Europe/Berlin = UTC+2 in July -> 12:30Z)
  assert.strictEqual(
    vm.runInContext(`new Date('2026-07-15T14:30:00').toISOString()`, vmContext),
    '2026-07-15T12:30:00.000Z'
  )

  assert.strictEqual(
    vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).toDateString()`, vmContext),
    'Wed Jul 15 2026'
  )
  assert.ok(
    vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).toTimeString()`, vmContext).startsWith('14:30:45 GMT+0200 (')
  )
  assert.ok(
    vm.runInContext(`new Date(2026, 6, 15, 14, 30, 45).toString()`, vmContext).startsWith('Wed Jul 15 2026 14:30:45 GMT+0200 (')
  )
  // Invalid Date & non-Date receiver checks
  assert.strictEqual(vm.runInContext(`new Date(NaN).toString()`, vmContext), 'Invalid Date')
  assert.strictEqual(vm.runInContext(`Number.isNaN(new Date(NaN).getTimezoneOffset())`, vmContext), true)
  assert.strictEqual(
    vm.runInContext(
      `(() => { try { Date.prototype.getTimezoneOffset.call({}); return false; } catch (e) { return e instanceof TypeError; } })()`,
      vmContext
    ),
    true
  )
  // Native function masking & non-enumerability on Date.prototype
  assert.strictEqual(
    vm.runInContext(`Date.prototype.getTimezoneOffset.toString()`, vmContext),
    'function getTimezoneOffset() { [native code] }'
  )
  assert.strictEqual(
    vm.runInContext(`Date.toString()`, vmContext),
    'function Date() { [native code] }'
  )
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat.toString()`, vmContext),
    'function DateTimeFormat() { [native code] }'
  )
  assert.strictEqual(
    vm.runInContext(`Object.getOwnPropertyDescriptor(Date.prototype, 'getTimezoneOffset').enumerable`, vmContext),
    false
  )
  assert.deepStrictEqual(
    Array.from(vm.runInContext(`Object.keys(Date.prototype)`, vmContext)),
    []
  )

  // Verify synchronous HTMLIFrameElement.prototype.contentWindow patching & cross-realm toString stealth
  const iframeCtx = vm.createContext({})
  const iframeWin = vm.runInContext(
    `
    class MockIFrameNavigator {}
    const iframeNav = Object.create(MockIFrameNavigator.prototype);
    iframeNav.keyboard = {};
    globalThis.window = globalThis;
    globalThis.Navigator = MockIFrameNavigator;
    globalThis.navigator = iframeNav;
    globalThis;
    `,
    iframeCtx
  )
  const iframeTestVm = vm.createContext({})
  const parentWin = vm.runInContext(
    `
    class MockNav {}
    const nav = Object.create(MockNav.prototype);
    nav.keyboard = {};
    class MockHTMLIFrameElement {}
    Object.defineProperty(MockHTMLIFrameElement.prototype, 'contentWindow', {
      get: function () { return globalThis.__childWin; },
      enumerable: true,
      configurable: true
    });
    globalThis.window = globalThis;
    globalThis.Navigator = MockNav;
    globalThis.navigator = nav;
    globalThis.HTMLIFrameElement = MockHTMLIFrameElement;
    globalThis;
    `,
    iframeTestVm
  )
  parentWin.__childWin = iframeWin
  // Also simulate independent contentSpoof.js injection into child frame before contentWindow access
  vm.runInContext(injectionScript, iframeCtx)
  vm.runInContext(injectionScript, iframeTestVm)
  const cw = vm.runInContext(`Object.create(HTMLIFrameElement.prototype).contentWindow`, iframeTestVm)
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, iframeCtx),
    'Europe/Berlin'
  )
  assert.strictEqual(cw.navigator.language, 'de-DE')
  assert.strictEqual(
    vm.runInContext(`new Date(Date.UTC(2026, 6, 15, 12, 0, 0)).getTimezoneOffset()`, iframeCtx),
    -120
  )
  // Cross-realm Function.prototype.toString must mask functions across parent and child frames
  assert.strictEqual(
    vm.runInContext(
      `window.Function.prototype.toString.call(Object.create(HTMLIFrameElement.prototype).contentWindow.Date.prototype.getTimezoneOffset)`,
      iframeTestVm
    ),
    'function getTimezoneOffset() { [native code] }'
  )
  console.log('  PASS: Date & Timezone emulation, local setters, ISO parsing, and cross-realm iframe stealth verified.')

  console.log('Test 6: Testing true live in-place reconfiguration without re-wrapping...')
  const dateCtorBefore = vm.runInContext(`Date`, vmContext)
  const dtfCtorBefore = vm.runInContext(`Intl.DateTimeFormat`, vmContext)
  const explicitDtfBefore = vm.runInContext(
    `new Intl.DateTimeFormat('fr-FR', { timeZone: 'Asia/Tokyo' })`,
    vmContext
  )

  const nyScript = generateInjectionScript('en-US', 'America/New_York', 40.7127, -74.0059)
  vm.runInContext(nyScript, vmContext)

  // Verify constructors were NOT re-wrapped (true in-place update!)
  assert.strictEqual(vm.runInContext(`Date`, vmContext), dateCtorBefore)
  assert.strictEqual(vm.runInContext(`Intl.DateTimeFormat`, vmContext), dtfCtorBefore)
  // Verify pre-existing explicit DateTimeFormat instances retain their explicit locale and timeZone
  assert.strictEqual(explicitDtfBefore.resolvedOptions().locale, 'fr-FR')
  assert.strictEqual(explicitDtfBefore.resolvedOptions().timeZone, 'Asia/Tokyo')

  // Verify linked child iframe also updates in-place when parent updates
  vm.runInContext(nyScript, iframeTestVm)
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, iframeCtx),
    'America/New_York'
  )

  assert.strictEqual(vm.runInContext(`navigator.language`, vmContext), 'en-US')
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, vmContext),
    'America/New_York'
  )
  // America/New_York Winter (UTC-5 -> +300) and Summer (UTC-4 -> +240)
  assert.strictEqual(
    vm.runInContext(`new Date(Date.UTC(2026, 0, 15, 12, 0, 0)).getTimezoneOffset()`, vmContext),
    300
  )
  assert.strictEqual(
    vm.runInContext(`new Date(Date.UTC(2026, 6, 15, 12, 0, 0)).getTimezoneOffset()`, vmContext),
    240
  )
  const nyMap = await vm.runInContext(`navigator.keyboard.getLayoutMap()`, vmContext)
  assert.strictEqual(nyMap.get('KeyZ'), 'z')
  assert.strictEqual(nyMap.get('KeyY'), 'y')
  console.log('  PASS: True live in-place reconfiguration without re-wrapping verified.')

  console.log('Test 7: Testing Bit-Codec (encodeSpoofConfigToBits / decodeSpoofConfigFromBits) across all presets and locales...')
  for (const [key, loc] of Object.entries(locationsConfigurations)) {
    const bits = encodeSpoofConfigToBits(loc.timezone, loc.locale, loc.lat, loc.lon)
    assert.ok(bits.every((b) => b >= 0 && b < BIT_FILE_COUNT), `Bit out of range for ${key}`)
    // Ensure strictly ascending unique bit indices (no duplicate files in registerContentScripts!)
    for (let i = 1; i < bits.length; i++) {
      assert.ok(bits[i] > bits[i - 1], `Duplicate or unsorted bit index for ${key}`)
    }
    const decoded = decodeSpoofConfigFromBits(bits)
    assert.strictEqual(decoded.timezone, loc.timezone, `Timezone mismatch for ${key}`)
    assert.strictEqual(decoded.locale, loc.locale, `Locale mismatch for ${key}`)
    assert.ok(Math.abs(decoded.lat - loc.lat) <= 0.0001, `Lat mismatch for ${key}`)
    assert.ok(Math.abs(decoded.lon - loc.lon) <= 0.0001, `Lon mismatch for ${key}`)
  }
  for (const [country, locale] of Object.entries(countryLocales)) {
    const bits = encodeSpoofConfigToBits('UTC', locale, null, null)
    const decoded = decodeSpoofConfigFromBits(bits)
    assert.strictEqual(decoded.timezone, 'UTC')
    assert.strictEqual(decoded.locale, locale, `Country locale mismatch for ${country}`)
    assert.strictEqual(decoded.lat, null)
    assert.strictEqual(decoded.lon, null)
  }
  // Custom locale up to 14 characters not in table + modern IANA timezone names
  const customBits = encodeSpoofConfigToBits('Asia/Kathmandu', 'zh-Hans-CN', 27.7172, 85.324)
  const customDecoded = decodeSpoofConfigFromBits(customBits)
  assert.strictEqual(customDecoded.timezone, 'Asia/Kathmandu')
  assert.strictEqual(customDecoded.locale, 'zh-Hans-CN')
  assert.strictEqual(customDecoded.lat, 27.7172)
  assert.strictEqual(customDecoded.lon, 85.324)
  console.log('  PASS: Bit-Codec lossless encoding & decoding verified across all presets, modern zones, and 14-char locales.')

  console.log('Test 8: Testing Zero-Latency MAIN-world contentSpoof.js & native Worker/Blob preservation...')
  const preShieldContext = vm.createContext({})
  vm.runInContext(
    `
    class MockNavigatorProto {}
    const mockNavInstance = Object.create(MockNavigatorProto.prototype);
    mockNavInstance.keyboard = {};
    mockNavInstance.geolocation = Object.create({
      getCurrentPosition(cb) {
        cb({ coords: { latitude: 0, longitude: 0, accuracy: 100 } });
      },
      watchPosition(cb) {
        cb({ coords: { latitude: 0, longitude: 0, accuracy: 100 } });
      }
    });
    class MockBlob {
      constructor(parts, options) {
        this.parts = parts;
        this.options = options;
      }
    }
    const MockURL = {
      createObjectURL(blob) {
        return 'blob:https://example.com/1';
      }
    };
    class MockWorker {
      constructor(scriptUrl, options) {
        this.scriptUrl = scriptUrl;
        this.options = options;
      }
    }
    globalThis.window = globalThis;
    globalThis.Navigator = MockNavigatorProto;
    globalThis.navigator = mockNavInstance;
    globalThis.Blob = MockBlob;
    globalThis.URL = MockURL;
    globalThis.Worker = MockWorker;
    globalThis.__OrigBlob = MockBlob;
    globalThis.__OrigCreateObjectURL = MockURL.createObjectURL;
    globalThis.__OrigWorker = MockWorker;
    `,
    preShieldContext
  )

  const tokyoBits = encodeSpoofConfigToBits('Asia/Tokyo', 'ja-JP', 35.6895, 139.6917)
  for (const b of tokyoBits) {
    vm.runInContext(`(window.__cloaq_b=window.__cloaq_b||[]).push(${b});`, preShieldContext)
  }
  const contentSpoofCode = generateContentSpoofScript()
  vm.runInContext(contentSpoofCode, preShieldContext)

  // Verify zero global trace left on window
  assert.strictEqual(vm.runInContext(`'__cloaq_b' in window`, preShieldContext), false)
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, preShieldContext),
    'Asia/Tokyo'
  )
  assert.strictEqual(
    vm.runInContext(`new Date().getTimezoneOffset()`, preShieldContext),
    -540
  )
  assert.strictEqual(vm.runInContext(`navigator.language`, preShieldContext), 'ja-JP')
  const geoCoords = vm.runInContext(
    `(() => { let c = null; navigator.geolocation.getCurrentPosition(p => { c = p.coords; }); return c; })()`,
    preShieldContext
  )
  assert.strictEqual(geoCoords.latitude, 35.6895)
  assert.strictEqual(geoCoords.longitude, 139.6917)

  // Verify Worker, Blob, and URL.createObjectURL are 100% untouched native references (prevents Cloudflare Turnstile worker-src blob: CSP error)
  assert.strictEqual(vm.runInContext(`window.Blob === __OrigBlob`, preShieldContext), true)
  assert.strictEqual(vm.runInContext(`window.URL.createObjectURL === __OrigCreateObjectURL`, preShieldContext), true)
  assert.strictEqual(vm.runInContext(`window.Worker === __OrigWorker`, preShieldContext), true)
  console.log('  PASS: Zero-Latency MAIN-world contentSpoof.js & native Worker/Blob preservation verified.')

  console.log('Test 9: Testing manifest.json validity...')
  const manifestRaw = fs.readFileSync(
    path.join(__dirname, '../manifest.json'),
    'utf-8'
  )
  const manifest = JSON.parse(manifestRaw)
  assert.strictEqual(manifest.manifest_version, 3)
  assert.strictEqual(manifest.version, '1.3.5')
  assert.ok(manifest.permissions.includes('declarativeNetRequest'))
  assert.ok(manifest.permissions.includes('alarms'))
  assert.ok(manifest.permissions.includes('storage'))
  assert.ok(manifest.permissions.includes('webNavigation'))
  assert.ok(manifest.permissions.includes('debugger'))
  assert.ok(manifest.permissions.includes('scripting'))
  assert.ok(manifest.host_permissions.includes('<all_urls>'))
  assert.strictEqual(manifest.background.service_worker, 'js/background.js')
  assert.strictEqual(manifest.background.type, 'module')
  console.log('  PASS: Manifest schema and permissions are valid.')

  console.log('Test 10: Checking source files and build integrity...')
  const rootDir = path.join(__dirname, '..')
  assert.ok(fs.existsSync(path.join(rootDir, 'manifest.json')))
  assert.ok(fs.existsSync(path.join(rootDir, 'html/popup.html')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/background.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/ipManager.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/keyboardLayouts.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/debugger.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/contentSpoof.js')))
  assert.ok(fs.existsSync(path.join(rootDir, 'js/bits/b0.js')))
  assert.ok(fs.existsSync(path.join(rootDir, `js/bits/b${BIT_FILE_COUNT - 1}.js`)))
  const buildDir = path.join(rootDir, 'build')
  if (fs.existsSync(buildDir)) {
    assert.ok(fs.existsSync(path.join(buildDir, 'manifest.json')))
    assert.ok(fs.existsSync(path.join(buildDir, 'html/popup.html')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/background.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/ipManager.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/keyboardLayouts.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/contentSpoof.js')))
    assert.ok(fs.existsSync(path.join(buildDir, 'js/bits/b0.js')))
    assert.ok(fs.existsSync(path.join(buildDir, `js/bits/b${BIT_FILE_COUNT - 1}.js`)))
  }
  console.log('  PASS: Source files and build integrity verified.')

  console.log('Test 11: Testing debugger.js chrome://newtab transition recovery, CDP timezone deduplication/reset, and content script registration...')
  const cdpCommands = []
  let registeredScripts = []
  let attachAttempts = 0

  globalThis.chrome = {
    runtime: {
      lastError: null,
    },
    scripting: {
      async getRegisteredContentScripts() {
        return registeredScripts
      },
      async registerContentScripts(scripts) {
        registeredScripts = [...scripts]
      },
      async updateContentScripts(scripts) {
        registeredScripts = [...scripts]
      },
      async unregisterContentScripts() {
        registeredScripts = []
      },
      executeScript(opts, cb) {
        if (cb) cb()
      },
    },
    debugger: {
      onDetach: { addListener() {} },
      getTargets(cb) {
        cb([{ tabId: 42, attached: true, url: 'https://whoer.net/' }])
      },
      attach(target, ver, cb) {
        attachAttempts++
        if (attachAttempts === 1) {
          // Simulate initial failure when tab is still on chrome://newtab during onBeforeNavigate
          globalThis.chrome.runtime.lastError = {
            message: 'Cannot access a chrome:// URL',
          }
          cb()
          globalThis.chrome.runtime.lastError = null
        } else {
          globalThis.chrome.runtime.lastError = null
          cb()
        }
      },
      sendCommand(target, method, params, cb) {
        cdpCommands.push({ tabId: target.tabId, method, params })
        if (
          method === 'Emulation.setTimezoneOverride' &&
          params.timezoneId === 'America/New_York' &&
          cdpCommands.filter(
            (c) =>
              c.method === 'Emulation.setTimezoneOverride' &&
              c.params.timezoneId === ''
          ).length === 0
        ) {
          // Simulate Chromium error when previous timezone override is already active
          globalThis.chrome.runtime.lastError = {
            message: 'Timezone override is already in effect',
          }
          if (cb) cb()
          globalThis.chrome.runtime.lastError = null
          return
        }
        globalThis.chrome.runtime.lastError = null
        if (method === 'Page.addScriptToEvaluateOnNewDocument') {
          if (cb) cb({ identifier: 'script-1' })
          return
        }
        if (cb) cb()
      },
      detach(target, cb) {
        if (cb) cb()
      },
    },
  }

  const {
    syncContentScriptShield,
    attachDebugger,
    sendOverrides,
  } = await import('../js/debugger.js')

  await syncContentScriptShield('Europe/Berlin', 'de-DE', 52.52, 13.405)
  assert.strictEqual(registeredScripts.length, 1)
  assert.strictEqual(registeredScripts[0].id, 'cloaq-main-shield')
  assert.strictEqual(registeredScripts[0].world, 'MAIN')
  assert.strictEqual(registeredScripts[0].runAt, 'document_start')
  assert.strictEqual(registeredScripts[0].allFrames, true)
  assert.strictEqual(registeredScripts[0].matchOriginAsFallback, true)
  assert.ok(
    Array.isArray(registeredScripts[0].excludeMatches) &&
      registeredScripts[0].excludeMatches.includes('*://challenges.cloudflare.com/*')
  )
  assert.strictEqual(
    registeredScripts[0].js[registeredScripts[0].js.length - 1],
    'js/contentSpoof.js'
  )

  // Test automatic retry when attachDebugger initially fails on chrome://newtab
  attachDebugger(99, 'Europe/Berlin', 'de-DE', 52.52, 13.405)
  assert.strictEqual(attachAttempts, 1)
  await new Promise((r) => setTimeout(r, 40))
  assert.ok(attachAttempts >= 2, 'Should automatically retry attach after chrome://newtab rejection')
  const berlinTzCallsBefore = cdpCommands.filter(
    (c) =>
      c.tabId === 99 &&
      c.method === 'Emulation.setTimezoneOverride' &&
      c.params.timezoneId === 'Europe/Berlin'
  ).length
  assert.strictEqual(berlinTzCallsBefore, 1, 'Should apply Emulation.setTimezoneOverride once retry succeeds')
  assert.strictEqual(
    cdpCommands.some((c) => c.method === 'Network.enable'),
    false,
    'Should not enable CDP Network domain (handled by declarativeNetRequest)'
  )

  // Calling sendOverrides again with the SAME timezone during navigation must NOT re-send or reset Emulation.setTimezoneOverride
  sendOverrides(99, 'Europe/Berlin', 'de-DE', 52.52, 13.405)
  const berlinTzCallsAfter = cdpCommands.filter(
    (c) =>
      c.tabId === 99 &&
      c.method === 'Emulation.setTimezoneOverride'
  ).length
  assert.strictEqual(berlinTzCallsAfter, 1, 'Must deduplicate identical timezone override calls on same tab')

  // Test switching timezone on an already-attached tab (clears with '' first, then applies new timezone, and removes old Page script)
  sendOverrides(99, 'America/New_York', 'en-US', 40.7128, -74.006)
  assert.ok(
    cdpCommands.some(
      (c) =>
        c.tabId === 99 &&
        c.method === 'Emulation.setTimezoneOverride' &&
        c.params.timezoneId === ''
    ),
    'Should clear existing timezone override with empty string before applying new timezone'
  )
  assert.ok(
    cdpCommands.some(
      (c) =>
        c.tabId === 99 &&
        c.method === 'Emulation.setTimezoneOverride' &&
        c.params.timezoneId === 'America/New_York'
    ),
    'Should apply new timezone America/New_York after clearing'
  )
  assert.ok(
    cdpCommands.some(
      (c) =>
        c.tabId === 99 &&
        c.method === 'Page.removeScriptToEvaluateOnNewDocument' &&
        c.params.identifier === 'script-1'
    ),
    'Should remove previous Page.addScriptToEvaluateOnNewDocument script identifier when updating overrides'
  )
  console.log('  PASS: chrome://newtab attach recovery, CDP timezone deduplication/reset, and MAIN-world shield verified.')

  console.log('Test 12: Testing ipManager.js preset-to-ipAddress mismatch recovery and instant lastTimezone hydration...')
  const mockStorageData = {
    configuration: 'ipAddress',
    lastIp: '185.220.101.1',
    lastCountry: 'DE',
    lastTimezone: 'Europe/Berlin',
    lastLocale: 'de-DE',
    lastLat: 52.52,
    lastLon: 13.405,
    lastCheckTime: Date.now(),
    // Simulate stale manual preset ('Europe/London') left in storage when user switches to ipAddress
    timezone: 'Europe/London',
    locale: 'en-GB',
    lat: 51.5074,
    lon: -0.1278,
  }

  globalThis.chrome.storage = {
    local: {
      async get(keys) {
        const res = {}
        for (const k of keys) {
          res[k] = mockStorageData[k]
        }
        return res
      },
      async set(obj) {
        Object.assign(mockStorageData, obj)
      },
    },
  }
  globalThis.chrome.declarativeNetRequest = {
    async updateDynamicRules() {},
  }
  const origFetch = globalThis.fetch
  globalThis.fetch = async () => ({
    ok: true,
    async text() {
      return JSON.stringify({
        ip: '185.220.101.1',
        country_code: 'DE',
        timezone: 'Europe/Berlin',
        latitude: '52.52',
        longitude: '13.405',
      })
    },
  })

  const { checkAndUpdateIpIfNeeded } = await import('../js/ipManager.js')
  const ipRes = await checkAndUpdateIpIfNeeded(false)
  globalThis.fetch = origFetch

  assert.strictEqual(ipRes.changed, true, 'Must detect mismatch between stale preset timezone and IP timezone even when IP matches lastIp')
  assert.strictEqual(mockStorageData.timezone, 'Europe/Berlin')
  assert.strictEqual(mockStorageData.locale, 'de-DE')
  console.log('  PASS: ipManager.js mismatch recovery and instant hydration verified.')

  console.log('Test 13: Testing Cloudflare Turnstile compatibility, WebIDL Illegal invocation, stack sanitization, and C++ CDP auto-unwrapping...')
  // 13a. Verify challenge frame guard exits immediately without touching globals
  const cfContext = vm.createContext({
    location: {
      hostname: 'challenges.cloudflare.com',
      pathname: '/cdn-cgi/challenge-platform/h/g/turnstile/f/av0/rch/123',
    },
  })
  vm.runInContext(
    `
    globalThis.window = globalThis;
    globalThis.__origDate = Date;
    globalThis.__origDTF = Intl.DateTimeFormat;
    globalThis.__origToString = Function.prototype.toString;
    `,
    cfContext
  )
  for (const b of tokyoBits) {
    vm.runInContext(`(window.__cloaq_b=window.__cloaq_b||[]).push(${b});`, cfContext)
  }
  vm.runInContext(contentSpoofCode, cfContext)
  assert.strictEqual(vm.runInContext(`'__cloaq_b' in window`, cfContext), false)
  assert.strictEqual(vm.runInContext(`Date === __origDate`, cfContext), true)
  assert.strictEqual(vm.runInContext(`Intl.DateTimeFormat === __origDTF`, cfContext), true)
  assert.strictEqual(vm.runInContext(`Function.prototype.toString === __origToString`, cfContext), true)

  // 13b. Verify WebIDL Illegal invocation on Navigator.prototype.language / languages & Keyboard.prototype.getLayoutMap
  assert.strictEqual(
    vm.runInContext(
      `(() => { try { return Navigator.prototype.language; } catch (e) { return e instanceof TypeError && e.message.includes('Illegal invocation'); } })()`,
      vmContext
    ),
    true
  )
  assert.strictEqual(
    vm.runInContext(
      `(() => { try { return Navigator.prototype.languages; } catch (e) { return e instanceof TypeError && e.message.includes('Illegal invocation'); } })()`,
      vmContext
    ),
    true
  )
  assert.strictEqual(
    vm.runInContext(
      `(() => { try { navigator.keyboard.getLayoutMap.call({}); return false; } catch (e) { return e instanceof TypeError && e.message.includes('Illegal invocation'); } })()`,
      vmContext
    ),
    true
  )

  // 13c. Verify Proxy-wrapped Function.prototype.toString parity with native functions & stack trace sanitization
  assert.strictEqual(
    vm.runInContext(
      `Function.prototype.toString.call(new Proxy(navigator.keyboard.getLayoutMap, {}))`,
      vmContext
    ),
    vm.runInContext(
      `Function.prototype.toString.call(new Proxy(Math.sin, {}))`,
      vmContext
    )
  )
  assert.strictEqual(
    vm.runInContext(
      `(() => {
        try {
          Function.prototype.toString.call(null);
          return false;
        } catch (e) {
          return !String(e.stack || '').includes('applyCloaqSpoof') && !String(e.stack || '').includes('contentSpoof.js');
        }
      })()`,
      vmContext
    ),
    true
  )

  // 13d. Verify automatic unwrapping back to 100% native C++ Date & Intl when C++ CDP Emulation becomes active
  const cdpSimContext = vm.createContext({})
  vm.runInContext(
    `
    class MockNavigatorProto {}
    const mockNavInstance = Object.create(MockNavigatorProto.prototype);
    mockNavInstance.keyboard = {};
    globalThis.window = globalThis;
    globalThis.Navigator = MockNavigatorProto;
    globalThis.navigator = mockNavInstance;
    globalThis.__origDate = Date;
    globalThis.__origDTF = Intl.DateTimeFormat;
    globalThis.__origResolved = Intl.DateTimeFormat.prototype.resolvedOptions;
    globalThis.__cdpTz = null;
    globalThis.__cdpLoc = null;
    Intl.DateTimeFormat.prototype.resolvedOptions = function () {
      const res = globalThis.__origResolved.call(this);
      if (globalThis.__cdpTz) res.timeZone = globalThis.__cdpTz;
      if (globalThis.__cdpLoc) res.locale = globalThis.__cdpLoc;
      return res;
    };
    `,
    cdpSimContext
  )
  // Step 1: At 0.00ms before CDP Emulation lands, JS pre-shield wraps Date & Intl.DateTimeFormat
  vm.runInContext(generateInjectionScript('de-DE', 'Europe/Berlin'), cdpSimContext)
  assert.strictEqual(vm.runInContext(`Date !== __origDate`, cdpSimContext), true)
  assert.strictEqual(vm.runInContext(`Intl.DateTimeFormat !== __origDTF`, cdpSimContext), true)
  assert.strictEqual(vm.runInContext(`Intl.DateTimeFormat().resolvedOptions().timeZone`, cdpSimContext), 'Europe/Berlin')

  // Step 2: Simulate C++ CDP Emulation.setTimezoneOverride & Emulation.setLocaleOverride landing
  vm.runInContext(`globalThis.__cdpTz = 'Europe/Berlin'; globalThis.__cdpLoc = 'de-DE';`, cdpSimContext)
  vm.runInContext(generateInjectionScript('de-DE', 'Europe/Berlin'), cdpSimContext)
  assert.strictEqual(
    vm.runInContext(`Date === __origDate`, cdpSimContext),
    true,
    'window.Date must unwrap back to 100% native C++ Date once CDP Emulation is active'
  )
  assert.strictEqual(
    vm.runInContext(`Intl.DateTimeFormat === __origDTF`, cdpSimContext),
    true,
    'Intl.DateTimeFormat must unwrap back to 100% native C++ DateTimeFormat once CDP Emulation is active'
  )
  console.log('  PASS: Cloudflare Turnstile compatibility, WebIDL Illegal invocation, stack sanitization, and C++ CDP auto-unwrapping verified.')

  console.log('\nAll 13 tests passed successfully!')
}

runTests().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})

