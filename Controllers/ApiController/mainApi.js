var axios = require('axios');
var urlencode = require('urlencode');

const api = () =>{
    const fineDust = async () =>{

        const numOfRows = '1000';
        const pageNo = '1';
        const name = urlencode('경기');
        const url = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=RzprTmSFRzohYExNGEPoo27CxYJ9OQHHOnxzOd8NZwaC0wSW23BUseq82dtc58ISw7yZmTgiLsQZwuOmvi1L3w%3D%3D&numOfRows=${numOfRows}&pageNo=${pageNo}&sidoName=${name}&ver=1.3&_returnType=json`;
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
            return '좋음';
        }else if(pm10Value <= 80){
            return '보통';
        }else if(pm10Value <=150){
            return '나쁨';
        }else if(pm10Value < 0) {
            return '잘못된 값';
        }else{
            return '매우 나쁨';
        }
    }
    const fineDustApiSeparation = async (fineDustApi) =>{
        console.log('fineDustApi');
        const fineDustRatingData =await fineDustRating(fineDustApi.pm10Value);
        const data = {
            stationName : fineDustApi.stationName,
            pm10Value : fineDustApi.pm10Value,
            fineDustRatingData : fineDustRatingData,
            dataTime : fineDustApi.dataTime,
            pm25Value : fineDustApi.pm25Value,
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
    const apiCall = async () =>{
        try {
            const fineDustApi = await fineDust();
            const i = await findStationName(fineDustApi,'금촌동');
            const fineDustApiSeparationData = await fineDustApiSeparation(fineDustApi[i]);
            console.log('fineDustApiSeparation',fineDustApiSeparationData);
            const returnData = {
                fineDustApiSeparationData : fineDustApiSeparationData,
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