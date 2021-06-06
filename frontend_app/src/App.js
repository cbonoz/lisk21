import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import * as api from "./api";
import { NodeInfoContext, nodeInfoContextDefaultValue } from "./context";

import HomePage from "./components/HomePage";
import TransactionsPage from "./components/TransactionsPage";
import AccountPage from "./components/AccountPage";
import CreateAccountDialog from "./components/dialogs/CreateAccountDialog";
import TransferFundsDialog from "./components/dialogs/TransferFundsDialog";
import { Menu, Layout, Modal } from "antd";
import Access from "./components/Access";
import SellStream from "./components/SellStream";
import logo from "./assets/logo.png";

import "antd/dist/antd.css";
import "./App.css";
import { capitalize } from "./utils";
import PurchaseNFTTokenDialog from "./components/dialogs/PurchaseNFTTokenDialog";
import About from "./components/About";

const { Header, Footer, Content } = Layout;

const ROUTES = ["search", "sell", "access", "transactions"];

function App() {
  const [nodeInfoState, updateNodeInfoState] = useState(
    nodeInfoContextDefaultValue
  );
  const [openDialog, setOpenDialog] = useState(null);
  const [purchasedItem, setPurchasedItem] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const openTransfer = () => setOpenDialog("PurchaseNFTTokenDialog");

  return (
    <Fragment>
      <NodeInfoContext.Provider value={nodeInfoState}>
        <BrowserRouter>
          <Layout>
            <Header>
              <Menu
                // style={{ textAlign: "center" }}
                selectedKeys={[route]}
                mode="horizontal"
              >
                <Menu.Item key="/">
                  <img
                    src={logo}
                    className="header-logo"
                    onClick={() => setOpenDialog("TransferFundsDialog")}
                  />
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
                  key="/account"
                  onClick={() => setOpenDialog("CreateAccountDialog")}
                >
                  Create Account
                </Menu.Item>
              </Menu>
            </Header>
            <Content>
              <div className="content">
                <Switch>
                  <Route path="/" exact>
                    <About />
                  </Route>
                  <Route path="/search" exact>
                    <HomePage />
                  </Route>
                  <Route path="/sell" exact component={SellStream} />
                  <Route path="/access" exact component={Access} />

                  <Route path="/accounts/:address" component={AccountPage} />
                  <Route path="/transactions" component={TransactionsPage} />
                </Switch>
              </div>
            </Content>
            <Footer></Footer>
          </Layout>

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

          <PurchaseNFTTokenDialog
            open={openDialog === "PurchaseNFTTokenDialog"}
            token={window.selectedItem || {}}
            handleClose={(data) => {
              setOpenDialog(null);
              setPurchasedItem(data);
              setIsModalVisible(true);
            }}
          />

          {purchasedItem && (
            <Modal
              title="Success"
              visible={isModalVisible}
              onOk={() => setIsModalVisible(false)}
            >
              <h5>Purchased item: </h5>
              <p>{purchasedItem.title}</p>
              <p>Access key: {purchasedItem.bucketKey}</p>
              <br />
              <p>Transaction: {purchasedItem.tx}</p>

              <hr />
              <p>Write these down, you will not be shown them again.</p>
            </Modal>
          )}
        </BrowserRouter>
      </NodeInfoContext.Provider>
    </Fragment>
  );
}

export default App;
