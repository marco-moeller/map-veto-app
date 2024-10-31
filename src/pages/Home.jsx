import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVisibilityToggle from "../hooks/useVisibilityToggle";
import LobbyCreation from "../components/LobbyCreation";
import Modal from "../components/Modal/Modal";

function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState("A");

  const { isShowing, toggle } = useVisibilityToggle();

  const getPlayerBtnBg = (player) => {
    return player === selectedPlayer ? "bg-orange" : "bg-white";
  };

  const handleCreateLobby = () => {
    toggle();
  };

  return (
    <main className="home">
      <h1>Welcome! Create A Veto Lobby Below</h1>

      <h2>Player A starts the veto process, which player are you?</h2>
      <div className="radio">
        <button
          type="button"
          className={getPlayerBtnBg("A") + " btn"}
          onClick={() => setSelectedPlayer("A")}
        >
          Player A
        </button>
        <button
          type="button"
          className={getPlayerBtnBg("B") + " btn"}
          onClick={() => setSelectedPlayer("B")}
        >
          Player B
        </button>
      </div>
      <button className="create-lobby-btn" onClick={handleCreateLobby}>
        Create A Veto Lobby
      </button>
      {isShowing && (
        <Modal>
          <LobbyCreation toggle={toggle} selectedPlayer={selectedPlayer} />
        </Modal>
      )}
    </main>
  );
}

export default Home;
