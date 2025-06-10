import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point[0], point[1])),
      router: new L.Routing.OSRMv1({
        serviceUrl: "https://smartbin-x0i7.onrender.com/route/v2/directions/driving-car",
        //serviceUrl: "https://api.openrouteservice.org/v2/directions/driving-car",
        //api_key: "5b3ce3597851110001cf62484ec4c79d93ad4421997e30091615a308"
      }),
      routeWhileDragging: true,
      addWaypoints: false,
      show: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, waypoints]);

  return null;
};

export default RoutingMachine;