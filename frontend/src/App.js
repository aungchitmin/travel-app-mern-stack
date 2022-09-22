import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  useMap,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./app.css";
import { useEffect, useState } from "react";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { format } from "timeago.js";
//import { Star } from "@material-ui/icons";

const App = () => {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  // function LocationMarker() {
  //   const [position, setPosition] = useState(null);
  //   const map = useMapEvents({
  //     click() {
  //       map.locate();
  //     },
  //     locationfound(e) {
  //       setPosition(e.latlng);
  //       map.flyTo(e.latlng, map.getZoom());
  //     },
  //   });

  //   return position === null ? null : (
  //     <Marker position={position}>
  //       <Popup>You are here</Popup>
  //     </Marker>
  //   );
  // }

  //function MyComponent() {
  //const map = useMap()
  //console.log('map center:', map.getCenter())

  // const map = useMapEvents({
  //   click: () => {
  //     map.locate()
  //   },
  //   locationfound: (location) => {
  //     console.log('location found:', location)
  //   },
  // })

  //   const map = useMapEvent('click', () => {
  //     map.flyTo([50.5, 30.5])
  //   })
  //   return null
  // }


  const svg = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" class="svg-inline--fa fa-location-dot locationdot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"></path></svg>`

  

  function changeiconColor(user) {
    const color = user === currentUser ? "#4838cc" : "ff0000"
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
    return myicon
  }

  const position = [16.9753, 96.0785];

  const [pins, setPins] = useState([]);
  const currentUser = "john";

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

  return (
    <MapContainer
      center={position}
      zoom={6}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <Marker position={[p.lat, p.long]} icon={changeiconColor(p.username)} key={p._id}>
          <Popup offset={[0, -25]}>
            <div className="card">
              <label>Place</label>
              <h4>{p.title}</h4>
              <label>Review</label>
              <p className="desc">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                <FontAwesomeIcon icon={faStar} className="star" />
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

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default App;
