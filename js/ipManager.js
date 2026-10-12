import countryLocales from './countryLocales.js'
import { getAcceptLanguageHeader } from './keyboardLayouts.js'
import { updateAllTabsWithCurrentOverrides } from './debugger.js'

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
  const timeoutMs = 3500

  const fetchWithTimeout = async (url) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const text = await response.text()
      return JSON.parse(text)
    } catch (err) {
      clearTimeout(timer)
      throw err
    }
  }

  // Provider 1: ipwho.is (HTTPS, fast, rich data)
  try {
    const data = await fetchWithTimeout('https://ipwho.is/')
    if (data && data.success && data.ip) {
      return {
        ip: data.ip,
        countryCode: data.country_code,
        timezone: data.timezone?.id || null,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
  } catch (e) {
    // continue to fallback
  }

  // Provider 2: ip-api.com (HTTP fallback)
  try {
    const data = await fetchWithTimeout(
      'http://ip-api.com/json/?fields=status,message,countryCode,lat,lon,timezone,query'
    )
    if (data && data.status === 'success' && data.query) {
      return {
        ip: data.query,
        countryCode: data.countryCode,
        timezone: data.timezone || null,
        lat: data.lat,
        lon: data.lon,
      }
    }
  } catch (e) {
    // continue to fallback
  }

  // Provider 3: freeipapi.com (HTTPS fallback, clean JSON, no auth)
  try {
    const data = await fetchWithTimeout('https://freeipapi.com/api/json')
    if (data && data.ipAddress && data.countryCode) {
      const tz = Array.isArray(data.timeZones) && data.timeZones.length > 0 ? data.timeZones[0] : null
      return {
        ip: data.ipAddress,
        countryCode: data.countryCode,
        timezone: tz,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
  } catch (e) {
    // continue to fallback
  }

  // Provider 4: ipapi.co (HTTPS fallback)
  try {
    const data = await fetchWithTimeout('https://ipapi.co/json/')
    if (data && data.ip && data.country_code) {
      return {
        ip: data.ip,
        countryCode: data.country_code,
        timezone: data.timezone || null,
        lat: data.latitude,
        lon: data.longitude,
      }
    }
  } catch (e) {
    // all failed
  }

  return null
}

let isChecking = false

export const checkAndUpdateIpIfNeeded = async (force = false) => {
  if (isChecking) return null
  isChecking = true

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
    if (!force && storage.lastCheckTime && now - storage.lastCheckTime < 15000) {
      return { changed: false, ip: storage.lastIp }
    }

    const geo = await fetchCurrentIpGeo()
    if (!geo) {
      return {
        changed: false,
        ip: storage.lastIp,
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

      await updateAcceptLanguageRule(locale)
      await updateAllTabsWithCurrentOverrides()

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
      return { changed: false, ip: geo.ip, country: geo.countryCode }
    }
  } catch (err) {
    console.error('Error in checkAndUpdateIpIfNeeded:', err)
    return null
  } finally {
    isChecking = false
  }
}
