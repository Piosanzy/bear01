$(document).ready(function () {
    const fineDustDiv = $("#fineDust");
    const station = $("#stationName");
    const pm10 = $("#pm10");
    const pm25 = $("#pm25");
    const emotion = $("#emotion");
    const covid = $("#covid");
    $.get("/api/boardPage", function (data) {
        let symbols = '';
        let upDown = parseInt(data.covidApiSeparationData.todayDecideCnt) - parseInt(data.covidApiSeparationData.yesterdayDecideCnt);
        if (upDown > 0) {
            symbols = "&#8679;";
        } else if (upDown <= 0) {
            upDown = upDown * -1;
            symbols = "&#8681;";
        }

        const khaiGrade = data.fineDustApiSeparationData.khaiGrade
        station.text(data.fineDustApiSeparationData.stationName);
        pm10.html("미세먼지 : " + data.fineDustApiSeparationData.pm10Value + "&#181;");
        pm25.html("초미세먼지 : " + data.fineDustApiSeparationData.pm25Value + "&#181;");
        covid.html("확진자 수 : " + data.covidApiSeparationData.todayDecideCnt + "명 " + symbols + upDown);
        if (khaiGrade == 1) {
            fineDustDiv.addClass("bg-success");
            emotion.addClass("ion-happy");
        } else if (khaiGrade == 2) {
            fineDustDiv.addClass("bg-info");
            emotion.addClass("ion-happy");
        } else if (khaiGrade == 3) {
            fineDustDiv.addClass("bg-warning");
            emotion.addClass("ion-sad");
        } else if (khaiGrade == 4) {
            fineDustDiv.addClass("bg-danger");
            emotion.addClass("ion-sad");
        } else {
            fineDustDiv.addClass("bg-secondary");
            emotion.addClass("ion-alert");
        }
    });
})
