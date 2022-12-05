import { useEffect, useState, useRef } from "react";
import { Box, Text, Flex, Strong } from "../../components";

const CafeMap = ({ searchPlace, addressId }) => {
	const { kakao } = window;
	// 검색결과를 담을 배열
	const [Places, setPlaces] = useState([]);
	const mapContainer = useRef(null);
	useEffect(() => {
		let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
		const options = {
			center: new kakao.maps.LatLng(33.450701, 126.570667),
			level: 3,
		};
		const map = new kakao.maps.Map(mapContainer.current, options);

		const ps = new kakao.maps.services.Places();

		function placesSearch(data, status) {
			if (status === kakao.maps.services.Status.OK) {
				// 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성
				let bounds = new kakao.maps.LatLngBounds();
				for (let i = 0; i < data.length; i++) {
					if (addressId === data[i].id) {
						displayMarker(data[i]);
						// LatLngBounds 객체에 좌표를 추가
						bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
						// LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정
						// 이때 지도의 중심좌표와 레벨이 변경될 수 있다
						map.setBounds(bounds);
						setPlaces(prev => {
							return [...prev, data[i]];
						});
					}
				}
			}
		}

		// 검색 키워드 변경시 키워드 검색
		if (searchPlace) ps.keywordSearch(searchPlace, placesSearch);

		function displayMarker(place) {
			let marker = new kakao.maps.Marker({
				map: map,
				position: new kakao.maps.LatLng(place.y, place.x),
			});

			kakao.maps.event.addListener(marker, "click", function () {
				let url = "https://map.kakao.com/link/map/" + place.id;
				window.open(url, "_blank");
				let content =
					'<div style="padding:5px;font-size:12px;">' +
					place.place_name +
					"</div>";
				infowindow.setContent(content);
				infowindow.open(map, marker);
			});
		}
	}, [searchPlace]);

	return (
		<Box variant="detail-map">
			<Box
				ref={mapContainer}
				style={{
					width: "100%",
					height: "460px",
				}}
			/>
			{Places.map(item => {
				return (
					<Box id="result-list" key={item.id} variant="detail-map-desc">
						<Flex ai="center">
							<Box variant="detail-map-desc-content">
								<Box variant="detail-map-desc-address">
									<a href={item.place_url} target="_blank" rel="noreferrer">
										<Flex ai="center" gap="30px">
											<Strong variant="cafe-write-address">
												{item.place_name}
											</Strong>
											{item.road_address_name ? (
												<Box variant="cafe-write-address">
													<Flex fd="column" gap="5px">
														<Text>{item.road_address_name}</Text>
														<Text>{item.address_name}</Text>
														<Text>{item.phone}</Text>
													</Flex>
												</Box>
											) : (
												<Box variant="cafe-write-address">
													<Flex fd="column" gap="5px">
														<Text>{item.address_name}</Text>
														<Text>{item.phone}</Text>
													</Flex>
												</Box>
											)}
										</Flex>
									</a>
								</Box>
							</Box>
						</Flex>
					</Box>
				);
			})}
		</Box>
	);
};

export default CafeMap;
