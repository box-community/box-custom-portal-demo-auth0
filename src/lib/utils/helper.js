// src/pages/helper.js
export function getConfigValues(value) {
    try {
      const configData = sessionStorage.getItem("configData");
      if (!configData) return {};
      
      const json = JSON.parse(configData);
      return json[value] || {};
    } catch (error) {
      console.error('Error getting config values:', error);
      return {};
    }
  }