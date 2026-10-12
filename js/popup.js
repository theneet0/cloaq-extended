import locationsConfigurations from './locationsConfigurations.js'

const extensionVersion = chrome.runtime.getManifest().version
document.getElementById('extensionVersion').textContent = `v${extensionVersion}`

const reloadButton = document.getElementById('reloadButton')
const infoButton = document.getElementById('infoButton')
const configurationSelect = document.querySelector('select[name="configuration"]')
const locationsOptGroup = document.getElementById('locationsOptGroup')
const timeZoneInput = document.querySelector('input[name="timeZone"]')
const localeInput = document.querySelector('input[name="locale"]')
const latitudeInput = document.querySelector('input[name="latitude"]')
const longitudeInput = document.querySelector('input[name="longitude"]')

const ipStatusContainer = document.getElementById('ipStatusContainer')
const ipStatusText = document.getElementById('ipStatusText')
const ipStatusDot = document.getElementById('ipStatusDot')
const refreshIpBtn = document.getElementById('refreshIpBtn')

// Add location options to the select menu
Object.entries(locationsConfigurations).forEach(([key, location]) => {
  const option = document.createElement('option')
  option.value = key
  option.textContent = location.name
  locationsOptGroup.appendChild(option)
})

const clearInputs = () => setInputs('', '', '', '')

const setInputs = (timezone, locale, lat, lon) => {
  timeZoneInput.value = timezone || ''
  localeInput.value = locale || ''
  latitudeInput.value = lat ?? ''
  longitudeInput.value = lon ?? ''
}

const setInputState = (isAuto) => {
  const inputs = [timeZoneInput, localeInput, latitudeInput, longitudeInput]
  inputs.forEach((input) => {
    input.readOnly = isAuto
    if (isAuto) {
      input.classList.add('bg-gray-100', 'cursor-not-allowed')
    } else {
      input.classList.remove('bg-gray-100', 'cursor-not-allowed')
    }
  })
}

const updateIpBadge = (ip, country, isChecking) => {
  if (!ipStatusContainer) return
  if (isChecking) {
    ipStatusContainer.classList.remove('hidden')
    ipStatusText.textContent = 'Detecting VPN IP...'
    ipStatusDot.className =
      'inline-block w-2 h-2 rounded-full bg-yellow-400 animate-ping shrink-0'
  } else if (ip) {
    ipStatusContainer.classList.remove('hidden')
    ipStatusText.textContent = `Connected: ${ip} (${country || ''})`
    ipStatusDot.className =
      'inline-block w-2 h-2 rounded-full bg-green-500 shrink-0'
  } else {
    ipStatusContainer.classList.add('hidden')
  }
}

const saveToStorage = async () => {
  const config = configurationSelect.value
  await chrome.storage.local.set({
    configuration: config,
    timezone: timeZoneInput.value || null,
    locale: localeInput.value || null,
    lat: latitudeInput.value !== '' ? parseFloat(latitudeInput.value) : null,
    lon: longitudeInput.value !== '' ? parseFloat(longitudeInput.value) : null,
  })
}

const handleConfigurationChange = async () => {
  const configuration = configurationSelect.value

  if (configuration === 'browserDefault') {
    clearInputs()
    setInputState(false)
    updateIpBadge(null, null, false)
    await saveToStorage()
  } else if (configuration === 'custom') {
    setInputState(false)
    updateIpBadge(null, null, false)
    await saveToStorage()
  } else if (configuration === 'ipAddress') {
    setInputState(true)
    updateIpBadge(null, null, true)
    await chrome.storage.local.set({ configuration: 'ipAddress' })
    chrome.runtime.sendMessage({ action: 'refreshIp' }, (res) => {
      if (res && res.ip) {
        setInputs(res.timezone, res.locale, res.lat, res.lon)
        updateIpBadge(res.ip, res.country, false)
      } else {
        updateIpBadge(null, null, false)
      }
    })
  } else {
    setInputState(false)
    updateIpBadge(null, null, false)
    const selectedLocation = locationsConfigurations[configuration]
    if (selectedLocation) {
      setInputs(
        selectedLocation.timezone,
        selectedLocation.locale,
        selectedLocation.lat,
        selectedLocation.lon
      )
      await saveToStorage()
    }
  }
}

const loadFromStorage = async () => {
  try {
    const storage = await chrome.storage.local.get([
      'configuration',
      'timezone',
      'locale',
      'lat',
      'lon',
      'lastIp',
      'lastCountry',
    ])

    const config = storage.configuration || 'browserDefault'
    configurationSelect.value = config

    if (config === 'ipAddress') {
      setInputState(true)
      setInputs(storage.timezone, storage.locale, storage.lat, storage.lon)
      updateIpBadge(storage.lastIp, storage.lastCountry, false)
      // Check in background if IP changed
      chrome.runtime.sendMessage({ action: 'refreshIp' }, (res) => {
        if (res && res.ip) {
          setInputs(res.timezone, res.locale, res.lat, res.lon)
          updateIpBadge(res.ip, res.country, false)
        }
      })
    } else if (config === 'browserDefault') {
      setInputState(false)
      clearInputs()
      updateIpBadge(null, null, false)
    } else {
      setInputState(false)
      setInputs(storage.timezone, storage.locale, storage.lat, storage.lon)
      updateIpBadge(null, null, false)
    }
  } catch (error) {
    console.error('Error loading from storage:', error)
  }
}

// React to background storage changes in real time
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return

  if (changes.configuration) {
    configurationSelect.value = changes.configuration.newValue || 'browserDefault'
  }

  chrome.storage.local.get(
    ['configuration', 'timezone', 'locale', 'lat', 'lon', 'lastIp', 'lastCountry'],
    (storage) => {
      if (storage.configuration === 'ipAddress') {
        setInputState(true)
        setInputs(storage.timezone, storage.locale, storage.lat, storage.lon)
        updateIpBadge(storage.lastIp, storage.lastCountry, false)
      }
    }
  )
})

// Debounce function to limit frequent save calls
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const debouncedSaveToStorage = debounce(saveToStorage, 300)

const handleInputChange = () => {
  configurationSelect.value = 'custom'
  setInputState(false)
  updateIpBadge(null, null, false)
  debouncedSaveToStorage()
}

reloadButton.addEventListener('click', () => chrome.tabs.reload())
infoButton.addEventListener('click', () =>
  chrome.tabs.create({ url: 'html/info.html' })
)
configurationSelect.addEventListener('change', handleConfigurationChange)
timeZoneInput.addEventListener('input', handleInputChange)
localeInput.addEventListener('input', handleInputChange)
latitudeInput.addEventListener('input', handleInputChange)
longitudeInput.addEventListener('input', handleInputChange)

if (refreshIpBtn) {
  refreshIpBtn.addEventListener('click', () => {
    updateIpBadge(null, null, true)
    chrome.runtime.sendMessage({ action: 'refreshIp' }, (res) => {
      if (res && res.ip) {
        setInputs(res.timezone, res.locale, res.lat, res.lon)
        updateIpBadge(res.ip, res.country, false)
      } else {
        updateIpBadge(null, null, false)
      }
    })
  })
}

loadFromStorage()
