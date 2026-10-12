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
        if (
          chrome.runtime.lastError &&
          chrome.runtime.lastError.message?.includes(
            'Timezone override is already in effect'
          )
        ) {
          // Timezone override is already active, ignore
        }
      }
    )
  }

  if (lat || lon) {
    chrome.debugger.sendCommand(
      { tabId: tabId },
      'Emulation.setGeolocationOverride',
      {
        latitude: lat,
        longitude: lon,
        accuracy: 1,
      }
    )
  }

  if (locale) {
    chrome.debugger.sendCommand(
      { tabId: tabId },
      'Emulation.setLocaleOverride',
      {
        locale,
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

    chrome.debugger.sendCommand({ tabId: tabId }, 'Page.enable', {}, () => {
      if (!chrome.runtime.lastError) {
        chrome.debugger.sendCommand(
          { tabId: tabId },
          'Page.addScriptToEvaluateOnNewDocument',
          {
            source: generateInjectionScript(locale, timezone),
          }
        )
      }
    })
  }
}

const attachDebugger = (tabId, timezone, locale, lat, lon) => {
  if (timezone || locale || lat || lon) {
    chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
      const err = chrome.runtime.lastError
      if (!err) {
        sendOverrides(tabId, timezone, locale, lat, lon)
      } else if (
        err.message?.includes('Another debugger is already attached')
      ) {
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
          {
            autoAttach: true,
            waitForDebuggerOnStart: false,
            flatten: true,
          }
        )
        chrome.debugger.detach({ tabId: tabs[tab].tabId })
      }
    }
  })
}

export { attachDebugger, detachDebugger, sendOverrides }
