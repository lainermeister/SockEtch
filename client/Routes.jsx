import React from "react";
import StartPrompt from "./views/StartPrompt";
import Disconnected from "./views/Disconnected";
import ChooseCategory from "./views/ChooseCategory";
import DrawView from "./views/DrawView";
import GuessView from "./views/GuessView";
import GameEnd from "./views/GameEnd";

const Routes = ({
  game,
  emit,
  disconnected,
  isDrawer,
  wasDrawer,
  joinError,
  setJoinError
}) => {
  if (!game) {
    return (
      <StartPrompt
        startSocket={emit.start}
        joinError={joinError}
        setJoinError={setJoinError}
      />
    );
  } else if (disconnected) {
    return <Disconnected />;
  } else if (game.state === "choosingCategory") {
    return (
      <ChooseCategory
        chooseWord={emit.chooseWord}
        categories={game.categories}
        isDrawer={isDrawer}
        drawerName={game.drawer.current.name}
      />
    );
  } else if (game.state === "playing") {
    if (isDrawer) {
      return <DrawView game={game} emit={emit} />;
    } else {
      return (
        <GuessView
          game={game}
          emit={emit}
          drawerName={game.drawer.current.name}
        />
      );
    }
  } else {
    return (
      <GameEnd
        emit={emit}
        isDrawer={isDrawer}
        wasDrawer={wasDrawer}
        drawerName={game.drawer.current.name}
      />
    );
  }
};

export default Routes;
