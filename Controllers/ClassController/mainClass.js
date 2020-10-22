
const apiData = require('../ApiController/mainApi');

const className = () =>{
    const fineDustSeverityCheck = async () =>{
        const apiCall = await apiData.apiCall('경기');
        const fineDustRatingData = apiCall.fineDustApiSeparationData.fineDustRatingData;
        let divClassName = '';
        if(fineDustRatingData === '좋음'){
            divClassName = 'bg-success';
        }else if(fineDustRatingData === '보통'){
            divClassName = 'bg-info';
        }else if(fineDustRatingData === '나쁨'){
            divClassName = 'bg-warning';
        }else if(fineDustRatingData === '매우 나쁨'){
            divClassName = 'bg-danger';
        }
        return divClassName;
    }
    const setClassNameCall = async () =>{
        try{
            const smallBox = await fineDustSeverityCheck();
            const returnData = {
                smallBox : smallBox,
            }
            return returnData;
        }catch (e) {
            console.error(e);
        }

    }
    return {
        setClassNameCall : setClassNameCall,
    }
}

module.exports = className();