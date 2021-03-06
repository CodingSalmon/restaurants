import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(cities)"] }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
}

function SearchLocationInput({citySearchTerm, setCitySearchTerm}) {
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
      () => handleScriptLoad(setCitySearchTerm, autoCompleteRef)
    );
  }, []);

  return (
    <input
    ref={autoCompleteRef}
    onChange={(event) => setCitySearchTerm(event.target.value)}
    placeholder="Enter a City"
    value={citySearchTerm}
    />
  );
}

export default SearchLocationInput;