import { setStoredOptions, getStoredCitites, getStoredOptions, setStoredCities } from "../utils/storage";
import  { fetchOpenWeatherData } from "../utils/api";

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([])
  setStoredOptions({
    hasAutoOverlay: false,
    homeCity: "",  
    tempScale: "metric"
    })

    chrome.contextMenus.create({
      contexts: ["selection"],
      title: "Add %s to weather extension",
      id: 'weatherExtension',
    })

    chrome.alarms.create({
      periodInMinutes: 60,
    })
})

chrome.contextMenus.onClicked.addListener((event) => {
  getStoredCitites().then((cities) => {
    setStoredCities([...cities, event.selectionText])
  })
})

chrome.alarms.onAlarm.addListener(() => {
    getStoredOptions().then((options) => {
    if (options.homeCity === '') {
      return
    }
    fetchOpenWeatherData(options.homeCity, options.tempScale).then((data) => {
      chrome.action.setBadgeText({
        text: `${Math.round(data.main.temp)}`
      })
    })
  })
})