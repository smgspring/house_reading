var MARKER_WIDTH = 33 // 기본, 클릭 마커의 너비
var MARKER_HEIGHT = 36 // 기본, 클릭 마커의 높이
var  OFFSET_X = 12 // 기본, 클릭 마커의 기준 X좌표
var  OFFSET_Y = MARKER_HEIGHT // 기본, 클릭 마커의 기준 Y좌표
var  OVER_MARKER_WIDTH = 40 // 오버 마커의 너비
var  OVER_MARKER_HEIGHT = 42 // 오버 마커의 높이
var  OVER_OFFSET_X = 13 // 오버 마커의 기준 X좌표
var  OVER_OFFSET_Y = OVER_MARKER_HEIGHT // 오버 마커의 기준 Y좌표
var  SPRITE_MARKER_URL = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png' // 스프라이트 마커 이미지 URL
var  SPRITE_WIDTH = 126 // 스프라이트 이미지 너비
var  SPRITE_HEIGHT = 146 // 스프라이트 이미지 높이
var  SPRITE_GAP = 10 // 스프라이트 이미지에서 마커간 간격

var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT) // 기본, 클릭 마커의 크기
var markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y) // 기본, 클릭 마커의 기준좌표
var  overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT) // 오버 마커의 크기
var  overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y) // 오버 마커의 기준 좌표
var  spriteImageSize = new kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT) // 스프라이트 이미지의 크기

var positions = [  // 마커의 위치
        new kakao.maps.LatLng(37.574828, 126.926584),
        new kakao.maps.LatLng(37.576242, 126.929076),
        new kakao.maps.LatLng(37.572192, 126.929267)
    ],
    selectedMarker = null; // 클릭한 마커를 담을 변수

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = { 
        center: new kakao.maps.LatLng(37.573077, 126.930187), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


// 지도 위에 마커를 표시합니다
for (var i = 0, len = positions.length; i < len; i++) {
    var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
        originY = (MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
        overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
        normalOrigin = new kakao.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
        clickOrigin = new kakao.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
        overOrigin = new kakao.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
        
    // 마커를 생성하고 지도위에 표시합니다
    addMarker(positions[i], normalOrigin, overOrigin, clickOrigin);
}

// 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
function addMarker(position, normalOrigin, overOrigin, clickOrigin) {

    // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
    var normalImage = createMarkerImage(markerSize, markerOffset, normalOrigin),
        overImage = createMarkerImage(overMarkerSize, overMarkerOffset, overOrigin),
        clickImage = createMarkerImage(markerSize, markerOffset, clickOrigin);
    
    // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: position,
        image: normalImage
    });

    // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
    marker.normalImage = normalImage;

    // 마커에 mouseover 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseover', function() {

        // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 오버 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(overImage);
        }
    });

    // 마커에 mouseout 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'mouseout', function() {

        // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 기본 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
        }
    });

var infoPanel = document.getElementById("infoPanel");
var markerInfo = document.getElementById("markerInfo");
var closePanel = document.getElementById("closePanel");

// 패널 닫기 버튼 이벤트
closePanel.addEventListener("click", function () {
infoPanel.classList.remove("open");
infoPanel.classList.add("hidden");
});

    // 마커에 click 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {

        // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 클릭 이미지로 변경합니다
        if (!selectedMarker || selectedMarker !== marker) {
            var info = `
        <strong>위도: ${position.getLat()}</strong><br>
        <strong>경도: ${position.getLng()}</strong><br>
        <p>마커에 대한 추가 정보를 여기 입력하세요.</p>
    `;

    markerInfo.innerHTML = info; // 패널에 정보 추가

    // 패널을 열기
    infoPanel.classList.remove("hidden");
    infoPanel.classList.add("open");
            
        }
    });
}

// MakrerImage 객체를 생성하여 반환하는 함수입니다
function createMarkerImage(markerSize, offset, spriteOrigin) {
    var markerImage = new kakao.maps.MarkerImage(
        SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
        markerSize, // 마커의 크기
        {
            offset: offset, // 마커 이미지에서의 기준 좌표
            spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
            spriteSize: spriteImageSize // 스프라이트 이미지의 크기
        }
    );
    
    return markerImage;
}