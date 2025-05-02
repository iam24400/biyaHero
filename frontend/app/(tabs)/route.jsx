// file: RoutePage.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Alert, Modal, FlatList
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

export default function RoutePage() {
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('alangilan');
  const [location, setLocation] = useState(null);
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [tapMode, setTapMode] = useState('destination');
  const webviewRef = useRef(null);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ 
    distance: null, 
    duration: null,
    instructions: [],
    estimatedArrival: null
  });
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const router = useRouter();

  const alangilanStops = [
    { name: 'Terminal', time: '9:51' },
    { name: 'Lawas/Calikanto', time: '10:15' },
    { name: 'Diversion Road', time: '10:30' },
    { name: 'Pier', time: null }
  ];

  const possibleRoutesStops = [
    { name: 'Terminal', time: '9:51' },
    { name: 'Other Stop 1', time: '10:10' },
    { name: 'Other Stop 2', time: '10:25' },
    { name: 'Pier', time: null }
  ];

  const stopsToShow = selectedTab === 'alangilan' ? alangilanStops : possibleRoutesStops;

  const leafletHtml = `<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.3/dist/leaflet.css'><link rel='stylesheet' href='https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css'><style> html, body, #map { height: 100%; margin: 0; padding: 0; } </style></head><body><div id='map'></div><script src='https://unpkg.com/leaflet@1.9.3/dist/leaflet.js'></script><script src='https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js'></script><script>const map = L.map('map', { zoomControl: true, scrollWheelZoom: true }).setView([13.7565, 121.0583], 13);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'Map data © OpenStreetMap contributors'}).addTo(map);let routingControl,originMarker,destinationMarker;function drawRoute(start,end){if(routingControl)map.removeControl(routingControl);routingControl = L.Routing.control({waypoints:[L.latLng(start.lat,start.lng),L.latLng(end.lat,end.lng)],createMarker:()=>null,show:false}).addTo(map);routingControl.on('routesfound', function(e) {const routes = e.routes;const summary = routes[0].summary;const instructions = routes[0].instructions.map(inst => inst.text);window.ReactNativeWebView.postMessage(JSON.stringify({routeInfo: {distance: summary.totalDistance, duration: summary.totalTime, instructions: instructions}}));});}function markOrigin(lat,lng){if(!originMarker){originMarker = L.marker([lat,lng],{icon: L.divIcon({className: 'origin-marker', html: '📍', iconSize: [30, 30]})}).addTo(map);}else{originMarker.setLatLng([lat,lng]);}}function markDestination(lat,lng){if(!destinationMarker){destinationMarker = L.marker([lat,lng],{icon: L.divIcon({className: 'destination-marker', html: '📍', iconSize: [30, 30]})}).addTo(map);}else{destinationMarker.setLatLng([lat,lng]);}}window.addEventListener('message',(event)=>{try{const data=JSON.parse(event.data);if(data.origin&&data.destination){drawRoute(data.origin,data.destination);markOrigin(data.origin.lat,data.origin.lng);markDestination(data.destination.lat,data.destination.lng);}if(data.userLocation){markOrigin(data.userLocation.lat,data.userLocation.lng);}if(data.clicked){markDestination(data.clicked.lat,data.clicked.lng);}}catch(e){console.error('Invalid message',e);}});map.on('click',function(e){const coords={lat:e.latlng.lat,lng:e.latlng.lng};markDestination(coords.lat,coords.lng);window.ReactNativeWebView.postMessage(JSON.stringify({clicked:coords}));});</script></body></html>`;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  const geocodePlace = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
    const res = await fetch(url);
    return await res.json();
  };

  const handleOriginInput = async (text) => {
    setOriginName(text);
    if (text.length > 2) {
      const suggestions = await geocodePlace(text);
      setOriginSuggestions(suggestions);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationInput = async (text) => {
    setDestinationName(text);
    if (text.length > 2) {
      const suggestions = await geocodePlace(text);
      setDestinationSuggestions(suggestions);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const selectOrigin = (item) => {
    setOriginName(item.display_name);
    setOrigin({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setOriginSuggestions([]);
    webviewRef.current?.postMessage(JSON.stringify({ origin: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }, destination }));
  };

  const selectDestination = (item) => {
    setDestinationName(item.display_name);
    setDestination({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setDestinationSuggestions([]);
    webviewRef.current?.postMessage(JSON.stringify({ origin, destination: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) } }));
  };

  const setCurrentLocationAsOrigin = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission not granted');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setOrigin(coords);
      setOriginName('📍 Current Location');
      webviewRef.current?.postMessage(JSON.stringify({ userLocation: coords, origin: coords, destination }));
    } catch (err) {
      Alert.alert('Failed to fetch location');
    }
  };

  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.clicked) {
        setSelectedLocation(data.clicked);
        setShowLocationOptions(true);
      } else if (data.routeInfo) {
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + data.routeInfo.duration * 1000);
        
        setRouteInfo({
          distance: (data.routeInfo.distance / 1000).toFixed(2),
          duration: Math.round(data.routeInfo.duration / 60),
          instructions: data.routeInfo.instructions.map((instruction, index) => ({
            id: index + 1,
            text: instruction
          })),
          estimatedArrival: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setShowInstructions(true);
      }
    } catch (e) {
      console.warn('Failed to parse WebView message:', e);
    }
  };

  const handleLocationSelect = (type) => {
    if (type === 'origin') {
      setOrigin(selectedLocation);
      setOriginName(`📌 ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
    } else {
      setDestination(selectedLocation);
      setDestinationName(`📌 ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
    }
    webviewRef.current?.postMessage(JSON.stringify({ origin, destination }));
    setShowLocationOptions(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2); // Distance in km with 2 decimal places
  };

  const calculateRouteDistance = () => {
    if (origin && destination) {
      const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      setCalculatedDistance(distance);
      setShowInstructions(false); // Reset instructions when recalculating
      if (webviewRef.current) {
        webviewRef.current.postMessage(JSON.stringify({ 
          origin, 
          destination 
        }));
      }
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert('Back')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BiyaHero</Text>
      </View>

      <View style={styles.distanceDetailsContainer}>
        <View style={styles.distanceHeader}>
          <Text style={styles.distanceHeaderText}>Route Details</Text>
        </View>
        
        <View style={styles.pointDetails}>
          <View style={styles.pointRow}>
            <Text style={styles.pointIcon}>📍</Text>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Starting Point</Text>
              <View style={styles.searchContainer}>
          <TextInput
                  style={styles.searchInput}
                  placeholder="Search location..."
                  value={originName}
            onChangeText={handleOriginInput}
          />
                <TouchableOpacity 
                  style={styles.currentLocationBtn}
                  onPress={setCurrentLocationAsOrigin}
                >
            <Text>📍</Text>
          </TouchableOpacity>
        </View>
              {originSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {originSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => selectOrigin(item)}
                    >
                      <Text style={styles.suggestionText}>{item.display_name}</Text>
            </TouchableOpacity>
                  ))}
                </View>
              )}
              {origin && (
                <Text style={styles.coordinates}>
                  {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.pointRow}>
            <Text style={styles.pointIcon}>📍</Text>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Destination</Text>
              <View style={styles.searchContainer}>
          <TextInput
                  style={styles.searchInput}
                  placeholder="Search location..."
                  value={destinationName}
            onChangeText={handleDestinationInput}
          />
        </View>
              {destinationSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {destinationSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => selectDestination(item)}
                    >
                      <Text style={styles.suggestionText}>{item.display_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {destination && (
                <Text style={styles.coordinates}>
                  {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.distanceRow}>
            {calculatedDistance !== null ? (
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Direct Distance</Text>
                <Text style={styles.distanceValue}>
                  {calculatedDistance} km
                </Text>
              </View>
            ) : (
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Click calculate to see distance</Text>
              </View>
            )}
            <TouchableOpacity 
              style={[
                styles.calculateButton,
                calculatedDistance !== null && styles.recalculateButton
              ]}
              onPress={calculateRouteDistance}
            >
              <Text style={styles.calculateButtonText}>
                {calculatedDistance !== null ? 'Recalculate' : 'Calculate Route'}
              </Text>
            </TouchableOpacity>
          </View>

          {origin && destination && (
            <TouchableOpacity 
              style={styles.startRouteButton}
              onPress={() => router.push('/update')}
            >
              <Ionicons name="navigate" size={24} color="white" />
              <Text style={styles.startRouteText}>Start Route</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          style={{ height: DEVICE_HEIGHT * 0.5 }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          nestedScrollEnabled
          onMessage={onWebViewMessage}
        />
        <TouchableOpacity style={styles.fullscreenBtn} onPress={() => setMapFullScreen(true)}>
          <Text style={{ fontSize: 16 }}>⛶</Text>
        </TouchableOpacity>
      </View>

      {routeInfo.distance && routeInfo.duration && (
        <View style={styles.estimationBox}>
          <Text style={styles.estimationTitle}>Route Estimation</Text>
          <View style={styles.estimationContent}>
            <View style={styles.estimationItem}>
              <Text style={styles.estimationLabel}>Starting Point:</Text>
              <Text style={styles.estimationValue}>{originName}</Text>
            </View>
            <View style={styles.estimationItem}>
              <Text style={styles.estimationLabel}>Destination:</Text>
              <Text style={styles.estimationValue}>{destinationName}</Text>
            </View>
            <View style={styles.estimationDivider} />
            <View style={styles.estimationItem}>
              <Text style={styles.estimationLabel}>Total Distance:</Text>
              <Text style={styles.estimationDistance}>{routeInfo.distance} kilometers</Text>
            </View>
            <View style={styles.estimationItem}>
              <Text style={styles.estimationLabel}>Estimated Time:</Text>
              <Text style={styles.estimationTime}>{routeInfo.duration} minutes</Text>
            </View>
            <View style={styles.estimationItem}>
              <Text style={styles.estimationLabel}>Estimated Arrival:</Text>
              <Text style={styles.estimationTime}>{routeInfo.estimatedArrival}</Text>
            </View>
          </View>
        </View>
      )}

      {showInstructions && routeInfo.instructions && routeInfo.instructions.length > 0 && (
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsHeader}>
            <Text style={styles.instructionsTitle}>Route Instructions</Text>
            <View style={styles.routeStats}>
              <Text style={styles.routeStat}>🕒 {routeInfo.duration} mins</Text>
              <Text style={styles.routeStat}>📍 {routeInfo.distance} km</Text>
              <Text style={styles.routeStat}>🏁 {routeInfo.estimatedArrival}</Text>
        </View>
      </View>

          <ScrollView 
            style={styles.instructionsList}
            contentContainerStyle={styles.instructionsListContent}
          >
            {routeInfo.instructions.map((instruction) => (
              <View key={instruction.id} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{instruction.id}</Text>
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionText}>{instruction.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Modal visible={mapFullScreen} animationType="slide">
        <View style={styles.fullscreenWrapper}>
          <WebView
            source={{ html: leafletHtml }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            ref={webviewRef}
            style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
            onMessage={onWebViewMessage}
          />
          <TouchableOpacity style={styles.exitFullscreenBtn} onPress={() => setMapFullScreen(false)}>
            <Text style={{ fontSize: 16, color: '#fff' }}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={selectedTab === 'alangilan' ? styles.activeTab : styles.inactiveTab} onPress={() => setSelectedTab('alangilan')}>
          <Text style={selectedTab === 'alangilan' ? styles.tabText : styles.tabTextGray}>Alangilan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={selectedTab === 'possibleRoutes' ? styles.activeTab : styles.inactiveTab} onPress={() => setSelectedTab('possibleRoutes')}>
          <Text style={selectedTab === 'possibleRoutes' ? styles.tabText : styles.tabTextGray}>Possible Routes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stopList}>
        {stopsToShow.map((stop, index) => (
          <View key={index} style={styles.stopItem}>
            <Text style={styles.stopIcon}>🛑</Text>
            <Text style={styles.stopName}>{stop.name}</Text>
            {stop.time && <Text style={styles.stopTime}>{stop.time}</Text>}
          </View>
        ))}
      </View>

      <Modal
        visible={showLocationOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLocationOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location Type</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLocationSelect('origin')}>
              <Text style={styles.modalButtonText}>Set as Starting Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleLocationSelect('destination')}>
              <Text style={styles.modalButtonText}>Set as Destination</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLocationOptions(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom for better scrolling
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backArrow: { fontSize: 20, marginRight: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  mapContainer: { 
    height: 300, // Reduced height to show more content
    borderRadius: 15, 
    overflow: 'hidden', 
    marginBottom: 20 
  },
  fullscreenBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', padding: 6, borderRadius: 6, zIndex: 10 },
  fullscreenWrapper: { flex: 1, backgroundColor: '#000' },
  exitFullscreenBtn: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 20 },
  tabContainer: { flexDirection: 'row', marginVertical: 10 },
  activeTab: { flex: 1, padding: 10, backgroundColor: '#007bff', borderRadius: 10, marginRight: 5 },
  inactiveTab: { flex: 1, padding: 10, backgroundColor: '#ccc', borderRadius: 10, marginLeft: 5 },
  tabText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  tabTextGray: { color: '#333', textAlign: 'center', fontWeight: 'bold' },
  stopList: { marginTop: 10 },
  stopItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stopIcon: { marginRight: 8 },
  stopName: { flex: 1 },
  stopTime: { color: 'gray' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  estimationBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estimationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  estimationContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  estimationItem: {
    marginBottom: 10,
  },
  estimationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  estimationValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  estimationDistance: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  estimationTime: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  estimationDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  instructionsHeader: {
    backgroundColor: '#007bff',
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
  },
  routeStat: {
    color: '#fff',
    fontSize: 14,
  },
  instructionsList: {
    maxHeight: 300,
  },
  instructionsListContent: {
    padding: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    backgroundColor: '#007bff',
    color: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  distanceDetailsContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distanceHeader: {
    backgroundColor: '#007bff',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  distanceHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pointDetails: {
    padding: 16,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pointInfo: {
    flex: 1,
  },
  pointLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  distanceInfo: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recalculateButton: {
    backgroundColor: '#0056b3',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  currentLocationBtn: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 4,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  startRouteButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startRouteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
