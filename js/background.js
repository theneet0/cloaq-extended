import {
  detachDebugger,
  ensureTabSpoofed,
  injectImmediateMainWorldSpoof,
  syncContentScriptShield,
  updateAllTabsWithCurrentOverrides,
} from './debugger.js'
import {
  checkAndUpdateIpIfNeeded,
  updateAcceptLanguageRule,
} from './ipManager.js'

const cachedState = {
  hydrated: false,
  configuration: 'browserDefault',
  timezone: null,
  locale: null,
  lat: null,
  lon: null,
  lastCheckTime: 0,
}

const applyStorageToCache = (storage) => {
  if (!storage) return
  if (storage.configuration !== undefined) {
    cachedState.configuration = storage.configuration || 'browserDefault'
  }
  if (storage.timezone !== undefined) cachedState.timezone = storage.timezone || null
  if (storage.locale !== undefined) cachedState.locale = storage.locale || null
  if (storage.lat !== undefined) cachedState.lat = storage.lat ?? null
  if (storage.lon !== undefined) cachedState.lon = storage.lon ?? null
  if (storage.lastCheckTime !== undefined) {
    cachedState.lastCheckTime = storage.lastCheckTime || 0
  }
  cachedState.hydrated = true
}

const hydratePromise = chrome.storage.local
  .get(['configuration', 'timezone', 'locale', 'lat', 'lon', 'lastCheckTime'])
  .then((storage) => {
    applyStorageToCache(storage)
    if (cachedState.configuration === 'browserDefault') {
      syncContentScriptShield(null, null, null, null)
    } else if (
      cachedState.timezone ||
      cachedState.locale ||
      cachedState.lat != null ||
      cachedState.lon != null
    ) {
      syncContentScriptShield(
        cachedState.timezone,
        cachedState.locale,
        cachedState.lat,
        cachedState.lon
      )
    }
    return cachedState
  })
  .catch(() => cachedState)

const isIgnorableUrl = (url) => {
  if (!url) return true
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('devtools://') ||
    url.startsWith('edge://') ||
    url.startsWith('brave://') ||
    url.startsWith('about:')
  )
}

const initializeExtensionState = () => {
  chrome.alarms.create('checkIpAlarm', { periodInMinutes: 1 })

  chrome.storage.local.get(
    ['configuration', 'timezone', 'locale', 'lat', 'lon', 'lastCheckTime'],
    (storage) => {
      applyStorageToCache(storage)
      if (storage.configuration === 'ipAddress') {
        if (storage.timezone || storage.locale) {
          syncContentScriptShield(
            storage.timezone,
            storage.locale,
            storage.lat,
            storage.lon
          )
          if (storage.locale) {
            updateAcceptLanguageRule(storage.locale)
          }
        }
        checkAndUpdateIpIfNeeded(true)
      } else if (
        storage.configuration &&
        storage.configuration !== 'browserDefault'
      ) {
        syncContentScriptShield(
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
        if (storage.locale) {
          updateAcceptLanguageRule(storage.locale)
        }
        updateAllTabsWithCurrentOverrides()
      } else {
        syncContentScriptShield(null, null, null, null)
      }
    }
  )
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      active: true,
      url: 'html/info.html',
    })
  }
  initializeExtensionState()
})

chrome.runtime.onStartup.addListener(() => {
  initializeExtensionState()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkIpAlarm') {
    checkAndUpdateIpIfNeeded(false)
  }
})

