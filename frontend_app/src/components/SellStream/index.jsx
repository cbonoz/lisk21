import React, { useState, useEffect, useContext } from "react";

import { StreamDropzone } from "../StreamDropzone";
import { Input, Button, Steps, Layout } from "antd";
import { createBucketWithFiles } from "../../utils/bucket";
import { addCard } from "../Discover/util";
import * as api from "../../api";
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import { TextField } from "@material-ui/core";
import { NodeInfoContext } from "../../context";

const { Header, Footer, Sider, Content } = Layout;

const { Step } = Steps;

const LAST_STEP = 3;

function SellStream({ isLoggedIn, signer, provider, address, blockExplorer }) {
  const [currentStep, setCurrentStep] = useState(0);
  const nodeInfo = useContext(NodeInfoContext);

  // useEffect(() => {
  //   console.log("isLoggedIn", isLoggedIn);
  //   if (isLoggedIn && currentStep === 0) updateStep(1);
  // }, [isLoggedIn]);

  const [files, setFiles] = useState([]);
  const [data, setData] = useState({
    userName: "cbono",
    title: "LiveStream Broadcast from 5/29",
    eth: 0.01,
  });
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const updateStep = async (offset) => {
    const newStep = currentStep + offset;
    if (newStep === LAST_STEP) {
      if (!files) {
        alert("At least one file must be added");
        return;
      }
      setLoading(true);

      try {
        const res = await createBucketWithFiles(data.title, files);
        setResult(res);

        const card = {
          ...data,
          createdAt: new Date(),
          key: res.bucketKey,
        };

        addCard(card);
      } catch (e) {
        console.error("error creating listing", e);
        alert(e.toString());
        return;
      } finally {
        setLoading(false);
      }
    }

    console.log("update step", newStep);
    setCurrentStep(newStep);
  };

  const getBody = () => {
    switch (currentStep) {
      case 0: // data
        return (
          <div className="data-section">
            <h2 className="sell-header">What are you listing?</h2>
            <TextField
              label="Name"
              value={data.name}
              name="name"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Initial Token value"
              value={data.initValue}
              name="initValue"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Minimum Purchase Margin (0 - 100)"
              value={data.minPurchaseMargin}
              name="minPurchaseMargin"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Fee"
              value={data.fee}
              name="fee"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
            />
            <Input
              addonBefore={"Address"}
              disabled
              placeholder="Payment Address: "
              value={address}
            />
            <p>
              Note: In order to sell a stream or stream package, it must be
              finished and as a recording. This recording will be secured and
              delivered via a special IPFS link.
            </p>
          </div>
        );
      case 1: // upload
        return (
          <div>
            <StreamDropzone files={files} setFiles={setFiles} />
          </div>
        );
      case 2: // done
        return (
          <div className="complete-section">
            <h2 className="sell-header">Complete!</h2>

            {Object.keys(result).map((k) => {
              return (
                <li>
                  {k}: {JSON.stringify(result[k]).replaceAll('"', "")}
                </li>
              );
            })}
            <h3>Listing datarmation</h3>
            {Object.keys(data).map((k) => {
              return (
                <li key={k}>
                  {k}: {JSON.stringify(data[k]).replaceAll('"', "")}
                </li>
              );
            })}

            {result.url && (
              <a href={result.url} target="_blank">
                Click here to view listing.
              </a>
            )}
          </div>
        );
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await createNFTToken({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
  };

  return (
    <div className="content">
      <h1>List new item in marketplace</h1>
      <Steps current={currentStep}>
        <Step title="Information" description="What are you listing?" />
        <Step title="Upload" description="Add files and content for purchase." />
        <Step title="Done" description="View your listing." />
      </Steps>
      <div className="sell-area">{getBody()}</div>
      {currentStep !== 0 && (
        <Button
          disabled={loading}
          type="primary"
          onClick={() => updateStep(-1)}
        >
          Previous
        </Button>
      )}
      {currentStep < LAST_STEP && (
        <Button
          disabled={loading}
          loading={loading}
          type="primary"
          onClick={() => updateStep(1)}
        >
          {currentStep === LAST_STEP - 1 ? "Done" : "Next"}
        </Button>
      )}
    </div>
  );
}

export default SellStream;
