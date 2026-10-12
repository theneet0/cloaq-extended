import {
  generateInjectionScript,
  getAcceptLanguageHeader,
  encodeSpoofConfigToBits,
} from './keyboardLayouts.js'

const SHIELD_SCRIPT_ID = 'cloaq-main-shield'
const attachedTabs = new Set()
const tabAppliedTimezone = new Map()
const pendingAttachTimers = new Map()
let shieldSyncQueue = Promise.resolve()

if (typeof chrome !== 'undefined' && chrome.debugger) {
  if (chrome.debugger.onDetach) {
    chrome.debugger.onDetach.addListener((source) => {
      if (source?.tabId) {
        attachedTabs.delete(source.tabId)
        tabAppliedTimezone.delete(source.tabId)
      }
    })
  }
  if (chrome.debugger.getTargets) {
    try {
      chrome.debugger.getTargets((targets) => {
        if (chrome.runtime?.lastError || !Array.isArray(targets)) return
        targets.forEach((t) => {
          if (t.attached && t.tabId) {
            attachedTabs.add(t.tabId)
          }
        })
      })
    } catch (e) {}
  }
}

const clearPendingRetry = (tabId) => {
  const timer = pendingAttachTimers.get(tabId)
  if (timer) {
    clearTimeout(timer)
    pendingAttachTimers.delete(tabId)
  }
}

export const syncContentScriptShield = (timezone, locale, lat, lon) => {
  if (typeof chrome === 'undefined' || !chrome.scripting) {
    return Promise.resolve()
  }

  shieldSyncQueue = shieldSyncQueue
    .then(async () => {
      const hasActiveSpoof = Boolean(
        timezone ||
          locale ||
          (lat != null && lat !== '' && lon != null && lon !== '')
      )

      if (!hasActiveSpoof) {
        try {
          await chrome.scripting.unregisterContentScripts({
            ids: [SHIELD_SCRIPT_ID],
          })
        } catch (e) {}
        return
      }

      const bitIndices = encodeSpoofConfigToBits(timezone, locale, lat, lon)
      const jsFiles = [
        ...bitIndices.map((b) => `js/bits/b${b}.js`),
        'js/contentSpoof.js',
      ]

      const scriptDef = {
        id: SHIELD_SCRIPT_ID,
        matches: ['<all_urls>'],
        js: jsFiles,
        runAt: 'document_start',
        world: 'MAIN',
        allFrames: true,
        matchOriginAsFallback: true,
        persistAcrossSessions: true,
      }

      let existing = []
      try {
        existing = await chrome.scripting.getRegisteredContentScripts({
          ids: [SHIELD_SCRIPT_ID],
        })
      } catch (e) {
        existing = []
      }

      if (existing.length > 0) {
        const currentJs = existing[0].js || []
        const isSame =
          currentJs.length === jsFiles.length &&
          currentJs.every((f, idx) => f === jsFiles[idx])
        if (isSame) return

        try {
          if (typeof chrome.scripting.updateContentScripts === 'function') {
            await chrome.scripting.updateContentScripts([scriptDef])
            return
          }
        } catch (e) {}

        try {
          await chrome.scripting.unregisterContentScripts({
            ids: [SHIELD_SCRIPT_ID],
          })
        } catch (e) {}
      }

      try {
        await chrome.scripting.registerContentScripts([scriptDef])
      } catch (e) {
        console.warn('Failed to register MAIN world content script shield:', e)
      }
    })
    .catch(() => {})

  return shieldSyncQueue
}

export const injectImmediateMainWorldSpoof = (
  tabId,
  timezone,
  locale,
  lat,
  lon,
  frameId = null
) => {
  if (typeof chrome === 'undefined' || !chrome.scripting?.executeScript) return
  if (!timezone && !locale && (lat == null || lon == null)) return

  try {
    const bitIndices = encodeSpoofConfigToBits(timezone, locale, lat, lon)
    const files = [
      ...bitIndices.map((b) => `js/bits/b${b}.js`),
      'js/contentSpoof.js',
    ]
    const target =
      frameId != null
        ? { tabId, frameIds: [frameId] }
        : { tabId, allFrames: true }

    chrome.scripting.executeScript(
      {
        target,
        world: 'MAIN',
        injectImmediately: true,
        files,
      },
      () => {
        if (chrome.runtime?.lastError) {
          // Ignore errors on restricted/closed frames
        }
      }
    )
  } catch (e) {}
}

