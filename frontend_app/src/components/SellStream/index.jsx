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

const EX_PHRASE =
  "shrug win match scrap offer strong acid visa toast energy salt truth";
const EX_ADDRESS = "lsk3yp2ex874hnp3gruhk6mo6vaobnnwn94ok3ovt";

const LAST_STEP = 2;

function SellStream({ isLoggedIn, signer, provider, address, blockExplorer }) {
  const [currentStep, setCurrentStep] = useState(0);
  const nodeInfo = useContext(NodeInfoContext);

  // useEffect(() => {
  //   console.log("isLoggedIn", isLoggedIn);
  //   if (isLoggedIn && currentStep === 0) updateStep(1);
  // }, [isLoggedIn]);

  const [files, setFiles] = useState([]);
  const [data, setData] = useState({
    name: "cbono",
    initValue: "100",
    minPurchaseMargin: "100",
    fee: "10",
    description: "",
    imgUrl: "",
    passphrase: EX_PHRASE,
    ownerAddress: EX_ADDRESS,
  });

  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const createNFT = async (bucketKey) => {
    const body = {
      ...data,
      bucketKey,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    };
    console.log("create", body);
    const res = await createNFTToken(body);
    await api.sendTransactions(res.tx);
    return res;
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
        let res = await createBucketWithFiles(data.title, files);
        setResult(res);

        const nftResult = await createNFT(res.bucketKey);
        console.log("result", nftResult);

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
              label="Description"
              value={data.description}
              name="description"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Initial Cost"
              value={data.initValue}
              name="initValue"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Margin"
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

            <Input
              name="imgUrl"
              addonBefore={"Image"}
              addonAfter={"A default will be used if blank"}
              placeholder="Enter listing image or thumbnail url (optional)"
              value={data.imgUrl}
              onChange={handleChange}
            />
            <hr />

            <Input
              name="ownerAddress"
              addonBefore={"Address"}
              placeholder="Payment Address: "
              onChange={handleChange}
              value={data.ownerAddress}
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
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
            <h3>Listing information</h3>
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

  return (
    <div className="content">
      <h1 className="centered heading">List new item in marketplace</h1>
      <Steps current={currentStep}>
        <Step title="Information" description="What are you listing?" />
        <Step
          title="Upload"
          description="Add files and content for purchase."
        />
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
