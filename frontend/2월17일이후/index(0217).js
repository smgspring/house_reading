// 지도를 표시할 div
var mapContainer = document.getElementById('map'), 
    mapOption = { 
        // 지도의 중심좌표 (연희동)
        center: new kakao.maps.LatLng(37.575377, 126.928582), 
        draggable: false,
        level: 1 // 지도의 확대 레벨
    }; 

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 버튼 클릭에 따라 지도 확대, 축소 기능을 막거나 풀고 싶은 경우에는 map.setZoomable 함수를 사용
function setZoomable() {
    // 마우스 휠로 지도 확대,축소 가능여부 설정
    map.setZoomable(true);    
}
setZoomable();


// 지도 확대, 축소 컨트롤에서 버튼을 누르면 호출되어 지도를 확대, 축소하는 함수
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

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

//마우스 오버 시 gps 이미지 변경
        function changeImage() {
            document.getElementById('locationButton').style.background = "url('./gps(on).svg') no-repeat center center"; // 변경된 이미지
        }

// 마우스 아웃 시 원래 이미지로 복원
        function resetImage() {
            document.getElementById('locationButton').style.background = "url('./gps(off).svg') no-repeat center center"; // 원래 이미지
        }

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