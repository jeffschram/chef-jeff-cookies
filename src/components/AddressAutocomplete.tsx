import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  padding: 0.75rem;
  width: 100%;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;

  &:focus {
    border-color: var(--text-1);
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 2px solid var(--text-1);
  border-top: none;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--shadow);
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--surface-1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const DeliveryStatus = styled.div<{ $isInRange: boolean }>`
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  background-color: ${(props) => (props.$isInRange ? "#e8f5e9" : "#ffebee")};
  color: ${(props) => (props.$isInRange ? "#2e7d32" : "#c62828")};
  border: 2px solid ${(props) => (props.$isInRange ? "#4caf50" : "#ef5350")};
`;

const DistanceText = styled.span`
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
  opacity: 0.9;
`;

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onDeliveryStatusChange?: (isInRange: boolean | null) => void;
  placeholder?: string;
  required?: boolean;
}

interface Suggestion {
  placeId: string;
  description: string;
}

const HOME_ADDRESS = "73 Harbor Drive, Stamford, CT 06902";
const DELIVERY_RADIUS_MILES = 7.5;

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onDeliveryStatusChange,
  placeholder = "Enter your full delivery address",
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(true);
  const [error, setError] = useState<string>("");
  const [deliveryStatus, setDeliveryStatus] = useState<{
    distance: number;
    isInRange: boolean;
  } | null>(null);
  const sessionTokenRef = useRef<string>();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError(
        "Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file."
      );
      setIsLoadingAPI(false);
      return;
    }

    // Load the Google Maps script dynamically
    const loadGoogleMaps = async () => {
      try {
        // Check if already loaded
        if (window.google?.maps?.places) {
          setIsLoadingAPI(false);
          setError("");
          // Generate a new session token
          sessionTokenRef.current = crypto.randomUUID();
          return;
        }

        // Load script if not already loaded
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          // Wait for google.maps.places to be available
          const checkGoogleMapsReady = () => {
            if (window.google?.maps?.places) {
              setIsLoadingAPI(false);
              setError("");
              // Generate a new session token
              sessionTokenRef.current = crypto.randomUUID();
            } else {
              // Check again after a short delay
              setTimeout(checkGoogleMapsReady, 100);
            }
          };
          checkGoogleMapsReady();
        };

        script.onerror = () => {
          console.error("Error loading Google Maps");
          setError("Failed to load Google Maps. Please try again later.");
          setIsLoadingAPI(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("Error loading Google Maps:", err);
        setError("Failed to load Google Maps. Please try again later.");
        setIsLoadingAPI(false);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Clear delivery status when user starts typing again
    setDeliveryStatus(null);
    onDeliveryStatusChange?.(null);

    if (!inputValue || isLoadingAPI || !window.google?.maps?.places) {
      setSuggestions([]);
      return;
    }

    try {
      // Use the Autocomplete Service to get predictions
      const service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: "us" },
          types: ["address"],
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(
              predictions.map((p) => ({
                placeId: p.place_id,
                description: p.description,
              }))
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    } catch (err) {
      console.error("Error getting predictions:", err);
      setSuggestions([]);
    }
  };

  const calculateDistance = async (destinationAddress: string) => {
    if (!window.google?.maps) return;

    try {
      const service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [HOME_ADDRESS],
          destinations: [destinationAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            const result = response.rows[0]?.elements[0];

            if (result?.status === google.maps.DistanceMatrixElementStatus.OK) {
              // Distance is in meters, convert to miles
              const distanceInMiles = result.distance.value / 1609.34;
              const isInRange = distanceInMiles <= DELIVERY_RADIUS_MILES;

              setDeliveryStatus({
                distance: Math.round(distanceInMiles * 10) / 10, // Round to 1 decimal
                isInRange,
              });
              onDeliveryStatusChange?.(isInRange);
            } else {
              setDeliveryStatus(null);
              setError("Unable to calculate distance for this address.");
            }
          } else {
            setDeliveryStatus(null);
            setError("Unable to calculate distance. Please try again.");
          }
        }
      );
    } catch (err) {
      console.error("Error calculating distance:", err);
      setDeliveryStatus(null);
      setError("Unable to calculate distance.");
    }
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    // Just use the description directly - this avoids needing PlacesService
    onChange(suggestion.description);
    setSuggestions([]);
    // Generate a new session token for the next search
    sessionTokenRef.current = crypto.randomUUID();

    // Calculate distance from home address
    await calculateDistance(suggestion.description);
  };

  return (
    <InputWrapper>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={isLoadingAPI}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.placeId}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      {deliveryStatus && (
        <DeliveryStatus $isInRange={deliveryStatus.isInRange}>
          {deliveryStatus.isInRange ? (
            <>
              ✓ Yes - This address is within our delivery area
              <DistanceText>
                Distance: {deliveryStatus.distance} miles from our location
              </DistanceText>
            </>
          ) : (
            <>
              ⚠️ Address Outside Delivery Area
              <DistanceText>
                This address is outside our delivery zone. Please select the
                "Pickup" option to continue with your order.
              </DistanceText>
              <DistanceText style={{ marginTop: "0.25rem" }}>
                Distance: {deliveryStatus.distance} miles (delivery available
                within {DELIVERY_RADIUS_MILES} miles)
              </DistanceText>
            </>
          )}
        </DeliveryStatus>
      )}
    </InputWrapper>
  );
};

export default AddressAutocomplete;
