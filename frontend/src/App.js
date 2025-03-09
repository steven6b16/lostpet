import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReportLost from './ReportLost';
import ReportFound from './ReportFound';
import PetDetail from './PetDetail';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // 引入 Leaflet CSS

function App() {
  const [lostPets, setLostPets] = useState([]);
  const [foundPets, setFoundPets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/lost-pets')
      .then(res => setLostPets(res.data))
      .catch(err => {
        console.error('獲取走失寵物失敗:', err.message);
        alert('無法連接到後端服務，請檢查後端是否運行');
      });

    axios.get('http://localhost:3001/api/found-pets')
      .then(res => setFoundPets(res.data))
      .catch(err => {
        console.error('獲取報料寵物失敗:', err.message);
        alert('無法連接到後端服務，請檢查後端是否運行');
      });
  }, []);

  return (
    <Router>
      <div className="bg-one-degree-bg min-h-screen">
        {/* 導航欄 */}
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="text-2xl font-bold text-pet-purple">PetBacker</div>
          <div className="flex space-x-4">
            <Link to="/" className="text-pet-purple hover:underline">首頁</Link>
            <Link to="/account" className="text-pet-purple hover:underline">帳戶</Link>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">報料者: User Name</span>
            <img src="https://via.placeholder.com/30" alt="User" className="w-8 h-8 rounded-full" />
          </div>
        </nav>

        {/* 四個主要按鈕（參考 OneDegree 橫向布局） */}
        <div className="flex justify-center p-4 bg-white border-b border-gray-200">
          <div className="flex space-x-4">
            <Link to="/report-found" className="px-4 py-2 bg-pet-light-purple text-white rounded-lg hover:bg-pet-purple">同搜報料</Link>
            <Link to="/report-lost" className="px-4 py-2 bg-pet-light-purple text-white rounded-lg hover:bg-pet-purple">報失列表</Link>
            <Link to="/" className="px-4 py-2 bg-pet-light-purple text-white rounded-lg hover:bg-pet-purple">主人報失</Link>
            <Link to="/" className="px-4 py-2 bg-pet-light-purple text-white rounded-lg hover:bg-pet-purple">我要報料</Link>
          </div>
        </div>

        <Routes>
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/report-found" element={<ReportFound />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/account" element={<div>帳戶頁面（待開發）</div>} />
          <Route path="/" element={
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* 左側走失寵物列表（參考 OneDegree 卡片風格） */}
                <div className="col-span-2">
                  <h2 className="text-2xl font-semibold text-pet-purple mb-4">走失寵物列表</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {lostPets.map(pet => (
                      <div key={pet.lostId} className="bg-one-degree-card p-4 rounded-lg shadow-md flex flex-col items-center">
                        {pet.photos && (
                          <img
                            src={`http://localhost:3001/${pet.photos.split(',')[0].split('/').pop()}`}
                            alt={pet.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <div className="text-center mt-2">
                          <p className="text-pet-purple font-medium">{pet.name}</p>
                          <Link to={`/pet/${pet.lostId}`} className="text-pet-light-purple hover:underline mt-2 inline-block">報料</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右側資訊區域（參考 OneDegree 獎勵卡片） */}
                <div className="col-span-1">
                  <div className="bg-one-degree-card p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-pet-purple mb-2">單品位置</h2>
                    <p className="text-gray-500 italic">(暫時留空，日後添加內容)</p>
                  </div>
                </div>
              </div>

              {/* 底部地圖 */}
              <div className="mt-6">
                <MapContainer center={[22.3193, 114.1694]} zoom={10} className="w-full h-96 rounded-lg">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {lostPets.map(pet => {
                    if (pet.location) {
                      const [lat, lng] = pet.location.split(',').map(coord => parseFloat(coord));
                      if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                          <Marker key={pet.lostId} position={[lat, lng]}>
                            <Popup>
                              <b>{pet.name}</b><br />
                              <a href={`/pet/${pet.lostId}`}>查看詳情</a>
                            </Popup>
                          </Marker>
                        );
                      }
                    }
                    return null;
                  })}
                </MapContainer>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;