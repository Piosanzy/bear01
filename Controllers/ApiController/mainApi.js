var axios = require('axios');
var urlencode = require('urlencode');
var parseString = require('xml2js');
var request = require('request');


const api = () => {

    const covid = async () => {
        const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D&pageNo=1&numOfRows=10&startCreateDt=20201021&endCreateDt=20201022&';
        let covidData;
        await axios.get(url)
            .then(function (response) {
                covidData = response.data.response.body.items;
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            })
            .then(function () {
                // always executed
            });
        return covidData;
    }

    const covidApiSeparation = async (covidApi) => {
        const data = {
            todayAccExamCnt: covidApi.item[0].accExamCnt,
            todayAccExamCompCnt: covidApi.item[0].accExamCompCnt,
            todayCareCnt: covidApi.item[0].careCnt,
            todayClearCnt: covidApi.item[0].clearCnt,
            todayCreateDt: covidApi.item[0].createDt,
            todayDeathCnt: covidApi.item[0].deathCnt,
            todayDecideCnt: covidApi.item[0].decideCnt,
            todayExamCnt: covidApi.item[0].examCnt,
            todayResutlNegCnt: covidApi.item[0].resutlNegCnt,
            yesterdayAccExamCnt: covidApi.item[1].accExamCnt,
            yesterdayAccExamCompCnt: covidApi.item[1].accExamCompCnt,
            yesterdayCareCnt: covidApi.item[1].careCnt,
            yesterdayClearCnt: covidApi.item[1].clearCnt,
            yesterdayCreateDt: covidApi.item[1].createDt,
            yesterdayDeathCnt: covidApi.item[1].deathCnt,
            yesterdayDecideCnt: covidApi.item[1].decideCnt,
            yesterdayExamCnt: covidApi.item[1].examCnt,
            yesterdayResutlNegCnt: covidApi.item[1].resutlNegCnt,
        }
        return data;
    }

    const fineDust = async (cityName) => {

        if (cityName == null || cityName == '') {
            cityName = '서울';
        }
        const name = urlencode(cityName);
        const url = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D&numOfRows=116&pageNo=1&sidoName=${name}&ver=1.3&_returnType=json`;
        let fineDustData;
        await axios.get(url)
            .then(function (response) {
                fineDustData = response.data.list;
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            })
            .then(function () {
                // always executed
            });
        return fineDustData;
    }
    const fineDustRating = async (pm10Value) => {
        if (pm10Value <= 30) {
            return 'PM1';
        } else if (pm10Value <= 80) {
            return 'PM2';
        } else if (pm10Value <= 150) {
            return 'PM3';
        } else if (pm10Value < 0) {
            return 'PM4';
        } else {
            return 'PM5';
        }
    }
    const fineDustApiSeparation = async (fineDustApi) => {
        console.log('fineDustApi');
        const fineDustRatingData = await fineDustRating(fineDustApi.pm10Value);
        const data = {
            stationName: fineDustApi.stationName,
            pm10Value: fineDustApi.pm10Value,
            fineDustRatingData: fineDustRatingData,
            dataTime: fineDustApi.dataTime,
            pm25Value: fineDustApi.pm25Value,
            khaiGrade: fineDustApi.khaiGrade,
        }
        return data;
    }
    const findStationName = async (fineDustApi, name) => {
        const findStationNameCount = fineDustApi.length;
        for (let i = 0; i < findStationNameCount; i++) {
            if (fineDustApi[i].stationName === name) {
                return i;
            }
        }
        return 0;
    }
    const apiCall = async (cityName) => {
        try {
            const covidApi = await covid();
            console.log(covidApi);
            const covidApiSeparationData = await covidApiSeparation(covidApi);
            console.log(covidApiSeparationData)
            const fineDustApi = await fineDust(cityName);
            const i = await findStationName(fineDustApi,'단대동');
            const fineDustApiSeparationData = await fineDustApiSeparation(fineDustApi[i]);
            console.log('fineDustApiSeparation', fineDustApiSeparationData);
            const returnData = {
                fineDustApiSeparationData: fineDustApiSeparationData,
                covidApiSeparationData: covidApiSeparationData,
            }
            return returnData;
        } catch (error) {
            console.error(error);
        }
    }
    return {
        apiCall: apiCall,
    }
}

module.exports = api();