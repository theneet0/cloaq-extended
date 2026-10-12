import {
  attachDebugger,
  detachDebugger,
  sendOverrides,
  updateAllTabsWithCurrentOverrides,
} from './debugger.js'
import {
  checkAndUpdateIpIfNeeded,
  updateAcceptLanguageRule,
} from './ipManager.js'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      active: true,
      url: 'html/info.html',
    })
  }

  chrome.alarms.create('checkIpAlarm', { periodInMinutes: 1 })

  chrome.storage.local.get(['configuration', 'locale'], (storage) => {
    if (storage.configuration === 'ipAddress') {
      checkAndUpdateIpIfNeeded(true)
    } else if (storage.configuration && storage.configuration !== 'browserDefault' && storage.locale) {
      updateAcceptLanguageRule(storage.locale)
    }
  })
})

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('checkIpAlarm', { periodInMinutes: 1 })

  chrome.storage.local.get(['configuration', 'locale'], (storage) => {
    if (storage.configuration === 'ipAddress') {
      checkAndUpdateIpIfNeeded(true)
    } else if (storage.configuration && storage.configuration !== 'browserDefault' && storage.locale) {
      updateAcceptLanguageRule(storage.locale)
    }
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkIpAlarm') {
    checkAndUpdateIpIfNeeded(false)
  }
})

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return

  if (
    details.url?.startsWith('chrome://') ||
    details.url?.startsWith('chrome-extension://') ||
    details.url?.startsWith('devtools://') ||
    details.url?.startsWith('about:')
  ) {
    return
  }

  const storage = await chrome.storage.local.get([
    'configuration',
    'timezone',
    'locale',
    'lat',
    'lon',
    'lastCheckTime',
  ])

  if (storage.configuration === 'browserDefault') return

  // 1. Immediately attach debugger and apply current overrides without blocking navigation
  if (storage.timezone || storage.locale || storage.lat != null || storage.lon != null) {
    chrome.debugger.getTargets((tabs) => {
      const currentTab = tabs.find((obj) => obj.tabId === details.tabId)
      if (!currentTab?.attached) {
        attachDebugger(
          details.tabId,
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
      } else {
        sendOverrides(
          details.tabId,
          storage.timezone,
          storage.locale,
          storage.lat,
          storage.lon
        )
      }
    })
  }

  // 2. Trigger asynchronous background IP check (non-blocking)
  if (storage.configuration === 'ipAddress') {
    const now = Date.now()
    if (!storage.lastCheckTime || now - storage.lastCheckTime > 15000) {
      checkAndUpdateIpIfNeeded(false)
    }
  }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return

  if (changes.configuration) {
    const newConfig = changes.configuration.newValue
    if (newConfig === 'browserDefault') {
      updateAcceptLanguageRule(null)
      detachDebugger()
    } else if (newConfig === 'ipAddress') {
      checkAndUpdateIpIfNeeded(true)
    } else {
      chrome.storage.local.get(['locale'], (storage) => {
        if (storage.locale) {
          updateAcceptLanguageRule(storage.locale)
        }
      })
      updateAllTabsWithCurrentOverrides()
    }
  } else if (changes.locale || changes.timezone || changes.lat || changes.lon) {
    chrome.storage.local.get(['configuration', 'locale'], (storage) => {
      if (storage.configuration && storage.configuration !== 'browserDefault') {
        if (changes.locale) {
          updateAcceptLanguageRule(changes.locale.newValue)
        }
        updateAllTabsWithCurrentOverrides()
      }
    })
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
    detachDebugger()
    sendResponse({ success: true })
    return true
  }
})
