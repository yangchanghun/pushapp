// import { useState } from "react";
import "./App.css";
// import items from "./data/item.json";
// import { ListItem } from "./components/ListItem";
// import type { Item } from "./types/Item";
// import ListItemSkeleton from "./components/ListItemSkeleton";
// import ListItem from "./components/ListItem";
import SpaceBackground from "./components/SpaceBackground";
import Header from "./components/Headers";
// import ChattingRoom from "./page/ChattingRoom";
// import ChattingSecondRoom from "./page/ChattingSecondRoom";
import ChatRoom from "./ChatTest";
import { Routes, Route } from "react-router-dom";
import AcceptRejectPage from "./AcceptRejectPage";
function App() {
  // const [loading, setLoading] = useState(false);

  // const itemList: Item[] = items;

  return (
    <>
      <Header />
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-7xl mx-auto pt-12"> */}
      <div>
        <SpaceBackground />
        {/* {loading
          ? Array.from({ length: 9 }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))
          : itemList.map((item) => {
              return <ListItem item={item} />;
            })} */}
        {/* <ChattingRoom /> */}
        <Routes>
          <Route path="/:userId" element={<ChatRoom />} />
          <Route path="/acceptreject/:token" element={<AcceptRejectPage />} />
        </Routes>
        {/* <ChattingSecondRoom /> */}
      </div>
    </>
  );
}

export default App;
