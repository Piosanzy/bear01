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
        let DecideCntUpDown = parseInt(data.covidApiSeparationData[0].DecideCnt) - parseInt(data.covidApiSeparationData[1].DecideCnt);
        let ClearCntUpDown = data.covidApiSeparationData[0].ClearCnt - data.covidApiSeparationData[1].ClearCnt
        let DeathCntUpDown = data.covidApiSeparationData[0].DeathCnt - data.covidApiSeparationData[1].DeathCnt
        if (DecideCntUpDown > 0) {
            symbols = "&#8679;";
        } else if (DecideCntUpDown <= 0) {
            DecideCntUpDown = DecideCntUpDown * -1;
            symbols = "&#8681;";
        }
        if (ClearCntUpDown > 0) {
            symbols = "&#8679;";
        } else if (ClearCntUpDown <= 0) {
            ClearCntUpDown = ClearCntUpDown * -1;
            symbols = "&#8681;";
        }
        if (DeathCntUpDown > 0) {
            symbols = "&#8679;";
        } else if (DeathCntUpDown <= 0) {
            ClearCntUpDown = ClearCntUpDown * -1;
            symbols = "&#8681;";
        }
        const fineDustRatingData = data.fineDustApiSeparationData.fineDustRatingData
        $station.text(data.fineDustApiSeparationData.stationName);
        $pm10.html("미세먼지 : " + data.fineDustApiSeparationData.pm10Value + "&#181;");
        $pm25.html("초미세먼지 : " + data.fineDustApiSeparationData.pm25Value + "&#181;");
        $covid.html("확진자 수 : " + data.covidApiSeparationData[0].DecideCnt + "명 " + symbols + DecideCntUpDown+"<br><br>");
        $covid.append(`격리 해제 수 : ${data.covidApiSeparationData[0].ClearCnt} 명 ${symbols + ClearCntUpDown}<br><br>`)
        $covid.append(`사망자 수 : ${data.covidApiSeparationData[0].DeathCnt} 명 ${symbols + DeathCntUpDown}`)
        if (fineDustRatingData == 1) {
            $fineDustDiv.addClass("bg-success");
            $emotion.addClass("far fa-grin-beam");
        } else if (fineDustRatingData == 2) {
            $fineDustDiv.addClass("bg-info");
            $emotion.addClass("far fa-grin");
        } else if (fineDustRatingData == 3) {
            $fineDustDiv.addClass("bg-warning");
            $emotion.addClass("far fa-frown");
        } else if (fineDustRatingData == 4) {
            $fineDustDiv.addClass("bg-danger");
            $emotion.addClass("far fa-angry");
        } else {
            $fineDustDiv.addClass("bg-secondary");
            $emotion.addClass("fas fa-exclamation-circle");
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
