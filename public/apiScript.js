$(document).ready(function () {
    const $fineDustDiv = $("#fineDust");
    const $station = $("#stationName");
    const $pm10 = $("#pm10");
    const $pm25 = $("#pm25");
    const $emotion = $("#emotion");
    const $covid = $("#covid");
    const $week = $("#week > tbody:last");
    $.get("/api/boardPage", function (data) {
        let symbols = '';
        let upDown = parseInt(data.covidApiSeparationData[0].DecideCnt) - parseInt(data.covidApiSeparationData[1].DecideCnt);
        if (upDown > 0) {
            symbols = "&#8679;";
        } else if (upDown <= 0) {
            upDown = upDown * -1;
            symbols = "&#8681;";
        }
        const fineDustRatingData = data.fineDustApiSeparationData.fineDustRatingData
        $station.text(data.fineDustApiSeparationData.stationName);
        $pm10.html("미세먼지 : " + data.fineDustApiSeparationData.pm10Value + "&#181;");
        $pm25.html("초미세먼지 : " + data.fineDustApiSeparationData.pm25Value + "&#181;");
        $covid.html("확진자 수 : " + data.covidApiSeparationData[0].DecideCnt + "명 " + symbols + upDown);
        if (fineDustRatingData == 1) {
            $fineDustDiv.addClass("bg-success");
            $emotion.addClass("ion-happy");
        } else if (fineDustRatingData == 2) {
            $fineDustDiv.addClass("bg-info");
            $emotion.addClass("ion-happy");
        } else if (fineDustRatingData == 3) {
            $fineDustDiv.addClass("bg-warning");
            $emotion.addClass("ion-sad");
        } else if (fineDustRatingData == 4) {
            $fineDustDiv.addClass("bg-danger");
            $emotion.addClass("ion-sad");
        } else {
            $fineDustDiv.addClass("bg-secondary");
            $emotion.addClass("ion-alert");
        }
        for(let i = 0; i<data.dateData.Week.length;i++){
            try{
            let weekUpDown = parseInt(data.covidApiSeparationData[i].DecideCnt) - parseInt(data.covidApiSeparationData[i+1].DecideCnt);
            if (weekUpDown > 0) {
                symbols = "&#8679;";
            } else if (weekUpDown <= 0) {
                weekUpDown = weekUpDown * -1;
                symbols = "&#8681;";
            }
                $week.append(`<tr><td>${data.dateData.Week[i]}</td><td>${data.covidApiSeparationData[i].DecideCnt}</td><td>${weekUpDown+symbols}</td></tr>`);
            }catch (e) {
                console.log(e);
            }
        }
    });
})
