import { toCamelCase } from "../nameConversion";

function ChosenMapsBoX({ selectedMaps, startingMap, selectedPlayer }) {
  console.log("BO3");

  return (
    <div className="chosen-maps">
      {" "}
      <div className="map">
        <h3>Your Maps</h3>
        {selectedMaps
          .filter((mapObject) => mapObject.player === selectedPlayer)
          .map((selectedMap) => (
            <div>
              <img
                src={`../${toCamelCase(selectedMap.map)}.jpg`}
                alt="map"
                className="map-img"
              />
              <p>{selectedMap.map}</p>
            </div>
          ))}
      </div>
      <div className="map">
        <h3>Starting Map</h3>
        <img
          src={`../${toCamelCase(startingMap)}.jpg`}
          alt="map"
          className="map-img"
        />
        <p>{startingMap}</p>
      </div>
      <div className="map">
        <h3>Opponents Maps</h3>
        {selectedMaps
          .filter((mapObject) => mapObject.player !== selectedPlayer)
          .map((selectedMap) => (
            <div>
              <img
                src={`../${toCamelCase(selectedMap.map)}.jpg`}
                alt="map"
                className="map-img"
              />
              <p>{selectedMap.map}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChosenMapsBoX;
