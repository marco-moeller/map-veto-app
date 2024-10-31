import { useState } from "react";
import { addLobbyToDatabase } from "../database/functions";
import { nanoid } from "nanoid";
import {
  GNLMaps,
  DACHInfernoMaps,
  W3CMaps,
  AllCompetitiveMaps,
  MasterLeagueMaps
} from "../maps";
import { toCamelCase } from "../nameConversion";
import { CiSquarePlus } from "react-icons/ci";
import useVisibilityToggle from "../hooks/useVisibilityToggle";
import { MdDeleteOutline } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";

function LobbyCreation({ toggle, selectedPlayer }) {
  const [defaultMaps, setDefaultMaps] = useState(GNLMaps);

  // lobby = {id: id, activePlayer: "A"||"B", maps: [...maps], matchType: "bo3"||"bo5"||... , vetoSystem: "ABABAB", "ABBAABBAA", startingMap: "startingMap" }
  const [lobbyOptions, setLobbyOptions] = useState({
    maps: [...defaultMaps],
    matchType: "Bo3",
    // "ABBAABBA" or "ABABAB"
    vetoSystem: "ABABAB",
    startingMap: "",
    // {player: A or B, map: "string"}
    vetoedMaps: [],
    //{player: A or B, map: "string"}
    selectedMaps: [],
    host: selectedPlayer
  });

  const navigate = useNavigate();

  const { isShowing, toggle: toggleStartingMapMenu } = useVisibilityToggle();

  const handleCreateLobby = () => {
    const ID = nanoid();
    try {
      addLobbyToDatabase({ ...lobbyOptions, id: ID, activePlayer: "A" });
      toggle();
      navigate(`lobby/${ID}`, {
        state: { selectedPlayer: selectedPlayer }
      });
    } catch (error) {}
  };

  const getMatchTypeBtnBg = (id) => {
    return id === lobbyOptions.matchType ? "bg-orange" : "bg-white";
  };

  const getVetoSystemBtnBg = (id) => {
    return id === lobbyOptions.vetoSystem ? "bg-orange" : "bg-white";
  };

  const setVetoSystem = (vetoSystem) => {
    setLobbyOptions((prevState) => ({ ...prevState, vetoSystem: vetoSystem }));
  };

  const setMatchType = (matchType) => {
    setLobbyOptions((prevState) => ({ ...prevState, matchType: matchType }));
  };

  const setStartingMap = (map) => {
    setLobbyOptions((prevState) => ({ ...prevState, startingMap: map }));
  };

  const removeStartingMap = () => {
    setLobbyOptions((prevState) => ({ ...prevState, startingMap: "" }));
    toggleStartingMapMenu();
  };

  const toggleMapFromMapPool = (map) => {
    if (isStartingMap(map) && lobbyOptions.maps.includes(map)) {
      setLobbyOptions((prevState) => ({
        ...prevState,
        maps: prevState.maps.filter((item) => item !== map),
        startingMap: ""
      }));
    }

    if (lobbyOptions.maps.includes(map))
      setLobbyOptions((prevState) => ({
        ...prevState,
        maps: prevState.maps.filter((item) => item !== map)
      }));
    else
      setLobbyOptions((prevState) => ({
        ...prevState,
        maps: [...prevState.maps, map]
      }));
  };

  const handleMapPoolChange = (mapPool) => {
    setLobbyOptions((prevState) => ({
      ...prevState,
      maps: [...mapPool],
      startingMap: ""
    }));
    setDefaultMaps(mapPool);
  };

  const getMapPoolBtnBg = (mapPool) => {
    return JSON.stringify(mapPool) === JSON.stringify(defaultMaps)
      ? "bg-orange"
      : "bg-white";
  };

  const hasChosenEnoughMaps = () => {
    return lobbyOptions.matchType[2] <= lobbyOptions.maps.length;
  };

  const hasChosenUnevenNumberOfMaps = () => {
    return lobbyOptions.maps.length % 2 !== 0;
  };

  const isStartingMap = (map) => {
    return map === lobbyOptions.startingMap;
  };

  return (
    <div className="lobby-creation">
      <button className="close--btn" onClick={toggle}>
        <ImCross />
      </button>
      <h3>Map Pool</h3>
      <div className="map-pool-selection">
        <button
          type="button"
          className={getMapPoolBtnBg(GNLMaps) + " btn"}
          onClick={() => handleMapPoolChange(GNLMaps)}
        >
          GNL
        </button>
        <button
          type="button"
          className={getMapPoolBtnBg(MasterLeagueMaps) + " btn"}
          onClick={() => handleMapPoolChange(MasterLeagueMaps)}
        >
          M4ster League
        </button>

        <button
          type="button"
          className={getMapPoolBtnBg(DACHInfernoMaps) + " btn"}
          onClick={() => handleMapPoolChange(DACHInfernoMaps)}
        >
          DACH Inferno
        </button>
        <button
          type="button"
          className={getMapPoolBtnBg(W3CMaps) + " btn"}
          onClick={() => handleMapPoolChange(W3CMaps)}
        >
          W3Champions
        </button>
        <button
          type="button"
          className={getMapPoolBtnBg(AllCompetitiveMaps) + " btn"}
          onClick={() => handleMapPoolChange(AllCompetitiveMaps)}
        >
          All Maps
        </button>
      </div>
      <h3 className="chose-maps-heading">
        Choose At Least{" "}
        <span className={hasChosenEnoughMaps() ? "" : "orange"}>
          {lobbyOptions.matchType[2]}
        </span>{" "}
        Maps. The number of maps must be{" "}
        <span className={hasChosenUnevenNumberOfMaps() ? "" : "orange"}>
          uneven
        </span>{" "}
        (
        <span className={hasChosenEnoughMaps() ? "" : "orange"}>
          {lobbyOptions.maps.length} Maps Chosen
        </span>
        )
      </h3>
      <div className="maps">
        {defaultMaps.map((map) => (
          <div className="map" key={nanoid()}>
            <img
              src={`../${toCamelCase(map)}.jpg`}
              alt="map"
              className={`map-img-s ${
                lobbyOptions.maps.includes(map) ? " " : " grey"
              }`}
              onClick={() => toggleMapFromMapPool(map)}
            />
            <p>{map}</p>
          </div>
        ))}
      </div>
      <h3>Starting Map (Optional)</h3>
      <div className="starting-map">
        {!isShowing && lobbyOptions.startingMap === "" && (
          <CiSquarePlus onClick={toggleStartingMapMenu} />
        )}
        {!isShowing && lobbyOptions.startingMap !== "" && (
          <div className="map">
            <img
              src={`../${toCamelCase(lobbyOptions.startingMap)}.jpg`}
              alt="map"
              className="map-img-ss"
              onClick={toggleStartingMapMenu}
            />
            <p className="small">{lobbyOptions.startingMap}</p>
          </div>
        )}

        {isShowing && (
          <>
            <IoArrowBack
              onClick={toggleStartingMapMenu}
              className="delete-btn"
            />

            {lobbyOptions.startingMap !== "" && (
              <MdDeleteOutline
                onClick={removeStartingMap}
                className="delete-btn"
              />
            )}
            {lobbyOptions.maps.map((map) => (
              <div className="map">
                <img
                  src={`../${toCamelCase(map)}.jpg`}
                  alt="map"
                  className="map-img-ss"
                  onClick={() => {
                    setStartingMap(map);
                    toggleStartingMapMenu();
                  }}
                />
                <p className="small">{map}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <h3>Match Type</h3>
      <div className="match-type">
        <button
          type="button"
          className={getMatchTypeBtnBg("Bo1") + " btn"}
          onClick={() => setMatchType("Bo1")}
        >
          Bo1
        </button>
        <button
          type="button"
          className={getMatchTypeBtnBg("Bo3") + " btn"}
          onClick={() => setMatchType("Bo3")}
        >
          Bo3
        </button>
        <button
          type="button"
          className={getMatchTypeBtnBg("Bo5") + " btn"}
          onClick={() => setMatchType("Bo5")}
        >
          Bo5
        </button>
        <button
          type="button"
          className={getMatchTypeBtnBg("Bo7") + " btn"}
          onClick={() => setMatchType("Bo7")}
        >
          Bo7
        </button>
      </div>
      <h3>Veto System</h3>
      <div className="veto-system">
        <button
          type="button"
          className={getVetoSystemBtnBg("ABABAB") + " btn"}
          onClick={() => setVetoSystem("ABABAB")}
        >
          ABABAB...
        </button>
        <button
          type="button"
          className={getVetoSystemBtnBg("ABBAABBA") + " btn"}
          onClick={() => setVetoSystem("ABBAABBA")}
        >
          ABBAAB...
        </button>
      </div>
      <button
        className="create-lobby-btn"
        onClick={handleCreateLobby}
        disabled={!hasChosenEnoughMaps() || !hasChosenUnevenNumberOfMaps()}
      >
        Create Lobby
      </button>
    </div>
  );
}

export default LobbyCreation;
