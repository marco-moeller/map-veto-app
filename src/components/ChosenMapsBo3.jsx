import { toCamelCase } from "../nameConversion";

function ChosenMapsBo3({ selectedMaps = [], startingMap, selectedPlayer }) {
  const playerHasNotChosenAMap = () => {
    return (
      selectedMaps.find((mapObject) => mapObject.player === selectedPlayer) ===
      undefined
    );
  };

  const opponentHasNotChosenAMap = () => {
    return (
      selectedMaps.find((mapObject) => mapObject.player !== selectedPlayer) ===
      undefined
    );
  };

  return (
    <div className="chosen-maps">
      {" "}
      {!playerHasNotChosenAMap() && (
        <div className="map">
          <h3>Your Map</h3>
          <img
            src={`../${toCamelCase(
              selectedMaps.find(
                (mapObject) => mapObject.player === selectedPlayer
              )?.map
            )}.jpg`}
            alt="map"
            className="map-img"
          />
          <p>
            {
              selectedMaps.find(
                (mapObject) => mapObject.player === selectedPlayer
              )?.map
            }
          </p>
        </div>
      )}
      <div className="map">
        <h3>Starting Map</h3>
        <img
          src={`../${toCamelCase(startingMap)}.jpg`}
          alt="map"
          className="map-img"
        />
        <p>{startingMap}</p>
      </div>
      {!opponentHasNotChosenAMap() && (
        <div className="map">
          <h3>Opponents Map</h3>
          <img
            src={`../${toCamelCase(
              selectedMaps.find(
                (mapObject) => mapObject.player !== selectedPlayer
              )?.map
            )}.jpg`}
            alt="map"
            className="map-img"
          />
          <p>
            {
              selectedMaps.find(
                (mapObject) => mapObject.player !== selectedPlayer
              )?.map
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default ChosenMapsBo3;
