// 지도를 표시할 div
var mapContainer = document.getElementById('map'), 
    mapOption = { 
        center: new kakao.maps.LatLng(37.575377, 126.928582), // 지도 중심 (연희동)
        draggable: false, // 드래그 방지
        level: 1 // 초기 줌 레벨
    }; 

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 마우스 휠 확대/축소 가능 설정
map.setZoomable(true);

// 지도 확대, 축소 컨트롤에서 버튼을 누르면 호출되어 지도를 확대, 축소하는 함수
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

// 지도 중심 좌표 저장
var centerPosition = map.getCenter();

// 마우스 휠 이벤트로 레벨 제한 적용
kakao.maps.event.addListener(map, 'wheel', function(e) {
    var level = map.getLevel();
    if (level <= 4 && e.deltaY > 0) { // 줌 아웃(축소) 시도 시, 레벨 3 이상에서는 막기
        e.preventDefault(); // 기본 축소 동작 방지
    }
});
// 줌 변경 시 중심 좌표 유지 및 최대 줌 제한
kakao.maps.event.addListener(map, 'zoom_changed', function() {
    var level = map.getLevel();
    if (level > 4) {
        map.setLevel(4); // 최대 레벨 3으로 설정
    }
    map.setCenter(centerPosition); // 원래 중심 유지
});

// GPS 표시
document.getElementById('locationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // 현재 위치로 지도의 중심 변경
            var locPosition = new kakao.maps.LatLng(lat, lon);
            map.setCenter(locPosition);

            // 마커 추가
            var marker = new kakao.maps.Marker({
                position: locPosition
            });
            marker.setMap(map);
        });
    };
});

//마우스 오버 시 gps 버튼의 이미지 변경
        function changeImage() {
            document.getElementById('locationButton').style.background = "url('./gps(on).svg') no-repeat center center"; // 변경된 이미지
        }

// 마우스 아웃 시 gps 버튼을 원래 이미지로 복원
        function resetImage() {
            document.getElementById('locationButton').style.background = "url('./gps(off).svg') no-repeat center center"; // 원래 이미지
        }

// 그래프 패널에서 i 아이콘을 누르면 3초 동안 뜨는 검은 바탕 오버레이
const info_svg = document.getElementById("info_svg");
const overlay = document.getElementById("overlay");

info_svg.addEventListener("click", () => {
    overlay.classList.add("show");
    setTimeout(() => {
        overlay.classList.remove("show");
    }, 1600);
});

//매물 패널에서 스크롤을 내리면 페이지 화살표가 나타나도록 표시
document.addEventListener("DOMContentLoaded", function () {
    const pagination = document.querySelector(".mamul_pagination");
    const listings = document.querySelectorAll(".mamul_listing");

    if (listings.length >= 15) {
        const target = listings[14]; // 15번째 매물 (배열은 0부터 시작)

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    pagination.classList.remove("hidden");
                } else {
                    pagination.classList.add("hidden");
                }
            },
            { root: document.querySelector(".mamul_container"), threshold: 0.5 }
        );

        observer.observe(target);
    }
});

//체크리스트 버튼을 누르면 팝업창이 나타나도록
document.getElementById("checklist_button").addEventListener("click", function() {
    // 팝업창과 배경 회색을 표시
    document.getElementById("popup").style.display = "block";
    document.getElementById("checklist_overlay").style.display = "block";
});

document.getElementById("close_popup_button").addEventListener("click", function() {
    // 팝업창과 배경 회색을 숨김
    document.getElementById("popup").style.display = "none";
    document.getElementById("checklist_overlay").style.display = "none";
});

//마커 표시하기
// 마커 이미지 경로
var markerImageSrc = './house_marker.png';

// 마커 위치
var markerPosition = new kakao.maps.LatLng(37.575477, 126.929582);

// 지도 줌 레벨에 따른 마커 크기 조정 함수
function getMarkerSize() {
    var zoomLevel = map.getLevel();
    var baseSize = 112; // 기본 크기
    var minSize = 28; // 최소 크기
    var scaleFactor = 6; // 변화량 증가

    var markerWidth = Math.max(minSize, baseSize - zoomLevel * scaleFactor);
    var markerHeight = Math.max(minSize * 1.3, (baseSize * 1.3) - zoomLevel * scaleFactor * 1.2);

    return new kakao.maps.Size(markerWidth, markerHeight);
}

// 마커 업데이트 함수
function updateMarker() {
    var markerSize = getMarkerSize();
    var markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerSize);
    marker.setImage(markerImage);
}

// 마커 생성
var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: new kakao.maps.MarkerImage(markerImageSrc, getMarkerSize())
});

// 오버레이 내용
var overlayContent = `
    <div style="color: white; text-align: center;">
        <img src='./villa_moji.png' id='overlayIcon' style='width:40px; height:40px;'><br>
        다세대 빌라<br>
        3천/60
    </div>
`;

// 오버레이 생성
var overlays = new kakao.maps.CustomOverlay({
    position: markerPosition,
    content: overlayContent,
    yAnchor: 1.4,
    zIndex: 100
});

// 그림자 업데이트 함수
function updateShadowSize() {
    var zoomLevel = map.getLevel();
    var shadowBase = 87;
    var minShadow = 20;
    var blurBase = 8;

    var shadowWidth = Math.max(minShadow, shadowBase - zoomLevel * 8);
    var shadowHeight = Math.max(10, shadowWidth / 2);
    var blurValue = Math.max(2, blurBase - zoomLevel * 0.8);

    shadowOverlay.setContent(`
        <div style="width: ${shadowWidth}px;
        height: ${shadowHeight}px; 
        background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0.3) 100%);
        border-radius: 50%; 
        position: relative; 
        top: -10px; 
        left: 0px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); 
        filter: blur(${blurValue}px);">
        </div>
    `);
}

