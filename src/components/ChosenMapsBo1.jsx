import { toCamelCase } from "../nameConversion";

function ChosenMapsBo1({ startingMap }) {
  return (
    <div className="chosen-maps">
      <div className="map">
        <h3>Chosen Map</h3>
        <img
          src={`../${toCamelCase(startingMap)}.jpg`}
          alt="map"
          className="map-img"
        />
        <p>{startingMap}</p>
      </div>
    </div>
  );
}

export default ChosenMapsBo1;
