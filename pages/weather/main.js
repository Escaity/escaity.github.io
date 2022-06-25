import { getWeatherCode, dayOfWeekStr } from './constant.js';
const KEY = 'location';
const reverseKey = 'reverseGeo';
let hourSpan = 24;
let startHour = 14;
let htmlLocation = document.getElementById('location');
let dateTable = document.getElementById('dateInfo');
let weatherCodeTable = document.getElementById('weatherCodeInfo');
let weatherTable = document.getElementById('weatherInfo');
let chartDate = [];
let charTemp = [];

// Geolocation API option
let option = {
  enableHighAccuracy: true,
  timeout: 8000,
  maximumAge: 0,
};
// Geolocation API エラーメッセージ
let errorMessage = {
  0: '原因不明のエラーが発生しました。',
  1: '位置情報の取得が許可されませんでした。',
  2: '電波状況などで位置情報が取得できませんでした。',
  3: '位置情報の取得中にタイムアウトエラーが発生しました。',
};

//chart.js用データ
const data = {
  labels: chartDate,
  datasets: [
    {
      label: '気温',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: charTemp,
    },
  ],
};

const config = {
  type: 'line',
  data: data,
  options: {
    // responsive: false,
    maintainAspectRatio: false,
  },
};

// 緯度経度格納オブジェクト
const geoInfo = {
  latitude: null,
  longitude: null,
};

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
    const dateInfo = `${now.getDate()}日(${dayOfWeekStr[now.getDay()]}) `;
    const tempInfo = `${json['hourly']['temperature_2m'][i]}`;
    const thDate = document.createElement('td');
    const tdWeather = document.createElement('td');
    const tdWeatherCode = document.createElement('td');
    const codeImage = document.createElement('img');
    chartDate.push(dateInfo);
    charTemp.push(+tempInfo);
    codeImage.src = getWeatherCode(weatherCode);
    thDate.textContent = dateInfo;
    tdWeatherCode.appendChild(codeImage);
    tdWeather.textContent = tempInfo + '℃ ';
    dateTable.appendChild(thDate);
    weatherCodeTable.appendChild(tdWeatherCode);
    weatherTable.appendChild(tdWeather);
  }
  new Chart(document.getElementById('myChart'), config);
}

//位置情報の取得加工表示
function displayLocationInfo(json) {
  const addr = json['address'];
  localStorage.setItem(reverseKey, `${addr.province}${addr.city}`);
  htmlLocation.textContent = `${addr.province}${addr.city}の週間天気予報`;
}

function loadStorage(KEY) {
  const loadData = localStorage.getItem(KEY);
  return JSON.parse(loadData);
}

// メイン処理
const Main = new Promise((resolve, reject) => {
  const locationObj = loadStorage(KEY);
  if (locationObj === null) {
    reject();
  } else {
    geoInfo.latitude = locationObj.latitude;
    geoInfo.longitude = locationObj.longitude;
    resolve(locationObj);
  }
})
  .then(() => {
    console.log('Storage loaded.');
  })
  .catch(() => {
    console.log('Storage empty.');
    return new Promise((resolve, reject) => {
      function success(position) {
        geoInfo.latitude = position.coords.latitude;
        geoInfo.longitude = position.coords.longitude;
        localStorage.setItem(KEY, JSON.stringify(geoInfo));

        //緯度経度取得後は現在位置の監視を終了する
        navigator.geolocation.clearWatch(id);
        resolve();
      }

      function fail(error) {
        reject(errorMessage[error.code]);
      }

      const id = navigator.geolocation.watchPosition(success, fail);
    })
      .then(() => {
        console.log('Geolocation allowed.');
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .finally(() => {
    //緯度経度が読み込めた場合のみ逆ジオコーディングする
    if (geoInfo.latitude !== null && geoInfo.longitude !== null) {
      if (localStorage.getItem(reverseKey) === null) {
        const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${geoInfo.latitude}&lon=${geoInfo.longitude}`;
        myFetch(reverseGeoUrl, 'geolocation');
      } else {
        //逆ジオコーディング読み込み
        htmlLocation.textContent =
          localStorage.getItem(reverseKey) + 'の週間天気予報';
        console.log('reverseKey loaded.');
      }
      getWeahterInfo(geoInfo);
    }
  });
