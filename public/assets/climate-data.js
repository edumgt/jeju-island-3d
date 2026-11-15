// Regional Yearly Climate Data (KMA 1991-2020 Climatological Normals + Coastal Sea Temps)
// Supports Jeju, Busan Haeundae, Incheon, and Gangneung-Seorak regions.
(() => {
  'use strict';

  const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const REGIONAL_CLIMATE = {
    jeju: {
      regionId: 'jeju',
      stationName: '제주 (기상청 184)',
      climateType: '온난 습윤 아열대성 해양 기후',
      bestSeason: '4–6월 · 10월',
      note: '겨울에도 평균 6°C 안팎으로 온화하며 6~9월 장마·태풍기 강수 집중 및 한라산 고도별 기온 편차가 큽니다.',
      monthly: [
        { month: 1, label: '1월', avgTempC: 6.1, minTempC: 3.6, maxTempC: 8.8, precipMm: 67.5, sunshineHrs: 72, humidityPct: 65, seaTempC: 14.2, windMs: 4.3 },
        { month: 2, label: '2월', avgTempC: 6.8, minTempC: 4.1, maxTempC: 9.8, precipMm: 56.8, sunshineHrs: 108, humidityPct: 65, seaTempC: 13.6, windMs: 4.1 },
        { month: 3, label: '3월', avgTempC: 9.8, minTempC: 6.6, maxTempC: 13.3, precipMm: 91.2, sunshineHrs: 162, humidityPct: 65, seaTempC: 14.0, windMs: 3.8 },
        { month: 4, label: '4월', avgTempC: 14.2, minTempC: 10.6, maxTempC: 18.0, precipMm: 89.6, sunshineHrs: 192, humidityPct: 67, seaTempC: 15.6, windMs: 3.4 },
        { month: 5, label: '5월', avgTempC: 18.2, minTempC: 14.8, maxTempC: 22.0, precipMm: 95.8, sunshineHrs: 208, humidityPct: 71, seaTempC: 18.1, windMs: 3.1 },
        { month: 6, label: '6월', avgTempC: 21.8, minTempC: 18.9, maxTempC: 25.1, precipMm: 186.2, sunshineHrs: 154, humidityPct: 78, seaTempC: 21.2, windMs: 2.9 },
        { month: 7, label: '7월', avgTempC: 26.2, minTempC: 23.6, maxTempC: 29.4, precipMm: 239.8, sunshineHrs: 186, humidityPct: 81, seaTempC: 24.8, windMs: 3.2 },
        { month: 8, label: '8월', avgTempC: 27.1, minTempC: 24.5, maxTempC: 30.3, precipMm: 262.5, sunshineHrs: 196, humidityPct: 79, seaTempC: 26.7, windMs: 3.4 },
        { month: 9, label: '9월', avgTempC: 23.2, minTempC: 20.5, maxTempC: 26.2, precipMm: 221.6, sunshineHrs: 156, humidityPct: 76, seaTempC: 24.9, windMs: 3.3 },
        { month: 10, label: '10월', avgTempC: 18.3, minTempC: 15.2, maxTempC: 21.6, precipMm: 80.3, sunshineHrs: 178, humidityPct: 68, seaTempC: 21.8, windMs: 3.3 },
        { month: 11, label: '11월', avgTempC: 13.0, minTempC: 9.9, maxTempC: 16.4, precipMm: 61.9, sunshineHrs: 126, humidityPct: 66, seaTempC: 18.5, windMs: 3.6 },
        { month: 12, label: '12월', avgTempC: 8.1, minTempC: 5.4, maxTempC: 11.1, precipMm: 49.1, sunshineHrs: 82, humidityPct: 65, seaTempC: 15.7, windMs: 4.1 }
      ]
    },
    haeundae: {
      regionId: 'haeundae',
      stationName: '부산·해운대 (기상청 159)',
      climateType: '온난 습윤 남동해안 해양성 기후',
      bestSeason: '4–5월 · 9–11월',
      note: '대한해협 난류의 영향으로 겨울 한파가 적고, 7월 장마철 집중호우와 가을철 쾌청한 해풍이 뚜렷합니다.',
      monthly: [
        { month: 1, label: '1월', avgTempC: 3.6, minTempC: -0.1, maxTempC: 8.1, precipMm: 34.4, sunshineHrs: 198, humidityPct: 48, seaTempC: 13.4, windMs: 3.4 },
        { month: 2, label: '2월', avgTempC: 5.4, minTempC: 1.5, maxTempC: 10.1, precipMm: 50.2, sunshineHrs: 184, humidityPct: 51, seaTempC: 12.9, windMs: 3.5 },
        { month: 3, label: '3월', avgTempC: 9.3, minTempC: 5.2, maxTempC: 14.0, precipMm: 85.9, sunshineHrs: 202, humidityPct: 57, seaTempC: 13.6, windMs: 3.5 },
        { month: 4, label: '4월', avgTempC: 13.9, minTempC: 9.9, maxTempC: 18.5, precipMm: 133.1, sunshineHrs: 205, humidityPct: 63, seaTempC: 15.1, windMs: 3.4 },
        { month: 5, label: '5월', avgTempC: 18.1, minTempC: 14.4, maxTempC: 22.5, precipMm: 143.7, sunshineHrs: 220, humidityPct: 69, seaTempC: 17.6, windMs: 3.2 },
        { month: 6, label: '6월', avgTempC: 21.3, minTempC: 18.2, maxTempC: 25.0, precipMm: 201.3, sunshineHrs: 168, humidityPct: 77, seaTempC: 20.5, windMs: 3.0 },
        { month: 7, label: '7월', avgTempC: 24.8, minTempC: 22.1, maxTempC: 28.2, precipMm: 330.7, sunshineHrs: 154, humidityPct: 84, seaTempC: 23.2, windMs: 3.3 },
        { month: 8, label: '8월', avgTempC: 26.5, minTempC: 23.7, maxTempC: 30.0, precipMm: 256.8, sunshineHrs: 188, humidityPct: 80, seaTempC: 25.4, windMs: 3.3 },
        { month: 9, label: '9월', avgTempC: 22.6, minTempC: 19.3, maxTempC: 26.4, precipMm: 173.4, sunshineHrs: 170, humidityPct: 74, seaTempC: 24.0, windMs: 3.2 },
        { month: 10, label: '10월', avgTempC: 17.6, minTempC: 13.7, maxTempC: 22.1, precipMm: 61.5, sunshineHrs: 208, humidityPct: 63, seaTempC: 21.1, windMs: 3.0 },
        { month: 11, label: '11월', avgTempC: 11.7, minTempC: 7.7, maxTempC: 16.4, precipMm: 46.2, sunshineHrs: 190, humidityPct: 57, seaTempC: 17.9, windMs: 3.1 },
        { month: 12, label: '12월', avgTempC: 5.6, minTempC: 1.8, maxTempC: 10.2, precipMm: 25.3, sunshineHrs: 198, humidityPct: 50, seaTempC: 15.0, windMs: 3.3 }
      ]
    },
    incheon: {
      regionId: 'incheon',
      stationName: '인천·영종 (기상청 112)',
      climateType: '냉대 동계건조 서해안 대륙·해양 혼합 기후',
      bestSeason: '4–6월 · 9–10월',
      note: '연교차가 약 27°C로 크며 봄·초여름 서해 해무(안개)와 7~8월 집중호우, 겨울철 북서계절풍이 특징입니다.',
      monthly: [
        { month: 1, label: '1월', avgTempC: -1.5, minTempC: -4.6, maxTempC: 2.1, precipMm: 15.8, sunshineHrs: 186, humidityPct: 61, seaTempC: 4.5, windMs: 3.3 },
        { month: 2, label: '2월', avgTempC: 0.9, minTempC: -2.4, maxTempC: 4.7, precipMm: 23.6, sunshineHrs: 184, humidityPct: 60, seaTempC: 4.1, windMs: 3.4 },
        { month: 3, label: '3월', avgTempC: 5.9, minTempC: 2.5, maxTempC: 9.8, precipMm: 31.8, sunshineHrs: 214, humidityPct: 63, seaTempC: 6.2, windMs: 3.5 },
        { month: 4, label: '4월', avgTempC: 11.8, minTempC: 8.2, maxTempC: 16.1, precipMm: 61.4, sunshineHrs: 220, humidityPct: 65, seaTempC: 10.1, windMs: 3.4 },
        { month: 5, label: '5월', avgTempC: 17.1, minTempC: 13.5, maxTempC: 21.4, precipMm: 86.2, sunshineHrs: 235, humidityPct: 70, seaTempC: 14.8, windMs: 3.1 },
        { month: 6, label: '6월', avgTempC: 21.6, minTempC: 18.2, maxTempC: 25.6, precipMm: 108.4, sunshineHrs: 204, humidityPct: 76, seaTempC: 19.6, windMs: 2.9 },
        { month: 7, label: '7월', avgTempC: 24.8, minTempC: 22.1, maxTempC: 28.0, precipMm: 312.5, sunshineHrs: 152, humidityPct: 83, seaTempC: 23.4, windMs: 2.8 },
        { month: 8, label: '8월', avgTempC: 25.9, minTempC: 23.2, maxTempC: 29.2, precipMm: 263.8, sunshineHrs: 184, humidityPct: 79, seaTempC: 25.2, windMs: 2.7 },
        { month: 9, label: '9월', avgTempC: 21.7, minTempC: 18.4, maxTempC: 25.5, precipMm: 129.6, sunshineHrs: 198, humidityPct: 72, seaTempC: 22.8, windMs: 2.6 },
        { month: 10, label: '10월', avgTempC: 15.3, minTempC: 11.8, maxTempC: 19.3, precipMm: 46.8, sunshineHrs: 216, humidityPct: 66, seaTempC: 18.1, windMs: 2.8 },
        { month: 11, label: '11월', avgTempC: 8.1, minTempC: 4.8, maxTempC: 11.7, precipMm: 44.5, sunshineHrs: 170, humidityPct: 64, seaTempC: 12.6, windMs: 3.1 },
        { month: 12, label: '12월', avgTempC: 1.1, minTempC: -2.0, maxTempC: 4.5, precipMm: 21.0, sunshineHrs: 174, humidityPct: 62, seaTempC: 7.4, windMs: 3.3 }
      ]
    },
    gangneung: {
      regionId: 'gangneung',
      stationName: '강릉·설악 동해안 (기상청 105)',
      climateType: '태백산맥 동사면 해양성·산악 대비 기후',
      bestSeason: '5–6월 · 9–10월',
      note: '동해안 경포대는 겨울에도 1°C 내외로 온화하지만, 서쪽 설악산 대청봉(1,708m)은 고도 체감 -10°C 이상 낮고 8~9월 지형성 호우·겨울 폭설이 뚜렷합니다.',
      monthly: [
        { month: 1, label: '1월', avgTempC: 0.9, minTempC: -2.7, maxTempC: 5.2, precipMm: 46.1, sunshineHrs: 196, humidityPct: 48, seaTempC: 10.6, windMs: 3.2 },
        { month: 2, label: '2월', avgTempC: 2.6, minTempC: -1.1, maxTempC: 7.0, precipMm: 48.2, sunshineHrs: 188, humidityPct: 50, seaTempC: 9.8, windMs: 3.1 },
        { month: 3, label: '3월', avgTempC: 7.1, minTempC: 2.9, maxTempC: 11.7, precipMm: 61.9, sunshineHrs: 206, humidityPct: 54, seaTempC: 10.4, windMs: 3.0 },
        { month: 4, label: '4월', avgTempC: 13.0, minTempC: 8.3, maxTempC: 18.0, precipMm: 76.4, sunshineHrs: 216, humidityPct: 55, seaTempC: 12.6, windMs: 2.9 },
        { month: 5, label: '5월', avgTempC: 17.9, minTempC: 13.3, maxTempC: 22.8, precipMm: 79.3, sunshineHrs: 226, humidityPct: 61, seaTempC: 16.0, windMs: 2.6 },
        { month: 6, label: '6월', avgTempC: 21.2, minTempC: 17.3, maxTempC: 25.3, precipMm: 128.4, sunshineHrs: 178, humidityPct: 71, seaTempC: 19.8, windMs: 2.3 },
        { month: 7, label: '7월', avgTempC: 24.6, minTempC: 21.4, maxTempC: 28.4, precipMm: 248.2, sunshineHrs: 148, humidityPct: 78, seaTempC: 22.8, windMs: 2.2 },
        { month: 8, label: '8월', avgTempC: 25.1, minTempC: 21.9, maxTempC: 28.8, precipMm: 286.4, sunshineHrs: 162, humidityPct: 80, seaTempC: 24.6, windMs: 2.2 },
        { month: 9, label: '9월', avgTempC: 20.4, minTempC: 16.9, maxTempC: 24.4, precipMm: 222.5, sunshineHrs: 166, humidityPct: 75, seaTempC: 22.2, windMs: 2.3 },
        { month: 10, label: '10월', avgTempC: 15.2, minTempC: 11.1, maxTempC: 19.9, precipMm: 95.8, sunshineHrs: 198, humidityPct: 62, seaTempC: 18.6, windMs: 2.5 },
        { month: 11, label: '11월', avgTempC: 9.2, minTempC: 5.2, maxTempC: 13.8, precipMm: 69.2, sunshineHrs: 182, humidityPct: 54, seaTempC: 15.2, windMs: 2.9 },
        { month: 12, label: '12월', avgTempC: 3.1, minTempC: -0.6, maxTempC: 7.4, precipMm: 36.8, sunshineHrs: 194, humidityPct: 48, seaTempC: 12.2, windMs: 3.2 }
      ]
    },
    yeongam: {
      regionId: 'yeongam',
      stationName: '영암·목포 서남해안 (기상청 165)',
      climateType: '온난 서남해안 해양성·평야 기후',
      bestSeason: '4–5월 · 9–10월 (레이스 시즌)',
      note: '영암호·서해안의 온화한 해양성 기후로 봄·가을철 강수가 적고 일조가 풍부해 모터스포츠 주행과 야외 관람에 최적입니다.',
      monthly: [
        { month: 1, label: '1월', avgTempC: 1.7, minTempC: -1.6, maxTempC: 5.8, precipMm: 31.6, sunshineHrs: 154, humidityPct: 67, seaTempC: 6.8, windMs: 4.1 },
        { month: 2, label: '2월', avgTempC: 3.1, minTempC: -0.6, maxTempC: 7.6, precipMm: 39.2, sunshineHrs: 162, humidityPct: 66, seaTempC: 6.4, windMs: 4.0 },
        { month: 3, label: '3월', avgTempC: 7.3, minTempC: 3.2, maxTempC: 12.2, precipMm: 57.5, sunshineHrs: 198, humidityPct: 66, seaTempC: 8.6, windMs: 3.7 },
        { month: 4, label: '4월', avgTempC: 12.9, minTempC: 8.5, maxTempC: 18.0, precipMm: 78.4, sunshineHrs: 212, humidityPct: 67, seaTempC: 12.2, windMs: 3.4 },
        { month: 5, label: '5월', avgTempC: 17.9, minTempC: 13.7, maxTempC: 22.9, precipMm: 93.2, sunshineHrs: 224, humidityPct: 71, seaTempC: 16.4, windMs: 3.0 },
        { month: 6, label: '6월', avgTempC: 21.8, minTempC: 18.3, maxTempC: 26.2, precipMm: 149.8, sunshineHrs: 174, humidityPct: 78, seaTempC: 20.4, windMs: 2.8 },
        { month: 7, label: '7월', avgTempC: 25.4, minTempC: 22.5, maxTempC: 29.2, precipMm: 236.5, sunshineHrs: 164, humidityPct: 84, seaTempC: 23.8, windMs: 3.1 },
        { month: 8, label: '8월', avgTempC: 26.5, minTempC: 23.4, maxTempC: 30.5, precipMm: 214.2, sunshineHrs: 198, humidityPct: 81, seaTempC: 25.8, windMs: 3.1 },
        { month: 9, label: '9월', avgTempC: 22.2, minTempC: 18.6, maxTempC: 26.7, precipMm: 148.6, sunshineHrs: 188, humidityPct: 76, seaTempC: 23.2, windMs: 2.9 },
        { month: 10, label: '10월', avgTempC: 16.4, minTempC: 12.2, maxTempC: 21.4, precipMm: 52.4, sunshineHrs: 214, humidityPct: 69, seaTempC: 19.4, windMs: 3.1 },
        { month: 11, label: '11월', avgTempC: 10.2, minTempC: 6.1, maxTempC: 14.9, precipMm: 46.8, sunshineHrs: 168, humidityPct: 68, seaTempC: 14.6, windMs: 3.5 },
        { month: 12, label: '12월', avgTempC: 4.1, minTempC: 0.6, maxTempC: 8.3, precipMm: 31.2, sunshineHrs: 152, humidityPct: 68, seaTempC: 9.8, windMs: 4.0 }
      ]
    }
  };

  function getClimateProfile(regionId) {
    return REGIONAL_CLIMATE[regionId] || REGIONAL_CLIMATE.jeju;
  }

  function computeClimateSummary(profileOrRegion) {
    const profile = typeof profileOrRegion === 'string' ? getClimateProfile(profileOrRegion) : profileOrRegion;
    const rows = profile && Array.isArray(profile.monthly) ? profile.monthly : [];
    if (!rows.length) {
      return {
        annualMeanTempC: 0,
        annualPrecipMm: 0,
        annualSunshineHrs: 0,
        avgHumidityPct: 0,
        tempRangeC: 0,
        hottestMonth: null,
        coldestMonth: null,
        wettestMonth: null,
        sunniestMonth: null
      };
    }

    let tempSum = 0;
    let precipSum = 0;
    let sunshineSum = 0;
    let humiditySum = 0;
    let hottest = rows[0];
    let coldest = rows[0];
    let wettest = rows[0];
    let sunniest = rows[0];

    for (let i = 0; i < rows.length; i++) {
      const m = rows[i];
      tempSum += m.avgTempC;
      precipSum += m.precipMm;
      sunshineSum += m.sunshineHrs;
      humiditySum += m.humidityPct;
      if (m.avgTempC > hottest.avgTempC) hottest = m;
      if (m.avgTempC < coldest.avgTempC) coldest = m;
      if (m.precipMm > wettest.precipMm) wettest = m;
      if (m.sunshineHrs > sunniest.sunshineHrs) sunniest = m;
    }

    return {
      annualMeanTempC: Number((tempSum / rows.length).toFixed(1)),
      annualPrecipMm: Math.round(precipSum),
      annualSunshineHrs: Math.round(sunshineSum),
      avgHumidityPct: Math.round(humiditySum / rows.length),
      tempRangeC: Number((hottest.avgTempC - coldest.avgTempC).toFixed(1)),
      hottestMonth: hottest,
      coldestMonth: coldest,
      wettestMonth: wettest,
      sunniestMonth: sunniest
    };
  }

  const api = {
    MONTHS_KO,
    REGIONAL_CLIMATE,
    getClimateProfile,
    computeClimateSummary
  };

  if (typeof window !== 'undefined') window.ClimateData = api;
  if (typeof globalThis !== 'undefined') globalThis.ClimateData = api;
})();
