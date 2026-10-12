import countryLocales from './countryLocales.js'
import { getAcceptLanguageHeader } from './keyboardLayouts.js'
import {
  updateAllTabsWithCurrentOverrides,
  syncContentScriptShield,
} from './debugger.js'

export const RULE_ID_ACCEPT_LANGUAGE = 1001

export const updateAcceptLanguageRule = async (locale) => {
  if (!chrome?.declarativeNetRequest) return

  if (!locale) {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [RULE_ID_ACCEPT_LANGUAGE],
      })
    } catch (e) {
      console.warn('Failed to clear declarativeNetRequest rule:', e)
    }
    return
  }

  const acceptLangValue = getAcceptLanguageHeader(locale)
  if (!acceptLangValue) return

  const rule = {
    id: RULE_ID_ACCEPT_LANGUAGE,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'Accept-Language',
          operation: 'set',
          value: acceptLangValue,
        },
      ],
    },
    condition: {
      urlFilter: '*',
      resourceTypes: [
        'main_frame',
        'sub_frame',
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
        'other',
      ],
    },
  }

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID_ACCEPT_LANGUAGE],
      addRules: [rule],
    })
  } catch (e) {
    console.warn('Failed to update declarativeNetRequest rule:', e)
  }
}

export const fetchCurrentIpGeo = async () => {
  const timeoutMs = 2800

  const fetchJson = async (url, externalSignal) => {
    const controller = new AbortController()
    const onAbort = () => controller.abort()
    if (externalSignal) {
      if (externalSignal.aborted) throw new Error('Aborted')
      externalSignal.addEventListener('abort', onAbort, { once: true })
    }
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store',
      })
      clearTimeout(timer)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const text = await response.text()
      return JSON.parse(text)
    } finally {
      clearTimeout(timer)
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onAbort)
      }
    }
  }

  const raceTier = async (tierRunners) => {
    const controllers = tierRunners.map(() => new AbortController())
    try {
      return await Promise.any(
        tierRunners.map((runner, idx) => runner(controllers[idx].signal))
      )
    } finally {
      controllers.forEach((c) => {
        try {
          c.abort()
        } catch (e) {}
      })
    }
  }

  const pIpWhoIs = async (signal) => {
    const data = await fetchJson('https://ipwho.is/', signal)
    if (data && data.success && data.ip && data.country_code) {
      return {
        ip: data.ip,
        countryCode: data.country_code,
        timezone: data.timezone?.id || null,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
    throw new Error('Invalid ipwho.is payload')
  }

  const pIpApiCom = async (signal) => {
    const data = await fetchJson(
      'http://ip-api.com/json/?fields=status,message,countryCode,lat,lon,timezone,query',
      signal
    )
    if (data && data.status === 'success' && data.query && data.countryCode) {
      return {
        ip: data.query,
        countryCode: data.countryCode,
        timezone: data.timezone || null,
        lat: data.lat,
        lon: data.lon,
      }
    }
    throw new Error('Invalid ip-api.com payload')
  }

  const pFreeIpApi = async (signal) => {
    const data = await fetchJson('https://freeipapi.com/api/json', signal)
    if (data && data.ipAddress && data.countryCode) {
      const tz =
        Array.isArray(data.timeZones) && data.timeZones.length > 0
          ? data.timeZones[0]
          : null
      return {
        ip: data.ipAddress,
        countryCode: data.countryCode,
        timezone: tz,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
    throw new Error('Invalid freeipapi payload')
  }

  const pIpApiCo = async (signal) => {
    const data = await fetchJson('https://ipapi.co/json/', signal)
    if (data && data.ip && data.country_code) {
      return {
        ip: data.ip,
        countryCode: data.country_code,
        timezone: data.timezone || null,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
    throw new Error('Invalid ipapi.co payload')
  }

  // Tier 1: Fast concurrent race between primary HTTPS & low-latency endpoints
  try {
    return await raceTier([pIpWhoIs, pIpApiCom])
  } catch (e) {
    // Continue to Tier 2 fallback race
  }

  // Tier 2: Concurrent fallback race
  try {
    return await raceTier([pFreeIpApi, pIpApiCo])
  } catch (e) {
    return null
  }
}

let activeCheckPromise = null

export const checkAndUpdateIpIfNeeded = async (force = false) => {
  if (activeCheckPromise) {
    return activeCheckPromise
  }

  activeCheckPromise = (async () => {
    try {
      const storage = await chrome.storage.local.get([
        'configuration',
        'lastIp',
        'lastCountry',
        'lastCheckTime',
        'timezone',
        'locale',
        'lat',
        'lon',
      ])

      if (storage.configuration !== 'ipAddress') {
        return null
      }

      const now = Date.now()
      if (
        !force &&
        storage.lastCheckTime &&
        now - storage.lastCheckTime < 15000 &&
        storage.timezone &&
        storage.locale
      ) {
        return {
          changed: false,
          ip: storage.lastIp,
          country: storage.lastCountry,
          timezone: storage.timezone,
          locale: storage.locale,
          lat: storage.lat,
          lon: storage.lon,
        }
      }

      const geo = await fetchCurrentIpGeo()
      if (!geo) {
        if (storage.timezone || storage.locale) {
          await syncContentScriptShield(
            storage.timezone,
            storage.locale,
            storage.lat,
            storage.lon
          )
        }
        return {
          changed: false,
          ip: storage.lastIp,
          country: storage.lastCountry,
          timezone: storage.timezone,
          locale: storage.locale,
          lat: storage.lat,
          lon: storage.lon,
          error: 'Network error or IP APIs unavailable',
        }
      }

      const ipChanged =
        force ||
        geo.ip !== storage.lastIp ||
        !storage.timezone ||
        !storage.locale

      if (ipChanged) {
        const locale = countryLocales[geo.countryCode] || 'en-US'
        const timezone = geo.timezone || 'UTC'
        const lat = geo.lat
        const lon = geo.lon

        await chrome.storage.local.set({
          lastIp: geo.ip,
          lastCountry: geo.countryCode,
          lastCheckTime: Date.now(),
          timezone,
          locale,
          lat,
          lon,
        })

        await Promise.all([
          updateAcceptLanguageRule(locale),
          updateAllTabsWithCurrentOverrides(),
        ])

        return {
          changed: true,
          ip: geo.ip,
          country: geo.countryCode,
          timezone,
          locale,
          lat,
          lon,
        }
      } else {
        await chrome.storage.local.set({ lastCheckTime: Date.now() })
        await syncContentScriptShield(
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
        return {
          changed: false,
          ip: geo.ip,
          country: geo.countryCode,
          timezone: storage.timezone,
          locale: storage.locale,
          lat: storage.lat,
          lon: storage.lon,
        }
      }
    } catch (err) {
      console.error('Error in checkAndUpdateIpIfNeeded:', err)
      return null
    } finally {
      activeCheckPromise = null
    }
  })()

  return activeCheckPromise
}