// 그림자 오버레이 생성
var shadowOverlay = new kakao.maps.CustomOverlay({
    position: markerPosition,
    content: "",
    yAnchor: 0.3
});

// 줌 변경 이벤트 리스너
kakao.maps.event.addListener(map, 'zoom_changed', function(){
    updateMarker(); // 마커 크기 업데이트
    updateShadowSize(); // 그림자 크기 업데이트

    overlays.setMap(null); // 기존 오버레이 제거

    var zoomLevel = map.getLevel();
    var minSize = 12; // 최소 아이콘 크기
    var baseIconSize = 40; // 기본 아이콘 크기
    var baseFontSize = 14; // 기본 폰트 크기

    // 아이콘과 텍스트 크기 조정
    var overlayIconSize = Math.max(minSize, baseIconSize - zoomLevel * 2);
    var overlayFontSize = Math.max(10, baseFontSize - zoomLevel * 0.8); // 폰트 크기 최소 10px 유지

    var overlayContent = `
        <div style="color: white; text-align: center; font-size: ${overlayFontSize}px;">
            <img src='./villa_moji.png' style='width:${overlayIconSize}px; height:${overlayIconSize}px;'><br>
            다세대 빌라<br>
            3천/60
        </div>
    `;

    overlays.setContent(overlayContent);
    overlays.setMap(map);
});

// 마커, 그림자, 오버레이 지도에 추가
marker.setMap(map);
shadowOverlay.setMap(map);
overlays.setMap(map);
updateShadowSize(); // 초기 그림자 크기 조정

Chart.register('chartjs-plugin-annotation');
// 데이터 설정
const data = {
    labels: ['2023.01', '2023.03', '2023.05', '2023.07', '2023.09', '2023.11', '2024.01', '2024.03', '2024.05', '2024.07', '2024.09', '2024.11', '2025.01', '2025.02'], // 가로축 월
    datasets: [{
        label: '거래량',
        data: [1230, 1550, 1600, 1700, 1400, 1500, 1600, 1300, 1600, 1500, 1200, 1500, 1400, 1500], // 세로축 가격,
        borderColor: '#125FF9',  // ✅ 선 색깔 변경 (보라색)
        borderWidth: 1,  // ✅ 선 두께 줄이기
        pointRadius: 2,  // ✅ 포인트 크기 줄이기
        pointBorderColor: '#125FF9',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: function(context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            const max = Math.max(...context.dataset.data);
            const min = Math.min(...context.dataset.data);
            if (value === max) {
                return 'white'; // 최고점
            } else if (value === min) {
                return 'white'; // 최저점
            }
            return 'white';
        },
    }]
};

// 그래프 설정
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            },
            annotation: {  // ✅ 가로선 추가
                annotations: {
                    avgLine: {
                        type: 'line',
                        yMin: 1400,  // ✅ 평균가 1400
                        yMax: 1400,
                        borderColor: '#191919',  
                        borderWidth: 1,
                        borderDash: [5, 5],  // ✅ 점선 스타일
                        label: {  // 텍스트 추가
                            display: true,
                            enabled: true,
                            content: '평균가',
                            position: 'start',
                            font: {
                                size: 10,
                                weight: 'normal'
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: '#191919',
                            yAdjust: 10  
                        }
                    },
                    currentLine: {
                        type: 'line',
                        yMin: 1550,  // ✅ 현재가 1550
                        yMax: 1550,
                        borderColor: '#E72004',  
                        borderWidth: 2,  // ✅ 실선 스타일 (두께 증가)
                        label: {  // 텍스트 추가
                            enabled: true,
                            display: true,
                            content: '현재가',
                            position: 'start',
                            font: {
                                size: 10,
                                weight: 'normal'
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: '#E72004',
                            yAdjust: -10
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: false
                },
                grid: {
                    display: false
                },
                ticks: {
                    callback: function(value, index, ticks) {
                        const labelsToShow = ['2023.01', '2024.01', '2025.01'];
                        return labelsToShow.includes(this.getLabelForValue(value)) ? this.getLabelForValue(value) : '';
                    },
                    rotation: 0,
                    maxRotation: 0, // 최대 회전 각도 (강제로 수평 유지)
                    minRotation: 0, // 최소 회전 각도 (강제로 수평 유지)
                    align: 'center'
                }
            },
            y: {
                display: true,
                title: {
                    display: false
                },
                min: 1000,
                max: 2000,
                ticks: {
                    stepSize: 250,
                    callback: function(value) {
                        const allowedValues = [1000, 1250, 1500, 1750, 2000];
                        return allowedValues.includes(value) ? value : '';
                    }
                }
            }
        }
    }
};


// 그래프 생성
const priceChart = new Chart(
    document.getElementById('pricechart'),
    config
);

//체크리스트 체크하는 것 
document.querySelectorAll(".checklist_checkbox").forEach(img => {
    img.addEventListener("click", function() {
        this.src = this.src.includes("off.svg") ? "./checklist_checkbox_on.svg" : "./checklist_checkbox_off.svg";
    });
});


document.getElementById('deunggi-button').addEventListener('click', function() {
    // 오버레이 표시
    document.getElementById('detail_overlay').style.display = 'block';

    // 팝업 표시
    document.getElementById('deunggi-popup').style.display = 'block';
});

document.getElementById('deunggi-popup-close-btn').addEventListener('click', function() {
    // 오버레이 숨기기
    document.getElementById('detail_overlay').style.display = 'none';

    // 팝업 숨기기
    document.getElementById('deunggi-popup').style.display = 'none';
});