import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { useEffect, useState } from "react";
import "./app.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { format } from "timeago.js";
import { nanoid } from "nanoid";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  //leaflet marker not working, so fixed
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  //leaflet components
  function AddNewPlace() {
    useMapEvent("dblclick", (e) => {
      const { lat, lng } = e.latlng;
      setNewPlace([lat, lng]);
    });
    return null;
  }

  //want to make marker center on click but not working yet
  // function clickmarker(lat,lng) {
  //   console.log(lat,lng)
  //   setPosition([lat, lng])
  //   //map.panTo(new L.LatLng(40.737, -73.923));
  //   //L.Map.prototype.panTo(L.LatLng(lat, lng))
  //   //L.Map.prototype.flyTo([lat,lng])
  // }

  //fa marker icon; leaflet custom marker needs html, not components
  const svg = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" class="svg-inline--fa fa-location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"></path></svg>`;

  function changeiconColor(user) {
    const color = user === currentUser ? "#4838cc" : "ff0000";
    const myicon = L.divIcon({
      className: "my-custom-pin",
      labelAnchor: [6, 40],
      popupAnchor: [0, -5],
      shadowSize: [41, 41],
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      html: `<div style='background-color:${color};' class='marker-pin'></div>
      ${svg}
      `,
    });
    return myicon;
  }

  function Stars({ amount }) {
    let stars = [];
    for (let index = 0; index < amount; index++) {
      const id = nanoid();
      stars.push(<FontAwesomeIcon icon={faStar} key={id} className="star" />);
    }
    return stars;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace[0],
      long: newPlace[1],
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUser(null)
  }

  const centerPos = [16.9753, 96.0785];

  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPins();
  }, []);

  //{Array(p.rating).fill(<FontAwesomeIcon icon={faStar} className="star" />)}
  //would do the same; need to take care key for it

  return (
    <MapContainer
      center={centerPos}
      zoom={4}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <Marker
          position={[p.lat, p.long]}
          icon={changeiconColor(p.username)}
          key={p._id}

          // eventHandlers={{
          //   click: (e) => {
          //     console.log(e.latlng)
          //     const { lat, lng } = e.latlng;

          //     clickmarker(lat,lng)
          //   },
          // }}
        >
          <Popup offset={[0, -25]}>
            <div className="card">
              <label>Place</label>
              <h4 className="title">{p.title}</h4>
              <label>Review</label>
              <p className="desc">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                <Stars amount={p.rating} />
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{p.username}</b>
              </span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {newPlace && (
        <Popup position={newPlace}>
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Say us something about it..."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}

      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>Log out</button>
      ) : (
        <div className="buttonGroup">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}

      <AddNewPlace />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default App;