const dispatchSpoofForNavigation = (details, isCommitted) => {
  if (isIgnorableUrl(details.url)) return

  if (cachedState.configuration === 'browserDefault') return

  if (details.frameId !== 0) {
    if (isCommitted) {
      injectImmediateMainWorldSpoof(
        details.tabId,
        cachedState.timezone,
        cachedState.locale,
        cachedState.lat,
        cachedState.lon,
        details.frameId
      )
    }
    return
  }

  if (
    cachedState.timezone ||
    cachedState.locale ||
    cachedState.lat != null ||
    cachedState.lon != null
  ) {
    ensureTabSpoofed(
      details.tabId,
      cachedState.timezone,
      cachedState.locale,
      cachedState.lat,
      cachedState.lon,
      isCommitted
    )
  }

  if (!isCommitted && cachedState.configuration === 'ipAddress') {
    const now = Date.now()
    if (!cachedState.timezone && !cachedState.locale) {
      checkAndUpdateIpIfNeeded(true)
    } else if (
      !cachedState.lastCheckTime ||
      now - cachedState.lastCheckTime > 15000
    ) {
      cachedState.lastCheckTime = now
      checkAndUpdateIpIfNeeded(false)
    }
  }
}

const handleNavigation = (details, isCommitted) => {
  if (isIgnorableUrl(details.url)) return

  if (cachedState.hydrated) {
    dispatchSpoofForNavigation(details, isCommitted)
  } else {
    hydratePromise.then(() => {
      dispatchSpoofForNavigation(details, isCommitted)
    })
  }
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  handleNavigation(details, false)
})

chrome.webNavigation.onCommitted.addListener((details) => {
  handleNavigation(details, true)
})

if (chrome.webNavigation?.onCreatedNavigationTarget) {
  chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
    handleNavigation({ ...details, frameId: 0 }, false)
  })
}

if (chrome.tabs?.onCreated) {
  chrome.tabs.onCreated.addListener((tab) => {
    if (!tab?.id) return
    const url = tab.pendingUrl || tab.url
    if (isIgnorableUrl(url)) return
    handleNavigation({ tabId: tab.id, url, frameId: 0 }, false)
  })
}

if (chrome.tabs?.onUpdated) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'loading') return
    const url = changeInfo.url || tab?.pendingUrl || tab?.url
    if (isIgnorableUrl(url)) return
    if (!cachedState.hydrated || cachedState.configuration === 'browserDefault') {
      return
    }
    if (
      cachedState.timezone ||
      cachedState.locale ||
      cachedState.lat != null ||
      cachedState.lon != null
    ) {
      ensureTabSpoofed(
        tabId,
        cachedState.timezone,
        cachedState.locale,
        cachedState.lat,
        cachedState.lon,
        true
      )
    }
  })
}


chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return

  if (changes.configuration) {
    cachedState.configuration =
      changes.configuration.newValue || 'browserDefault'
  }
  if (changes.timezone) {
    cachedState.timezone = changes.timezone.newValue || null
  }
  if (changes.locale) {
    cachedState.locale = changes.locale.newValue || null
  }
  if (changes.lat) {
    cachedState.lat = changes.lat.newValue ?? null
  }
  if (changes.lon) {
    cachedState.lon = changes.lon.newValue ?? null
  }
  if (changes.lastCheckTime) {
    cachedState.lastCheckTime = changes.lastCheckTime.newValue || 0
  }
  cachedState.hydrated = true

  if (changes.configuration) {
    const newConfig = changes.configuration.newValue
    if (newConfig === 'browserDefault') {
      updateAcceptLanguageRule(null)
      syncContentScriptShield(null, null, null, null)
      detachDebugger()
    } else if (newConfig === 'ipAddress') {
      checkAndUpdateIpIfNeeded(true)
    } else {
      if (cachedState.locale) {
        updateAcceptLanguageRule(cachedState.locale)
      }
      updateAllTabsWithCurrentOverrides()
    }
  } else if (changes.locale || changes.timezone || changes.lat || changes.lon) {
    if (
      cachedState.configuration &&
      cachedState.configuration !== 'browserDefault'
    ) {
      if (changes.locale) {
        updateAcceptLanguageRule(changes.locale.newValue)
      }
      updateAllTabsWithCurrentOverrides()
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshIp') {
    checkAndUpdateIpIfNeeded(true).then((result) => {
      sendResponse(result)
    })
    return true
  }
  if (request.action === 'detachDebugger') {
    syncContentScriptShield(null, null, null, null)
    detachDebugger()
    sendResponse({ success: true })
    return true
  }
})
