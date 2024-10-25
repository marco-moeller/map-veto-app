import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toCamelCase } from "../nameConversion";
import { addLobbyToDatabase } from "../database/functions";
import useSnapshot from "../hooks/useSnapshot";
import { nanoid } from "nanoid";
import ChosenMapsBo3 from "../components/ChosenMapsBo3";
import ChosenMapsBo1 from "../components/ChosenMapsBo1";
import ChosenMapsBoX from "../components/ChosenMapsBoX";

function Lobby() {
  const { id } = useParams();
  const location = useLocation();

  const navigate = useNavigate();

  const { lobby } = useSnapshot(id);

  const [selectedPlayer, setSelectedPlayer] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const vetoOrPick = () => {
    return Number(lobby.matchType[2]) + lobby.vetoedMaps.length <
      lobby.maps.length
      ? "veto"
      : "pick";
  };

  const isVetoedMap = (map) => {
    return lobby.vetoedMaps.some((mapObject) => mapObject.map === map);
  };

  const isSelectedMap = (map) => {
    return lobby.selectedMaps.some((mapObject) => mapObject.map === map);
  };

  const isStartingMap = (map) => {
    return lobby.startingMap === map;
  };

  const vetoesAreDone = () => {
    return (
      lobby.vetoedMaps.length + lobby.selectedMaps.length + 1 ===
      lobby.maps.length
    );
  };

  const getMapStyle = (map) => {
    if (isVetoedMap(map)) return "grey";
    if (isSelectedMap(map)) return "green-border";
    if (isStartingMap(map)) return "orange-border";
    return "";
  };

  const getYouOrOpponent = (player) => {
    return player == selectedPlayer ? "You" : "Opponent";
  };

  const handleMapClick = async (map) => {
    if (lobby.activePlayer !== selectedPlayer) {
      return;
    }

    if (isVetoedMap(map) || isSelectedMap(map) || isStartingMap(map)) return;

    if (
      lobby.selectedMaps.length + lobby.vetoedMaps.length + 1 >=
        lobby.maps.length ||
      (lobby.startingMap !== "" &&
        lobby.selectedMaps.length + lobby.vetoedMaps.length >=
          lobby.maps.length)
    ) {
      return;
    }

    if (
      Number(lobby.matchType[2]) + lobby.vetoedMaps.length <
      lobby.maps.length
    )
      await vetoMap(map);

    if (
      Number(lobby.matchType[2]) + lobby.vetoedMaps.length >=
      lobby.maps.length
    )
      await pickMap(map);
  };

  const getNextPlayer = () => {
    const actions = lobby.vetoedMaps.length + lobby.selectedMaps.length;
    const index = actions % lobby.vetoSystem.length;
    if (lobby.vetoSystem[index + 1] === undefined) {
      return lobby.vetoSystem[0];
    }

    return lobby.vetoSystem[index + 1];
  };

  const vetoMap = async (map) => {
    await addLobbyToDatabase({
      ...lobby,
      activePlayer: getNextPlayer(),
      vetoedMaps: [...lobby.vetoedMaps, { player: selectedPlayer, map: map }]
    });
  };

  const pickMap = async (map) => {
    await addLobbyToDatabase({
      ...lobby,
      activePlayer: getNextPlayer(),
      selectedMaps: [
        ...lobby.selectedMaps,
        { player: selectedPlayer, map: map }
      ]
    });
  };

  const pickStartingMap = async () => {
    await addLobbyToDatabase({
      ...lobby,
      startingMap: lobby.maps.filter(
        (map) => !isSelectedMap(map) && !isVetoedMap(map)
      )[0]
    });
    if (lobby.vetoSystem === "ABBAABBA") {
    }
  };

  useEffect(() => {
    if (!lobby) {
      return;
    }
    const updateStartingMap = async () => {
      if (lobby.startingMap !== "") return;

      if (
        lobby.selectedMaps.length + lobby.vetoedMaps.length + 1 >=
        lobby.maps.length
      ) {
        await pickStartingMap();
      } else return;
    };
    updateStartingMap();
  }, [lobby?.selectedMaps]);

  useEffect(() => {
    const getSelectedPlayer = () => {
      if (location.state?.selectedPlayer) setSelectedPlayer(lobby.host);
      if (!location.state?.selectedPlayer)
        setSelectedPlayer(lobby.host === "A" ? "B" : "A");
    };

    if (!lobby) {
      return;
    }
    getSelectedPlayer();
  }, [lobby]);

  if (!lobby) return;

  return (
    <main className="lobby">
      <button onClick={() => navigate("/")} className="back-home-btn">
        HOME
      </button>
      <button onClick={copyToClipboard} className="lobby-id-copy">
        COPY THIS LOBBY LINK AND SEND IT TO YOUR OPPONENT
      </button>
      <h1>
        This match will be a {lobby.matchType} following the "{lobby.vetoSystem}
        " veto pattern. Do your vetoes and map picks below.
      </h1>
      {!vetoesAreDone() && (
        <>
          <h2>
            Hello! You are Player {selectedPlayer}, so
            {selectedPlayer === "A" ? " you go first." : " you go second."}
          </h2>

          <h2>
            {lobby.activePlayer === selectedPlayer
              ? `Your turn to ${vetoOrPick()}`
              : `Wait for your opponents ${vetoOrPick()}`}
          </h2>
        </>
      )}
      {vetoesAreDone() && <h2>Vetoes are done - GL & HF</h2>}
      <div className="maps">
        {lobby.maps?.map((map) => (
          <div
            className="map"
            onClick={() => handleMapClick(map)}
            key={nanoid()}
          >
            <img
              src={`../${toCamelCase(map)}.jpg`}
              alt="map"
              className={"map-img " + getMapStyle(map)}
            />
            {isVetoedMap(map) && (
              <p className="vetoed-by">
                {getYouOrOpponent(
                  lobby.vetoedMaps.find((mapObject) => mapObject.map === map)
                    .player
                )}
              </p>
            )}
            {isSelectedMap(map) && (
              <p className="vetoed-by">
                {getYouOrOpponent(
                  lobby.selectedMaps.find((mapObject) => mapObject.map === map)
                    .player
                )}
              </p>
            )}
            <p>{map}</p>
          </div>
        ))}
      </div>
      <div className="divider" />
      {lobby.matchType === "Bo1" && lobby.startingMap !== "" && (
        <ChosenMapsBo1 startingMap={lobby.startingMap} />
      )}
      {lobby.startingMap !== "" && lobby.matchType === "Bo3" && (
        <ChosenMapsBo3
          selectedMaps={lobby.selectedMaps}
          startingMap={lobby.startingMap}
          selectedPlayer={selectedPlayer}
        />
      )}
      {lobby.startingMap !== "" &&
        lobby.matchType !== "Bo3" &&
        lobby.matchType !== "Bo1" && (
          <ChosenMapsBoX
            selectedMaps={lobby.selectedMaps}
            startingMap={lobby.startingMap}
            selectedPlayer={selectedPlayer}
          />
        )}
    </main>
  );
}

export default Lobby;
