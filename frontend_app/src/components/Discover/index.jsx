import React, { useEffect, useState } from "react";
import { EXAMPLE_CARDS } from "./util";
import StreamCard from "../StreamCard";
import Fuse from "fuse.js";
import Modal from "antd/lib/modal/Modal";
import { Input } from "antd";

function Discover(props) {
  const [cards, setCards] = useState(EXAMPLE_CARDS);
  const [query, setQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState({});

  useEffect(() => {
    if (!query) {
      setCards(EXAMPLE_CARDS);
      return;
    }

    const fuse = new Fuse(cards, {
      keys: ["userName", "title"],
    });

    const results = fuse.search(query);
    const items = results.map((character) => character.item);
    setCards(items);
  }, [query]);

  return (
    <div className="content">
      <h2>Discover Collectibles</h2>
      <Input
        addonBefore={"Search"}
        placeholder="Search NFTs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <br />
      {cards.map((x, i) => {
        return (
          <span key={i}>
            <StreamCard data={x} openTransfer={props.openTransfer} />;
          </span>
        );
      })}
      <Modal
        title="Success"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
      >
        <h5>Purchased item: </h5>
        <p>{purchasedItem.title}</p>
        <p>Access key: {purchasedItem.key}</p>

        <hr />
        <p>Write these down, you will not be shown them again.</p>
      </Modal>
    </div>
  );
}

export default Discover;
