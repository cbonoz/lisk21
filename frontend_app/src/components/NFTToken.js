import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link,
  Divider,
  Button,
  CardMedia,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { transactions, cryptography, Buffer } from "@liskhq/lisk-client";

import PurchaseNFTTokenDialog from "./dialogs/PurchaseNFTTokenDialog";
import TransferNFTDialog from "./dialogs/TransferNFTDialog";

const SHOW_TRANSFER = false;

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  propertyList: {
    listStyle: "none",

    "& li": {
      margin: theme.spacing(2, 0),
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,

      "& dt": {
        display: "block",
        width: "100%",
        fontWeight: "bold",
        margin: theme.spacing(1, 0),
      },
      "& dd": {
        display: "block",
        width: "100%",
        margin: theme.spacing(1, 0),
      },
    },
  },
}));

const defaultImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

export default function NFTToken(props) {
  const classes = useStyles();
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const base32UIAddress = cryptography
    .getBase32AddressFromAddress(
      Buffer.from(props.item.ownerAddress, "hex"),
      "lsk"
    )
    .toString("binary");
  const {
    tokenHistory,
    name,
    imgUrl,
    description,
    bucketKey,
    value,
    minPurchaseMargin,
  } = props.item;
  const minPurchasePrice =
    parseFloat(transactions.convertBeddowsToLSK(value)) +
    parseFloat(minPurchaseMargin);
  return (
    <span className="listing-card">
      <Card>
        <CardMedia
          className={classes.media}
          image={imgUrl || defaultImage}
          title={name}
        />
        <CardContent>
          <Typography variant="h6">{name}</Typography>
          <Divider />
          <dl className={classes.propertyList}>
            {/* <li>
              <dt>Token ID</dt>
              <dd>{props.item.id}</dd>
            </li> */}
            <li>
              <dt>Purchase Price</dt>
              <dd>{minPurchasePrice}</dd>
            </li>
            <li>
              <dt>Description</dt>
              <dd>{props.item.description}</dd>
            </li>
            {!props.minimum && (
              <li>
                <dt>Owner</dt>
                <dd>
                  <Link
                    component={RouterLink}
                    to={`/accounts/${base32UIAddress}`}
                  >
                    {base32UIAddress.substr(0, 25)}...
                  </Link>
                </dd>
              </li>
            )}
          </dl>
          {/* <Typography variant="h6">NFT History</Typography> */}
          {/* <Divider /> */}
          {/* {props.item.tokenHistory.map((base32UIAddress) => (
          <dl className={classes.propertyList}>
            <li>
              <dd>
                <Link
                  component={RouterLink}
                  to={`/accounts/${base32UIAddress}`}
                >
                  {base32UIAddress}
                </Link>
              </dd>
            </li>
          </dl>
        ))} */}
        </CardContent>
        <CardActions>
          {SHOW_TRANSFER && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  setOpenTransfer(true);
                }}
              >
                Transfer
              </Button>
              <TransferNFTDialog
                open={openTransfer}
                handleClose={() => {
                  setOpenTransfer(false);
                }}
                token={props.item}
              />
            </>
          )}
          {props.item.minPurchaseMargin > 0 ? (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  setOpenPurchase(true);
                }}
              >
                Purchase
              </Button>
              <PurchaseNFTTokenDialog
                open={openPurchase}
                handleClose={() => {
                  setOpenPurchase(false);
                }}
                token={props.item}
              />
            </>
          ) : (
            <Typography variant="body">Can't purchase this token</Typography>
          )}
        </CardActions>
      </Card>
    </span>
  );
}
