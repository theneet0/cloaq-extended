import { generateInjectionScript, getAcceptLanguageHeader } from './keyboardLayouts.js'

const sendOverrides = (tabId, timezone, locale, lat, lon) => {
  if (timezone) {
    chrome.debugger.sendCommand(
      { tabId: tabId },
      'Emulation.setTimezoneOverride',
      {
        timezoneId: timezone,
      },
      () => {
        if (chrome.runtime.lastError) {
          // Timezone error or already in effect; ignore
        }
      }
    )
  }

  if (lat != null && lon != null) {
    chrome.debugger.sendCommand(
      { tabId: tabId },
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
      { tabId: tabId },
      'Emulation.setLocaleOverride',
      {
        locale,
      },
      () => {
        if (chrome.runtime.lastError) {}
      }
    )

    const acceptLang = getAcceptLanguageHeader(locale)
    if (acceptLang) {
      chrome.debugger.sendCommand({ tabId: tabId }, 'Network.enable', {}, () => {
        if (!chrome.runtime.lastError) {
          chrome.debugger.sendCommand(
            { tabId: tabId },
            'Network.setExtraHTTPHeaders',
            {
              headers: {
                'Accept-Language': acceptLang,
              },
            }
          )
        }
      })
    }

    const scriptSource = generateInjectionScript(locale, timezone)

    chrome.debugger.sendCommand({ tabId: tabId }, 'Page.enable', {}, () => {
      if (!chrome.runtime.lastError) {
        chrome.debugger.sendCommand(
          { tabId: tabId },
          'Page.addScriptToEvaluateOnNewDocument',
          {
            source: scriptSource,
          }
        )
      }
    })

    // Also evaluate in the active document immediately for real-time live spoofing
    chrome.debugger.sendCommand({ tabId: tabId }, 'Runtime.enable', {}, () => {
      if (!chrome.runtime.lastError) {
        chrome.debugger.sendCommand(
          { tabId: tabId },
          'Runtime.evaluate',
          {
            expression: scriptSource,
            includeCommandLineAPI: false,
            silent: true,
            returnByValue: true,
          }
        )
      }
    })
  }
}

const attachDebugger = (tabId, timezone, locale, lat, lon) => {
  if (timezone || locale || lat != null || lon != null) {
    chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
      const err = chrome.runtime.lastError
      if (!err || err.message?.includes('Another debugger is already attached')) {
        sendOverrides(tabId, timezone, locale, lat, lon)
      }
    })
  }
}

const detachDebugger = () => {
  chrome.debugger.getTargets((tabs) => {
    for (const tab in tabs) {
      if (tabs[tab].attached && tabs[tab].tabId) {
        chrome.debugger.sendCommand(
          { tabId: tabs[tab].tabId },
          'Emulation.clearGeolocationOverride',
          {}
        )
        chrome.debugger.detach({ tabId: tabs[tab].tabId })
      }
    }
  })
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
    detachDebugger()
    return
  }

  if (!storage.timezone && !storage.locale && storage.lat == null && storage.lon == null) {
    return
  }

  chrome.debugger.getTargets((targets) => {
    const attachedTabs = targets.filter((t) => t.attached && t.tabId)
    attachedTabs.forEach((target) => {
      sendOverrides(
        target.tabId,
        storage.timezone,
        storage.locale,
        storage.lat,
        storage.lon
      )
    })
  })
}

export {
  attachDebugger,
  detachDebugger,
  sendOverrides,
  updateAllTabsWithCurrentOverrides,
}
