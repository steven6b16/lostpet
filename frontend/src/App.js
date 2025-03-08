import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

function App() {
  const [lostPets, setLostPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('開始請求數據...');
    setLoading(true);
    axios.get('http://localhost:5000/api/lost-pets')
      .then(response => {
        console.log('獲取數據：', response.data);
        setLostPets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('拿資料失敗：', error.message);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredPets = lostPets.filter(pet => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = (
      (pet.name ? pet.name.toLowerCase() : '').includes(searchLower) ||
      (pet.location ? pet.location.toLowerCase() : '').includes(searchLower)
    );
    const matchCategory = category === 'all' ||
      (category === 'cat' && (pet.species === '貓' || !pet.species)) ||
      (category === 'dog' && (pet.species === '狗' || !pet.species));
    return matchSearch && matchCategory;
  });

  if (loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div>錯誤：{error}</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>同搜毛棄 - 幫您找回毛孩</h1>
        <p>尋找走失寵物的社區平台</p>
        <a href="/report-lost" className="report-button">立即報失</a>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="搜名稱或地點..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">全部</option>
          <option value="cat">貓</option>
          <option value="dog">狗</option>
        </select>
      </div>

      <h2>走失寵物列表</h2>
      <div className="pet-list">
        {filteredPets.length === 0 ? (
          <p>暫無走失寵物</p>
        ) : (
          filteredPets.map(pet => (
            <div key={pet.id} className="pet-card">
              {pet.photo && (
                <img src={`http://localhost:5000/${pet.photo}`} alt={pet.name} className="pet-image" />
              )}
              <div className="pet-info">
                <p><strong>名稱：</strong>{pet.name || '未知'}</p>
                <p><strong>物種：</strong>{pet.species || '未知'}</p>
                <p><strong>地點：</strong>{pet.location || `經 ${pet.lat}, 緯 ${pet.lng}`}</p>
                <p><strong>提交時間：</strong>{pet.created_at}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <h2>走失地點地圖</h2>
      <MapContainer center={[22.3193, 114.1694]} zoom={11} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredPets
          .filter(pet => pet.lat != null && pet.lng != null)
          .map(pet => (
            <Marker key={pet.id} position={[pet.lat, pet.lng]}>
              <Popup>
                <div>
                  <strong>名稱：</strong>{pet.name || '未知'}<br />
                  <strong>物種：</strong>{pet.species || '未知'}<br />
                  <strong>地點：</strong>{pet.location || `經 ${pet.lat}, 緯 ${pet.lng}`}<br />
                  <strong>提交時間：</strong>{pet.created_at}<br />
                  {pet.photo && <img src={`http://localhost:5000/${pet.photo}`} alt={pet.name} width="100" />}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default App;