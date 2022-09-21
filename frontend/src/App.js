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
import { faStar } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
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

  const position = [16.9753, 96.0785];

  const [pins, setPins] = useState([]);

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
      zoom={10}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <Marker position={[p.lat, p.lng]}>
          <Popup offset={[0, -33]}>
            <div className="card">
              <label>Place</label>
              <h4>London City</h4>
              <label>Review</label>
              <p className="desc">Beautiful Place</p>
              <label>Rating</label>
              <div className="stars">
                <FontAwesomeIcon icon={faStar} className="star" />
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>ACM</b>
              </span>
              <span className="date">1 hour ago</span>
            </div>
          </Popup>
        </Marker>
      ))}

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};

export default App;
