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
    if (level <= 3 && e.deltaY > 0) { // 줌 아웃(축소) 시도 시, 레벨 3 이상에서는 막기
        e.preventDefault(); // 기본 축소 동작 방지
    }
});
// 줌 변경 시 중심 좌표 유지 및 최대 줌 제한
kakao.maps.event.addListener(map, 'zoom_changed', function() {
    var level = map.getLevel();
    if (level > 3) {
        map.setLevel(3); // 최대 레벨 3으로 설정
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