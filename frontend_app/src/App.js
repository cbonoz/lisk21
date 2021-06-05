import React, { Fragment, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Switch,
  Route,
} from "react-router-dom";
import { Link, capitalize } from "@material-ui/core";
import * as api from "./api";
import { NodeInfoContext, nodeInfoContextDefaultValue } from "./context";

import HomePage from "./components/HomePage";
import TransactionsPage from "./components/TransactionsPage";
import AccountPage from "./components/AccountPage";
import CreateAccountDialog from "./components/dialogs/CreateAccountDialog";
import TransferFundsDialog from "./components/dialogs/TransferFundsDialog";
import CreateNFTTokenDialog from "./components/dialogs/CreateNFTTokenDialog";
import { Menu, Layout } from "antd";
import Discover from "./components/Discover";
import Access from "./components/Access";
import SellStream from "./components/SellStream";
import logo from "./assets/logo.png";

import "antd/dist/antd.css";
import "./App.css";

const { Header, Footer, Content } = Layout;

const ROUTES = ["search", "sell", "access", "transactions"];

function App() {
  const [nodeInfoState, updateNodeInfoState] = useState(
    nodeInfoContextDefaultValue
  );
  const [openDialog, setOpenDialog] = useState(null);
  const [route, setRoute] = useState();
  useEffect(() => {
    const newRoute = window.location.pathname;
    console.log("route", newRoute);
    setRoute(newRoute);
  }, [setRoute]);

  const updateHeight = async () => {
    const info = await api.fetchNodeInfo();

    updateNodeInfoState({
      networkIdentifier: info.networkIdentifier,
      minFeePerByte: info.genesisConfig.minFeePerByte,
      height: info.height,
    });
  };

  useEffect(() => {
    async function fetchData() {
      const info = await api.fetchNodeInfo();
      updateNodeInfoState({
        networkIdentifier: info.networkIdentifier,
        minFeePerByte: info.genesisConfig.minFeePerByte,
        height: info.height,
      });
      setInterval(updateHeight, 1000);
    }
    fetchData();
  }, []);

  return (
    <Fragment>
      <NodeInfoContext.Provider value={nodeInfoState}>
        <Router>
          <Layout>
            <Header>
              <Menu
                // style={{ textAlign: "center" }}
                selectedKeys={[route]}
                mode="horizontal"
              >
                <Menu.Item key="/">
                  <img src={logo} className="header-logo" />
                </Menu.Item>
                {ROUTES.map((r) => {
                  const link = `/${r}`;
                  return (
                    <Menu.Item key={link}>
                      <Link
                        onClick={() => {
                          setRoute(link);
                        }}
                        to={link}
                      >
                        {capitalize(r)}
                      </Link>
                    </Menu.Item>
                  );
                })}
                <Menu.Item
                  key="/transfer"
                  onClick={() => setOpenDialog("TransferFundsDialog")}
                >
                  Transfer
                </Menu.Item>
                <Menu.Item
                  key="/account"
                  onClick={() => setOpenDialog("CreateAccountDialog")}
                >
                  Account
                </Menu.Item>
                <Menu.Item
                  key="/create"
                  onClick={() => setOpenDialog("CreateNFTTokenDialog")}
                >
                  NFT
                </Menu.Item>
                <Link to={"/search"}>Search</Link>
              </Menu>
            </Header>
            <Content>
              <Switch>
                <Route path="/" exact>
                  <HomePage />
                </Route>
                <Route path="/search" exact component={Discover} />
                <Route path="/sell" exact component={SellStream} />
                <Route path="/access" exact component={Access} />

                <Route path="/accounts/:address" component={AccountPage} />
                <Route path="/transactions" component={TransactionsPage} />
              </Switch>
            </Content>
            <Footer></Footer>
          </Layout>

          <CreateNFTTokenDialog
            open={openDialog === "CreateNFTTokenDialog"}
            handleClose={() => {
              setOpenDialog(null);
            }}
          />

          <CreateAccountDialog
            open={openDialog === "CreateAccountDialog"}
            handleClose={() => {
              setOpenDialog(null);
            }}
          />

          <TransferFundsDialog
            open={openDialog === "TransferFundsDialog"}
            handleClose={() => {
              setOpenDialog(null);
            }}
          />
        </Router>
      </NodeInfoContext.Provider>
    </Fragment>
  );
}

export default App;
