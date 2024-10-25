import { useEffect, useState } from "react";
import { database } from "../database/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getLobbyFromDatabase } from "../database/functions";

function useSnapshot(id) {
  const [lobby, setLobby] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(database, "lobbies", id), (snapshot) => {
      const newLobby = snapshot.data();
      setLobby(newLobby);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const findLobby = async () => {
      const lobby = await getLobbyFromDatabase(id);
      setLobby(lobby);
    };
    findLobby();
  }, []);

  return { lobby };
}

export default useSnapshot;
