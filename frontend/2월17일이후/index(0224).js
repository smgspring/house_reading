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
// 마커 이미지의 경로
var markerImageSrc = './house_marker.png'; // 마커 이미지 경로
var markerImageSize = new kakao.maps.Size(112, 146); // 마커 이미지의 크기
var markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize);

// 마커를 생성합니다
var markerPosition = new kakao.maps.LatLng(37.575477, 126.929582); // 마커 위치
var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage // 마커 이미지 설정
});

var overlayContent = `
    <div style="color: white; text-align: center;">
        <img src='./villa_moji.png' style='width:36px; height:36px;'><br>
        다세대 빌라<br>
        3천/60
    </div>
`;
var overlayPosition = markerPosition;

var overlays = new kakao.maps.CustomOverlay({
    position: overlayPosition,
    content: overlayContent,
    yAnchor: 1.4, // 오버레이의 수직 위치 조정
    zindex: 100,
});

// 그림자 오버레이에 표시할 내용 설정
var shadowContent = `
    <div style="width: 87.111px;
height: 43.537px; background-color: rgba(0, 0, 0, 0.5);
fill: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.40) 10%, rgba(0, 0, 0, 0.05) 100%);border-radius: 50%; position: relative; top: -10px; left: 0px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); z-index: -3; filter: blur(4px);">
    </div>
`;

// 그림자 오버레이 생성
var shadowOverlay = new kakao.maps.CustomOverlay({
    position: markerPosition,
    content: shadowContent,
    yAnchor: 0.3, // 그림자를 마커 아래에 위치하도록 설정
    zindex: -1
});

// 마커를 지도에 표시합니다
marker.setMap(map);
shadowOverlay.setMap(map);
overlays.setMap(map); // 오버레이를 지도에 표시합니다


// 데이터 설정
const data = {
    labels: ['2023.01', '2024.01', '2024.02'], // 가로축 월
    datasets: [{
        label: '가격',
        data: [1000, 1500, 2000], // 세로축 가격
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: function(context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            const max = Math.max(...context.dataset.data);
            const min = Math.min(...context.dataset.data);
            if (value === max) {
                return 'red'; // 최고점
            } else if (value === min) {
                return 'blue'; // 최저점
            }
            return 'rgba(75, 192, 192, 1)';
        },
        pointRadius: 5,
        fill: true,
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
                display: true,
            },
            tooltip: {
                enabled: true,
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '월'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '거래량'
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



