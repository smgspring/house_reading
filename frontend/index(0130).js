var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = { 
        center: new kakao.maps.LatLng(37.573077, 126.930187), // 지도의 중심좌표 (연희동)
        level: 3 // 지도의 확대 레벨
    }; 

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커 데이터 (위치 및 가격 정보)
var positions = [
    { latlng: new kakao.maps.LatLng(37.575979, 126.928853), price: "3억" },
    { latlng: new kakao.maps.LatLng(37.572177, 126.929172), price: "2억 5천만 원" },
    { latlng: new kakao.maps.LatLng(37.573510, 126.930871), price: "3,000만 원" }
];

var infoPanel = document.getElementById("infoPanel");
var markerInfo = document.getElementById("markerInfo");
var closePanel = document.getElementById("closePanel");

// 패널 닫기 버튼 이벤트
closePanel.addEventListener("click", function () {
    infoPanel.classList.remove("open");
    infoPanel.classList.add("hidden");
});

// 모든 마커를 추가합니다
for (var i = 0; i < positions.length; i++) {
    addCustomMarker(positions[i]);
}

function addCustomMarker(position) {
    var content = document.createElement('div');
    // 마커 생성 //
    content.style.cssText = `
        position: relative; 
        width: 80px; 
        height: 80px; 
        text-align: center; 
        font-size: 12px; 
        cursor: pointer;
    `;
    //마커에 표시되는 영역 -> 추후에 position.price랑 background는 db의 데이터에 따라 바뀌도록 수정해야//
    content.innerHTML = `
        <div style="color: #3273F6; font-weight: bold; margin-bottom: 5px;">
            ${position.price}
        </div>
        <div style="width: 50px; height: 50px; margin: 0 auto;
            background: url('./🦆 icon _village_.svg') no-repeat center/contain;">
        </div>
    `;
    // 생성한 마커가 지도 상 위로 올라오도록 하는 코드//
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position.latlng,
        content: content,
        yAnchor: 1 // 마커의 y축 기준점 (하단 기준)
    });

    customOverlay.setMap(map);

    // 이벤트 추가
    content.addEventListener('mouseover', function () {
        content.style.transform = 'scale(1.1)';
        content.style.transition = 'transform 0.2s';
    });

    content.addEventListener('mouseout', function () {
        content.style.transform = 'scale(1)';
    });

    content.addEventListener('click', function () {
        // 패널 내 주소가 뜨는 detail 프레임 생성 //
        var detailFrame = document.createElement('div');
        detailFrame.style.cssText = `
            position: absolute;
            left: 30px; 
            top: 120px; 
            width: 420px; 
            height: 150px; 
            background: #f9f9f9; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            padding: 10px;
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            box-sizing: border-box
        `;
        // detail 프레임 안에 들어갈 정보 + 북마크 버튼 //
        detailFrame.innerHTML = `
            <div>
                <p style="margin: 0; font-size: 14px;">위치 주소: ${position.latlng.getLat()}, ${position.latlng.getLng()}</p>
            </div>
            <button class="bookmarkBtn" style="
                width: 40px; 
                height: 40px; 
                background: url('./star.svg') no-repeat center/contain; 
                cursor: pointer; 
                border: none; 
                background-color: transparent;">
            </button>
        `;

        // 북마크 버튼 클릭 시 동작
        var bookmarkBtn = detailFrame.querySelector('.bookmarkBtn');

        bookmarkBtn.addEventListener("click", function () {
        var isBookmarked = bookmarkBtn.getAttribute('data-bookmarked') === 'true';

        // 북마크 상태 전환
        if (isBookmarked) {
            bookmarkBtn.style.backgroundImage = "url('./star.svg')";
            bookmarkBtn.setAttribute('data-bookmarked', 'false');
        } else {
            bookmarkBtn.style.backgroundImage = "url('./star-filled.svg')";
            bookmarkBtn.setAttribute('data-bookmarked', 'true');
        }
    });

        //checkboxFrame 생성하기
        var checkboxFrame = document.createElement('div');
        checkboxFrame.style.cssText = `
            position: absolute;
            left: 30px; 
            top: 280px;
            width: 420px; 
            height: 300px; 
            background: #fff; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            padding: 20px; 
            overflow-y: auto;
            box-sizing: border-box
        `;
    
        // 질문 리스트 생성
        var questions = [
            "주변 환경은 조용한가요?",
            "주차 공간은 충분한가요?",
            "채광은 적절한가요?",
            "교통 접근성이 좋은가요?",
            "가까운 편의시설이 있는가요?",
            "단열 및 방음은 괜찮은가요?",
            "관리비는 적당한가요?",
            "화재 안전 장치가 설치되어 있나요?"
        ];
    
        //checkboxframe 안에 들어가는 구성 요소들 1.checkboxItem 2.checkbox 3.label
        questions.forEach(function (question) {
            var questionItem = document.createElement('div');
            questionItem.style.cssText = `
                display: flex; 
                align-items: center; 
                margin-bottom: 10px;
            `;
    
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.style.cssText = `
                margin-right: 10px; 
                width: 16px; 
                height: 16px;
            `;
    
            var label = document.createElement('label');
            label.textContent = question;
            label.style.cssText = `
                font-size: 14px; 
                color: #333;
            `;
    
            questionItem.appendChild(checkbox);
            questionItem.appendChild(label);
            checkboxFrame.appendChild(questionItem);

              });
              // 패널 내 그래프가 뜨는 graph 프레임 생성 //
             var graphFrame = document.createElement('div');
             graphFrame.style.cssText = `
                 position: absolute;
                 left: 30px; 
                 top: 600px; 
                 width: 420px; 
                 height: 300px; 
                 background: #f9f9f9; 
                 border: 1px solid #ddd; 
                 border-radius: 8px; 
                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                 padding: 10px;
                 display: flex; 
                 align-items: center; 
                 justify-content: space-between;
                 box-sizing: border-box
             `; 
                // 그래프 데이터 설정
                var graphData = {
                    labels: ['1월', '2월', '3월', '4월', '5월'], // 월별
                    datasets: [
                        {
                            type: 'line', // 꺾은선 그래프
                            label: '집값 변화(억 원)',
                            data: [3, 3.2, 2.8, 3.1, 3.3], // 집값 변화 데이터
                            borderColor: 'rgb(75, 192, 192)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            type: 'bar', // 막대 그래프
                            label: '매매 건수',
                            data: [50, 60, 45, 70, 80], // 매매 건수 데이터
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                };

                // 그래프 생성
                var ctx = document.createElement('canvas'); // 캔버스 요소 생성
                graphFrame.appendChild(ctx); // graphFrame에 캔버스를 추가

                var chart = new Chart(ctx, {
                    type: 'bar', // 기본적으로 막대그래프
                    data: graphData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                enabled: true
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                var detailbutton = document.createElement('button')
                detailbutton.innerText = "Detail"; // 버튼 텍스트 설정
                detailbutton.style.cssText = `
                    width: 400px;
                    padding: 8px 12px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    border-radius: 5px;
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                `;
                
        // 패널에 추가
        infoPanel.appendChild(detailFrame);
        infoPanel.appendChild(checkboxFrame);
        infoPanel.appendChild(graphFrame);
        graphFrame.appendChild(detailbutton);


        // 패널을 열기
        infoPanel.classList.remove("hidden");
        infoPanel.classList.add("open");

        // 지도의 중심을 클릭된 마커의 위치로 부드럽게 이동
        map.panTo(position.latlng);
    });
}