const applyTimezoneViaCdp = (tabId, timezone) => {
  if (!timezone) return

  const setTz = () => {
    chrome.debugger.sendCommand(
      { tabId },
      'Emulation.setTimezoneOverride',
      { timezoneId: timezone },
      () => {
        const err = chrome.runtime.lastError
        if (!err) {
          tabAppliedTimezone.set(tabId, timezone)
          return
        }
        const msg = err.message || ''
        if (msg.includes('already in effect')) {
          // Clear previous override first, then apply the new timezoneId
          chrome.debugger.sendCommand(
            { tabId },
            'Emulation.setTimezoneOverride',
            { timezoneId: '' },
            () => {
              if (!chrome.runtime.lastError) {
                chrome.debugger.sendCommand(
                  { tabId },
                  'Emulation.setTimezoneOverride',
                  { timezoneId: timezone },
                  () => {
                    if (!chrome.runtime.lastError) {
                      tabAppliedTimezone.set(tabId, timezone)
                    }
                  }
                )
              }
            }
          )
        } else if (
          msg.includes('not attached') ||
          msg.includes('Detached') ||
          msg.includes('No target')
        ) {
          attachedTabs.delete(tabId)
          tabAppliedTimezone.delete(tabId)
        }
      }
    )
  }

  const prevTz = tabAppliedTimezone.get(tabId)
  if (prevTz && prevTz !== timezone) {
    chrome.debugger.sendCommand(
      { tabId },
      'Emulation.setTimezoneOverride',
      { timezoneId: '' },
      () => {
        if (chrome.runtime.lastError) {}
        setTz()
      }
    )
  } else {
    setTz()
  }
}

