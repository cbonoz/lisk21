import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { purchaseNFTToken } from "../../utils/transactions/purchase_nft_token";
import * as api from "../../api";
import { transactions } from "@liskhq/lisk-client";
import { PURCHASE_TOKEN_INFO } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function PurchaseNFTTokenDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const currentValue = parseFloat(
    transactions.convertBeddowsToLSK(props.token.value || "0")
  );
  const minPurchaseMargin = parseFloat(props.token.minPurchaseMargin || "0");
  const minPurchaseValue =
    currentValue + (currentValue * minPurchaseMargin) / 100.0;

  const [data, setData] = useState({
    name: props.token.name,
    nftId: props.token.id,
    purchaseValue: minPurchaseValue,
    fee: "",
    passphrase: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await purchaseNFTToken({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose({data, tx: res.tx});
  };

  const title = `Purchase :${data.name}`;

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <p>{PURCHASE_TOKEN_INFO}</p>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Token ID"
              disabled
              value={data.nftId}
              name="nftId"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Purchase Value"
              value={data.purchaseValue}
              disabled
              name="purchaseValue"
              onChange={handleChange}
              helperText={`Minimum purchase value: ${minPurchaseValue}`}
              fullWidth
            />
            <TextField
              label="Fee"
              value={data.fee}
              name="fee"
              onChange={handleChange}
              fullWidth
            />
            <hr />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Purchase NFT</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
