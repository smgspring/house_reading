var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = { 
        center: new kakao.maps.LatLng(37.573077, 126.930187), // 지도의 중심좌표 (연희동)
        draggable: false,
        level: 3 // 지도의 확대 레벨
    }; 

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 버튼 클릭에 따라 지도 확대, 축소 기능을 막거나 풀고 싶은 경우에는 map.setZoomable 함수를 사용합니다
function setZoomable() {
    // 마우스 휠로 지도 확대,축소 가능여부를 설정합니다
    map.setZoomable(true);    
}

setZoomable();
// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();
// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커 데이터 (위치 및 가격 정보) -> 나중엔 데이터를 뽑아오도록 수정
var positions = [
    { latlng: new kakao.maps.LatLng(37.575979, 126.928853), type: "원룸", address: "서울시 서대문구 연희동 100-3"},
    { latlng: new kakao.maps.LatLng(37.572177, 126.929172), type: "오피스텔", address: "서울시 서대문구 연희동 151-84" },
    { latlng: new kakao.maps.LatLng(37.573510, 126.930871), type: "아파트", address: "서울시 서대문구 연희동 100-3" }
];

var infoPanel = document.getElementById("infoPanel");
var closeButton = document.getElementById("closeButton");


// 패널 닫기 버튼 이벤트
closeButton.addEventListener("click", function () {
    infoPanel.classList.remove("open");
    infoPanel.classList.add("hidden");
});
    
// 모든 마커를 추가합니다
for (var i = 0; i < positions.length; i++) {
    addCustomMarker(positions[i]);
}

//마커 HTML을 생성하는 함수
function createMarkerElement(type) {
    const marker = document.createElement("div");
    marker.style.cssText = `
        position: relative; 
        width: 80px; 
        height: 80px; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        cursor: pointer;
    `;
    marker.innerHTML = `
        <div style="
            width: 100%; 
            height: 100%; 
            background: url('./원룸 아이콘.svg') no-repeat center/contain;
            position: relative;
        ">
            <span style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 14px; 
                font-weight: bold; 
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                white-space: nowrap;
            ">
                ${type}
            </span>
            <div style="
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 0; 
                height: 0; 
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #3273F6;
            "></div>
        </div>
    `;
    return marker;
}

