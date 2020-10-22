var axios = require('axios');
var urlencode = require('urlencode');
var parseString = require('xml2js');
var request = require('request');


const api = () =>{

    const covid = async () =>{
        const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D';
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

    const covidApiSeparation = async (covidApi) =>{
        const data = {
            accExamCnt : covidApi.accExamCnt,
            accExamCompCnt : covidApi.accExamCompCnt,
            careCnt : covidApi.careCnt,
            clearCnt : covidApi.clearCnt,
            createDt : covidApi.createDt,
            deathCnt : covidApi.deathCnt,
            decideCnt : covidApi.decideCnt,
            examCnt : covidApi.examCnt,
            resutlNegCnt : covidApi.resutlNegCnt,
        }
        return data;
    }

    const fineDust = async (cityName) =>{
        
        if(cityName == null || cityName == ''){
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
    const fineDustRating = async (pm10Value) =>{
        if(pm10Value <= 30){
            return 'PM1';
        }else if(pm10Value <= 80){
            return 'PM2';
        }else if(pm10Value <=150){
            return 'PM3';
        }else if(pm10Value < 0) {
            return 'PM4';
        }else{
            return 'PM5';
        }
    }
    const fineDustApiSeparation = async (fineDustApi) =>{
        console.log('fineDustApi');
        const fineDustRatingData = await fineDustRating(fineDustApi.pm10Value);
        const data = {
            stationName : fineDustApi.stationName,
            pm10Value : fineDustApi.pm10Value,
            fineDustRatingData : fineDustRatingData,
            dataTime : fineDustApi.dataTime,
            pm25Value : fineDustApi.pm25Value,
            khaiGrade : fineDustApi.khaiGrade,
        }
        return data;
    }
    const findStationName = async (fineDustApi,name) =>{
        const findStationNameCount = fineDustApi.length;
        for(let i = 0; i < findStationNameCount; i++){
            if(fineDustApi[i].stationName === name){
                return i;
            }
        }
        return 0;
    }
    const apiCall = async (cityName) =>{
        try {
            const covidApi = await covid();
            const covidApiSeparationData = await covidApiSeparation(covidApi);
            const fineDustApi = await fineDust(cityName);
            const i = await findStationName(fineDustApi,'금촌동');
            const fineDustApiSeparationData = await fineDustApiSeparation(fineDustApi[i]);
            console.log('fineDustApiSeparation',fineDustApiSeparationData);
            const returnData = {
                fineDustApiSeparationData : fineDustApiSeparationData,
                covidApiSeparationData : covidApiSeparationData,
            }
            return returnData;
        }catch (error) {
            console.error(error);
        }
    }
    return{
        apiCall : apiCall,
    }
}

module.exports = api();