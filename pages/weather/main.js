let count = 1;
let hourSpan = 24;
let startHour = 14;
let htmlLocation = document.getElementById('location');
let dateTable = document.getElementById('dateInfo');
let weatherTable = document.getElementById('weatherInfo');

let option = {
  enableHighAccuracy: true,
  timeout: 8000,
  maximumAge: 5000,
};

let dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

const getWeatherCode = (code) => {
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

let errorMessage = {
  0: '原因不明のエラーが発生しました。',
  1: '位置情報の取得が許可されませんでした。',
  2: '電波状況などで位置情報が取得できませんでした。',
  3: '位置情報の取得中にタイムアウトエラーが発生しました。',
};

//位置情報の取得
function getCurrentGeolocation() {
  function success(position) {
    let geoInfo = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    //緯度経度取得後は現在位置の監視を終了する
    navigator.geolocation.clearWatch(id);
    //リバースジオロケーションAPIのurl
    const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${geoInfo.latitude}&lon=${geoInfo.longitude}`;
    myFetch(reverseGeoUrl, 'geolocation');
    getWeahterInfo(geoInfo);
  }

  // 位置情報取得時のエラー処理
  function error(e) {
    alert(errorMessage[e.code]);
  }

  const id = navigator.geolocation.watchPosition(success, error, option);
}

function getWeahterInfo({ latitude, longitude }) {
  //お天気APIのurl
  const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=Asia%2FTokyo`;
  myFetch(weatherApiUrl, 'weather');
}

//非同期処理でAPIをGETし、jsonデータを返す
function myFetch(url, api) {
  fetch(url).then((response) => {
    if (!response) {
      console.error('error', response);
    } else {
      return response.json().then((json) => {
        if (api === 'weather') {
          displayWeatherInfo(json);
        } else {
          displayLocationInfo(json);
        }
      });
    }
  });
}

//お天気情報の取得加工表示
function displayWeatherInfo(json) {
  for (let i = startHour; i < json['hourly']['time'].length; i += hourSpan) {
    const weatherCode = json['hourly']['weathercode'][i];
    const dateString = json['hourly']['time'][i];
    const now = new Date(dateString);
    const dateInfo = `${now.getDate()}日 (${dayOfWeekStr[now.getDay()]})`;
    const tempInfo = `${json['hourly']['temperature_2m'][i]}℃ `;
    const thDate = document.createElement('td');
    const tdWeather = document.createElement('td');
    const codeImage = document.createElement('img');
    codeImage.src = getWeatherCode(weatherCode);
    thDate.textContent = dateInfo;
    tdWeather.textContent = tempInfo;
    dateTable.appendChild(thDate);
    weatherTable.appendChild(tdWeather);
    tdWeather.appendChild(codeImage);
  }
}

//位置情報の取得加工表示
function displayLocationInfo(json) {
  const addr = json['address'];
  htmlLocation.textContent = `${addr.province}${addr.city}の週間天気予報`;
}

//メイン処理
navigator.geolocationオブジェクトの存在確認;
if ('geolocation' in navigator) {
  /* geolocation が使用可能 */
  getCurrentGeolocation();
} else {
  /* geolocation が使用不可 */
  alert('位置情報サービスが利用できません。');
}
