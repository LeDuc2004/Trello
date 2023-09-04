import React, { useEffect } from 'react';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const MapDisplay = ({ data }) => {
  useEffect(() => {
    // Tạo bản đồ và thiết lập tọa độ trung tâm
    const map = L.map('map').setView([38.23, 140.79], 14);

    // Thêm layer hiển thị dữ liệu
    const polygonLayer = L.geoJSON(data).addTo(map);
  }, [data]);

  return (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  );
};

export default MapDisplay;