const sendOverrides = (tabId, timezone, locale, lat, lon) => {
  if (timezone) {
    applyTimezoneViaCdp(tabId, timezone)
  }

  if (lat != null && lon != null && lat !== '' && lon !== '') {
    chrome.debugger.sendCommand(
      { tabId },
      'Emulation.setGeolocationOverride',
      {
        latitude: Number(lat),
        longitude: Number(lon),
        accuracy: 1,
      },
      () => {
        if (chrome.runtime.lastError) {}
      }
    )
  }

  if (locale) {
    chrome.debugger.sendCommand(
      { tabId },
      'Emulation.setLocaleOverride',
      { locale },
      () => {
        if (chrome.runtime.lastError) {}
      }
    )

    const acceptLang = getAcceptLanguageHeader(locale)
    if (acceptLang) {
      chrome.debugger.sendCommand({ tabId }, 'Network.enable', {}, () => {
        if (!chrome.runtime.lastError) {
          chrome.debugger.sendCommand(
            { tabId },
            'Network.setExtraHTTPHeaders',
            {
              headers: {
                'Accept-Language': acceptLang,
              },
            },
            () => {
              if (chrome.runtime.lastError) {}
            }
          )
        }
      })
    }
  }

  if (timezone || locale || (lat != null && lon != null)) {
    const scriptSource = generateInjectionScript(locale, timezone, lat, lon)

    chrome.debugger.sendCommand({ tabId }, 'Page.enable', {}, () => {
      if (!chrome.runtime.lastError) {
        chrome.debugger.sendCommand(
          { tabId },
          'Page.addScriptToEvaluateOnNewDocument',
          { source: scriptSource },
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
      }
    })

    // Evaluate directly without Runtime.enable for faster execution & anti-CDP stealth
    chrome.debugger.sendCommand(
      { tabId },
      'Runtime.evaluate',
      {
        expression: scriptSource,
        includeCommandLineAPI: false,
        silent: true,
        returnByValue: true,
      },
      () => {
        if (chrome.runtime.lastError) {}
      }
    )
  }
}

const attachDebugger = (tabId, timezone, locale, lat, lon, retryCount = 0) => {
  if (!timezone && !locale && (lat == null || lon == null)) return

  clearPendingRetry(tabId)

  chrome.debugger.attach({ tabId }, '1.3', () => {
    const err = chrome.runtime.lastError
    if (!err || err.message?.includes('Another debugger is already attached')) {
      attachedTabs.add(tabId)
      sendOverrides(tabId, timezone, locale, lat, lon)
    } else if (retryCount < 6) {
      // Tab may still be transitioning away from chrome://newtab; retry rapidly
      const delays = [25, 50, 90, 150, 250, 400]
      const timer = setTimeout(() => {
        pendingAttachTimers.delete(tabId)
        attachDebugger(tabId, timezone, locale, lat, lon, retryCount + 1)
      }, delays[retryCount] || 100)
      pendingAttachTimers.set(tabId, timer)
    }
  })
}

export const ensureTabSpoofed = (
  tabId,
  timezone,
  locale,
  lat,
  lon,
  isCommitted = false
) => {
  if (!timezone && !locale && (lat == null || lon == null)) return

  if (isCommitted) {
    injectImmediateMainWorldSpoof(tabId, timezone, locale, lat, lon)
  }

  if (attachedTabs.has(tabId)) {
    sendOverrides(tabId, timezone, locale, lat, lon)
  } else {
    attachDebugger(tabId, timezone, locale, lat, lon, 0)
  }
}

const detachDebugger = () => {
  for (const timer of pendingAttachTimers.values()) {
    clearTimeout(timer)
  }
  pendingAttachTimers.clear()
  attachedTabs.clear()
  tabAppliedTimezone.clear()

  chrome.debugger.getTargets((tabs) => {
    if (chrome.runtime?.lastError || !Array.isArray(tabs)) return
    for (const tab of tabs) {
      if (tab.attached && tab.tabId) {
        chrome.debugger.sendCommand(
          { tabId: tab.tabId },
          'Emulation.clearGeolocationOverride',
          {},
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
        chrome.debugger.sendCommand(
          { tabId: tab.tabId },
          'Emulation.setTimezoneOverride',
          { timezoneId: '' },
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
        chrome.debugger.detach({ tabId: tab.tabId }, () => {
          if (chrome.runtime.lastError) {}
        })
      }
    }
  })
}

const isSpoofableUrl = (url) => {
  if (!url) return false
  return (
    !url.startsWith('chrome://') &&
    !url.startsWith('chrome-extension://') &&
    !url.startsWith('devtools://') &&
    !url.startsWith('edge://') &&
    !url.startsWith('brave://') &&
    !url.startsWith('about:')
  )
}

const updateAllTabsWithCurrentOverrides = async () => {
  const storage = await chrome.storage.local.get([
    'configuration',
    'timezone',
    'locale',
    'lat',
    'lon',
  ])

  if (storage.configuration === 'browserDefault') {
    await syncContentScriptShield(null, null, null, null)
    detachDebugger()
    return
  }

  if (
    !storage.timezone &&
    !storage.locale &&
    storage.lat == null &&
    storage.lon == null
  ) {
    return
  }

  await syncContentScriptShield(
    storage.timezone,
    storage.locale,
    storage.lat,
    storage.lon
  )

  chrome.debugger.getTargets((targets) => {
    if (chrome.runtime?.lastError || !Array.isArray(targets)) return
    targets.forEach((target) => {
      if (!target.tabId || !isSpoofableUrl(target.url)) return
      injectImmediateMainWorldSpoof(
        target.tabId,
        storage.timezone,
        storage.locale,
        storage.lat,
        storage.lon
      )
      if (target.attached) {
        attachedTabs.add(target.tabId)
        sendOverrides(
          target.tabId,
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
      } else {
        attachDebugger(
          target.tabId,
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
      }
    })
  })
}

export {
  attachDebugger,
  detachDebugger,
  sendOverrides,
  updateAllTabsWithCurrentOverrides,
}
