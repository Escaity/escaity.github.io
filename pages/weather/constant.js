export let dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

// open-meteo weather code
export const getWeatherCode = (code) => {
  switch (code) {
    case 0:
      return './images/sunny.png';
    case 1:
    case 2:
    case 3:
      return './images/sunny_cloud.png';
    case 45:
    case 48:
      return './images/cloud.png';
    case 51:
    case 53:
    case 55:
      return './images/rain.png';
    case 56:
    case 57:
      return './images/cloudy_rain.png';
    case 61:
    case 63:
    case 65:
      return './images/heavy_rain.png';
    case 66:
    case 67:
      return './images/cloudy_rain.png';
    case 71:
    case 73:
    case 75:
      return './images/heavy_snow.png';
    case 77:
      return './images/snowy_cloud.png';
    case 80:
    case 81:
    case 82:
      return './images/heavy_rain.png';
    case 85:
    case 86:
      return './images/rain.png';
    case 95:
      return './images/lightning_cloud.png';
    case 96:
    case 99:
      return './images/lightning_cloud.png';
    default:
      return '';
  }
};
