import React, { Fragment, useEffect, useState } from "react";
import NFTToken from "../NFTToken";
import Fuse from "fuse.js";
import { Grid } from "@material-ui/core";
import { fetchAllNFTTokens } from "../../api";
import { Input } from "antd";

function HomePage() {
  const [NFTAccounts, setNFTAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) {
      setCards(NFTAccounts);
      return;
    }

    const fuse = new Fuse(NFTAccounts, {
      keys: ["title", "description"],
    });

    const results = fuse.search(query);
    const items = results.map((character) => character.item);
    setCards(items);
  }, [query]);

  useEffect(() => {
    async function fetchData() {
      const accounts = await fetchAllNFTTokens();
      setNFTAccounts(accounts);
      setCards(accounts);
    }
    fetchData();
  }, []);

  return (
    <span className="home-page">
      <div className="centered">
        <h2>Discover Collectibles</h2>
        <Input
          addonBefore={"Search"}
          placeholder="Search collections"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <br />
        <br />
      </div>
      <div className="padding-small"></div>
      <Grid container spacing={4}>
        {cards.map((item) => (
          <Grid item md={4}>
            <NFTToken item={item} key={item.id} />
          </Grid>
        ))}
      </Grid>
    </span>
  );
}

export default HomePage;
