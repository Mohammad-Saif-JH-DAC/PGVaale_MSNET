// src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapComponent = ({ lat, lng, region }) => {
  const isValid = lat && lng && !isNaN(lat) && !isNaN(lng);
  if (!isValid) return <div className="alert alert-warning">Location not available</div>;

  const position = [parseFloat(lat), parseFloat(lng)];

  return (
    <div className="rounded overflow-hidden border" style={{ height: '180px' }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        dragging={true}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>{region}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};


export default MapComponent;