// 마커 클릭 이벤트 핸들러(디테일 프레임)
function handleMarkerClick1(position) {
    return function () {
        const detailFrame = document.getElementById("detailFrame");
        detailFrame.innerHTML = ""; // 기존 내용 삭제
        // 컨테이너 div 생성 (주소 + 버튼 포함)
        const container = document.createElement("div");
        container.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            width: 100%;
        `;
        // 주소 요소 생성
        let addressElement = document.createElement("p");
        addressElement.classList.add("address-text");
        addressElement.style.margin = "0";
        addressElement.style.fontSize = "14px";
        addressElement.textContent = `주소: ${position.address}`;

        // 기존 bookmark 버튼 가져오기 (없으면 새로 생성)
        let bookmarkBtn = document.getElementById("bookmarkBtn");
        if (!bookmarkBtn) {
            bookmarkBtn = document.createElement("button");
            bookmarkBtn.id = "bookmarkBtn";
        }
        // 컨테이너에 요소 추가 (주소 왼쪽, 버튼 오른쪽)
        container.appendChild(addressElement);
        container.appendChild(bookmarkBtn);
        // detailFrame에 컨테이너 추가
        detailFrame.appendChild(container);

        // 북마크 버튼 클릭 이벤트 추가 
        bookmarkBtn.addEventListener("click", function () {
         var isBookmarked = bookmarkBtn.getAttribute('data-bookmarked') === 'true';

        // 북마크 상태 전환
        if (isBookmarked) {
        bookmarkBtn.style.background = "url('./star.svg') no-repeat center/contain";
        bookmarkBtn.setAttribute('data-bookmarked', 'false');
        } else {
        bookmarkBtn.style.background = "url('./star-filled.svg') no-repeat center/contain";
        bookmarkBtn.setAttribute('data-bookmarked', 'true');
        }
});    //패널 우측 상단의 닫기 버튼을 통해 패널이 사라지도록 함. 
        infoPanel.classList.remove("hidden");
        infoPanel.classList.add("open");
    };
}

// 마커 클릭 이벤트 핸들러(체크박스 프레임)
function handleMarkerClick2(position) {
    return function() {
    const checkboxFrame = document.querySelector('#checkboxFrame');
    checkboxFrame.innerHTML = ''
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
    };
}

function handleMarkerClick3(position) { 
    return function () {
        // graphFrame 요소 가져오기 (존재 확인)
        var graphFrame = document.querySelector('#graphFrame');
        if (!graphFrame) return; // 요소가 없으면 종료

        // 기존 그래프 초기화 (중복 방지)
        graphFrame.innerHTML = "";
        // 캔버스 생성 및 추가
        var ctx = document.createElement('canvas');
        ctx.id = "graphCanvas"; // id 추가하여 중복 방지
        graphFrame.appendChild(ctx);

        // 기존 Chart.js 인스턴스 제거 (중복 방지)
        if (window.chartInstance) {
            window.chartInstance.destroy();
        }

        //그래프 데이터 설정 -> 이러한 데이터는 추후에 백엔드를 통해 받도록 해야야
        var graphData = {
            labels: ['1월', '2월', '3월', '4월', '5월'],
            datasets: [
                {
                    type: 'line',
                    label: '집값 변화(억 원)',
                    data: [3, 3.2, 2.8, 3.1, 3.3],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                },
                {
                    type: 'line',
                    label: '매매 건수',
                    data: [50, 60, 45, 70, 80],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                }
            ]
        };

        // Chart.js 그래프 생성 및 저장
        window.chartInstance = new Chart(ctx, {
            type: 'line',
            data: graphData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
                    }
                }
            }
        });

        // Detail 버튼 생성
        var detailbutton = document.createElement('button');
        detailbutton.innerText = "Detail";
        detailbutton.style.cssText = `
            width: 400px;
            padding: 8px 12px;
            border: none;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 10px;
            align-self: center; 
        `;
        graphFrame.appendChild(detailbutton);

        // Back 버튼 생성 (초기에는 숨김)
        var backgraphbutton = document.createElement('button');
        backgraphbutton.innerText = "Back";
        backgraphbutton.style.cssText = `
            width: 400px;
            padding: 8px 12px;
            border: none;
            background-color: #ff5a5a;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 10px;
            align-self: center;
            display: none;
        `;

        //Detail 버튼 클릭 이벤트 (그래프 → 표 변환)
        detailbutton.addEventListener("click", function () {
            ctx.style.display = 'none';
            detailbutton.style.display = 'none';

            // 표 생성
            var table = document.createElement('table');
            table.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            `;
            table.innerHTML = `
                <thead>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">월</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">집값 변화(억 원)</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">매매 건수</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">1월</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3억</td>
                <td style="border: 1px solid #ddd; padding: 8px;">50</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">2월</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.2억</td>
                <td style="border: 1px solid #ddd; padding: 8px;">60</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">3월</td>
                <td style="border: 1px solid #ddd; padding: 8px;">2.8억</td>
                <td style="border: 1px solid #ddd; padding: 8px;">45</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">4월</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.1억</td>
                <td style="border: 1px solid #ddd; padding: 8px;">70</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">5월</td>
                <td style="border: 1px solid #ddd; padding: 8px;">3.3억</td>
                <td style="border: 1px solid #ddd; padding: 8px;">80</td>
            </tr>
        </tbody>
            `;
            
            // 표 추가 (위쪽)
            graphFrame.appendChild(table);
            graphFrame.appendChild(backgraphbutton);

            // Back 버튼 표시
            backgraphbutton.style.display = 'block';
        });

        // Back 버튼 클릭 이벤트 (표 → 그래프 복구)
        backgraphbutton.addEventListener("click", function () {
            graphFrame.innerHTML = ''; // 표 제거

            // 그래프 복원
            graphFrame.appendChild(ctx);
            graphFrame.appendChild(detailbutton);

            // 스타일 복구
            ctx.style.display = 'block';
            detailbutton.style.display = 'block';
            backgraphbutton.style.display = 'none';
        });
    };
}


// 마커 추가 함수
function addCustomMarker(position) {
    const marker = createMarkerElement(position.type);

    // Kakao 지도 커스텀 오버레이 생성 및 추가
    new kakao.maps.CustomOverlay({
        position: position.latlng,
        content: marker,
        yAnchor: 1
    }).setMap(map);

    // 마커 클릭, 마우스오버, 마우스아웃 이벤트 추가
    //마커를 클릭할 때 발생해야 할 기능을 함수 3개로 쪼갬
    marker.addEventListener("click", function () {
        handleMarkerClick1(position)();
        handleMarkerClick2(position)();
        handleMarkerClick3(position)();
        //마커를 누르면 마커를 기준으로 지도의 중심이 이동하도록 함
        map.panTo(position.latlng)();
    });    
    marker.addEventListener("mouseover", function () {
        marker.style.transform = 'scale(1.1)';
        marker.style.transition = 'transform 0.2s';
    })
    marker.addEventListener('mouseout', function () {
        marker.style.transform = 'scale(1)';
    });
}

const openclosecheckboxbutton = document.querySelector('#openclosecheckbox');
const checkboxFrame = document.querySelector('#checkboxFrame');

openclosecheckboxbutton.addEventListener('click', function () {
    // 체크박스 프레임 토글
    checkboxFrame.style.display = (checkboxFrame.style.display === 'none' || checkboxFrame.style.display === '') 
        ? 'block' 
        : 'none';

    // 버튼 색상 변경 (클래스 추가/제거)
    openclosecheckboxbutton.classList.toggle('active');
});