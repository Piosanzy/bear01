var axios = require('axios');
var urlencode = require('urlencode');
var moment = require('moment');

const api = () => {

    const calculationOfWeekDate = () =>{
        let data =[];
        for(let i =0; i< 7; i++){
            data.push(moment(new Date()).subtract(i, 'days').format("YYYY-MM-DD-dddd"));
        }
        console.log(data);
        return data;
    }

    const date = async () => {
        const week = await calculationOfWeekDate();
        const data = {
            today: moment(new Date()).format("YYYYMMDD"),
            yesterday: moment(new Date()).subtract(1, 'days').format("YYYYMMDD"),
            tomorrow: moment(new Date()).add(1, 'days').format("YYYYMMDD"),
            Week: week,
            aWeekAgo: moment(new Date()).subtract(1, 'weeks').format("YYYYMMDD"),
            aWeekLater: moment(new Date()).add(1, 'weeks').format("YYYYMMDD"),
            aYearsAgo: moment(new Date()).subtract(1, 'years').format("YYYYMMDD"),
            aYearsLater: moment(new Date()).add(1, 'years').format("YYYYMMDD"),
        }

        return data;
    }

    const covid = async (date) => {
        const url = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D&pageNo=1&numOfRows=10&startCreateDt=${date.aWeekAgo}&endCreateDt=${date.today}&`;
        const r = await axios.get(url)
        const covidData = r.data.response.body.items
        return covidData;
    }
    const covidApiSeparationOneDay = async (covidApi, i) => {
        const data = {
            AccExamCnt: covidApi.item[i].accExamCnt,
            AccExamCompCnt: covidApi.item[i].accExamCompCnt,
            CareCnt: covidApi.item[i].careCnt,
            ClearCnt: covidApi.item[i].clearCnt,
            CreateDt: covidApi.item[i].createDt,
            DeathCnt: covidApi.item[i].deathCnt,
            DecideCnt: covidApi.item[i].decideCnt,
            ExamCnt: covidApi.item[i].examCnt,
            ResutlNegCnt: covidApi.item[i].resutlNegCnt,
        }
        return data;
    }

    const covidApiSeparation = async (covidApi) => {

        let data = [];

        for (let i = 0; i < covidApi.item.length; i++) {
            data.push(await covidApiSeparationOneDay(covidApi, i));
        }
        return data;
    }

    const fineDust = async (cityName) => {

        if (cityName == null || cityName == '') {
            cityName = '서울';
        }
        const name = urlencode(cityName);
        const url = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D&numOfRows=116&pageNo=1&sidoName=${name}&ver=1.3&_returnType=json`;
        const r = await axios.get(url);
        const fineDustData = r.data.list;
        return fineDustData;
    }
    const fineDustRating = async (pm10Value) => {
        if (pm10Value <= 30) {
            return '1';
        } else if (pm10Value <= 80) {
            return '2';
        } else if (pm10Value <= 150) {
            return '3';
        } else if (pm10Value > 150) {
            return '4';
        } else {
            return '5';
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
            const dateData = await date();
            const covidApi = await covid(dateData);
            const covidApiSeparationData = await covidApiSeparation(covidApi);
            const fineDustApi = await fineDust(cityName);
            const i = await findStationName(fineDustApi, '도봉구');
            const fineDustApiSeparationData = await fineDustApiSeparation(fineDustApi[i]);
            console.log('fineDustApiSeparation', fineDustApiSeparationData);
            const returnData = {
                dateData : dateData,
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