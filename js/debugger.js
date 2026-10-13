import {
  generateInjectionScript,
  encodeSpoofConfigToBits,
} from './keyboardLayouts.js'

const SHIELD_SCRIPT_ID = 'cloaq-main-shield'
const attachedTabs = new Set()
const tabAppliedTimezone = new Map()
const tabInFlightTimezone = new Map()
const tabRegisteredScript = new Map()
const pendingAttachTimers = new Map()
const inFlightAttach = new Map()
let shieldSyncQueue = Promise.resolve()

const clearTabTracking = (tabId) => {
  attachedTabs.delete(tabId)
  tabAppliedTimezone.delete(tabId)
  tabInFlightTimezone.delete(tabId)
  tabRegisteredScript.delete(tabId)
  inFlightAttach.delete(tabId)
}

if (typeof chrome !== 'undefined' && chrome.debugger) {
  if (chrome.debugger.onDetach) {
    chrome.debugger.onDetach.addListener((source) => {
      if (source?.tabId) {
        clearTabTracking(source.tabId)
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

const normalizeScriptPath = (p) => String(p || '').replace(/^\/+/, '')

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
        excludeMatches: [
          '*://challenges.cloudflare.com/*',
          '*://*.challenges.cloudflare.com/*',
          '*://*/*/cdn-cgi/challenge-platform/*',
        ],
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
          currentJs.every(
            (f, idx) => normalizeScriptPath(f) === normalizeScriptPath(jsFiles[idx])
          )
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
        : { tabId, frameIds: [0] }

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

  const prevTz = tabAppliedTimezone.get(tabId)
  const inFlightTz = tabInFlightTimezone.get(tabId)

  // Avoid re-sending identical timezone override during same navigation (prevents mid-load reset race)
  if (prevTz === timezone || inFlightTz === timezone) {
    return
  }

  tabInFlightTimezone.set(tabId, timezone)

  const setTz = () => {
    chrome.debugger.sendCommand(
      { tabId },
      'Emulation.setTimezoneOverride',
      { timezoneId: timezone },
      () => {
        const err = chrome.runtime.lastError
        if (!err) {
          tabInFlightTimezone.delete(tabId)
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
                    tabInFlightTimezone.delete(tabId)
                    if (!chrome.runtime.lastError) {
                      tabAppliedTimezone.set(tabId, timezone)
                    }
                  }
                )
              } else {
                tabInFlightTimezone.delete(tabId)
              }
            }
          )
        } else {
          tabInFlightTimezone.delete(tabId)
          if (
            msg.includes('not attached') ||
            msg.includes('Detached') ||
            msg.includes('No target')
          ) {
            clearTabTracking(tabId)
          }
        }
      }
    )
  }

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
  }

  if (timezone || locale || (lat != null && lon != null)) {
    const scriptSource = generateInjectionScript(locale, timezone, lat, lon)
    const prevScript = tabRegisteredScript.get(tabId)

    if (!prevScript || prevScript.source !== scriptSource) {
      tabRegisteredScript.set(tabId, {
        source: scriptSource,
        identifier: prevScript?.identifier || null,
      })

      chrome.debugger.sendCommand({ tabId }, 'Page.enable', {}, () => {
        if (!chrome.runtime.lastError) {
          if (prevScript?.identifier) {
            chrome.debugger.sendCommand(
              { tabId },
              'Page.removeScriptToEvaluateOnNewDocument',
              { identifier: prevScript.identifier },
              () => {
                if (chrome.runtime.lastError) {}
              }
            )
          }
          chrome.debugger.sendCommand(
            { tabId },
            'Page.addScriptToEvaluateOnNewDocument',
            { source: scriptSource },
            (res) => {
              if (!chrome.runtime.lastError && res?.identifier) {
                const cur = tabRegisteredScript.get(tabId)
                if (cur && cur.source === scriptSource) {
                  cur.identifier = res.identifier
                }
              }
            }
          )
        }
      })
    }

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

const attachDebugger = (
  tabId,
  timezone,
  locale,
  lat,
  lon,
  retryCount = 0,
  isCommitted = false
) => {
  if (!timezone && !locale && (lat == null || lon == null)) return

  clearPendingRetry(tabId)

  if (inFlightAttach.has(tabId)) {
    const state = inFlightAttach.get(tabId)
    state.timezone = timezone
    state.locale = locale
    state.lat = lat
    state.lon = lon
    if (isCommitted) state.committed = true
    return
  }

  inFlightAttach.set(tabId, {
    timezone,
    locale,
    lat,
    lon,
    committed: Boolean(isCommitted),
  })

  chrome.debugger.attach({ tabId }, '1.3', () => {
    const err = chrome.runtime.lastError
    const state = inFlightAttach.get(tabId) || {
      timezone,
      locale,
      lat,
      lon,
      committed: false,
    }
    inFlightAttach.delete(tabId)

    if (!err || err.message?.includes('Another debugger is already attached')) {
      attachedTabs.add(tabId)
      sendOverrides(
        tabId,
        state.timezone,
        state.locale,
        state.lat,
        state.lon
      )
    } else if (retryCount < 7) {
      // If commit arrived while attach was in flight on chrome://newtab, retry immediately
      const delays = [15, 30, 60, 100, 160, 250, 400]
      const delayMs = state.committed && retryCount === 0 ? 0 : delays[retryCount] || 100
      const timer = setTimeout(() => {
        pendingAttachTimers.delete(tabId)
        attachDebugger(
          tabId,
          state.timezone,
          state.locale,
          state.lat,
          state.lon,
          retryCount + 1,
          false
        )
      }, delayMs)
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
    attachDebugger(tabId, timezone, locale, lat, lon, 0, isCommitted)
  }
}

const detachDebugger = () => {
  for (const timer of pendingAttachTimers.values()) {
    clearTimeout(timer)
  }
  pendingAttachTimers.clear()
  inFlightAttach.clear()
  attachedTabs.clear()
  tabAppliedTimezone.clear()
  tabInFlightTimezone.clear()
  tabRegisteredScript.clear()

  const resetScript = generateInjectionScript(null, null, null, null)

  chrome.debugger.getTargets((tabs) => {
    if (chrome.runtime?.lastError || !Array.isArray(tabs)) return
    for (const tab of tabs) {
      if (tab.attached && tab.tabId) {
        const tid = tab.tabId
        chrome.debugger.sendCommand(
          { tabId: tid },
          'Runtime.evaluate',
          {
            expression: resetScript,
            includeCommandLineAPI: false,
            silent: true,
            returnByValue: true,
          },
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
        chrome.debugger.sendCommand(
          { tabId: tid },
          'Emulation.clearGeolocationOverride',
          {},
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
        chrome.debugger.sendCommand(
          { tabId: tid },
          'Emulation.setLocaleOverride',
          { locale: '' },
          () => {
            if (chrome.runtime.lastError) {}
          }
        )
        chrome.debugger.sendCommand(
          { tabId: tid },
          'Emulation.setTimezoneOverride',
          { timezoneId: '' },
          () => {
            if (chrome.runtime.lastError) {}
            chrome.debugger.detach({ tabId: tid }, () => {
              if (chrome.runtime.lastError) {}
            })
          }
        )
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
    const seenTabs = new Set()
    targets.forEach((target) => {
      if (!target.tabId || seenTabs.has(target.tabId)) return
      if (target.type && target.type !== 'page') return
      if (!isSpoofableUrl(target.url)) return
      seenTabs.add(target.tabId)

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

