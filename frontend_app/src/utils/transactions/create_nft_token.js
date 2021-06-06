/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";
import { uuidv4 } from "..";

export const createNFTTokenSchema = {
  $id: "lisk/create-nft-asset",
  type: "object",
  required: ["minPurchaseMargin", "initValue", "name"],
  properties: {
    minPurchaseMargin: {
      dataType: "uint32",
      fieldNumber: 1,
    },
    initValue: {
      dataType: "uint64",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
    description: {
      dataType: "string",
      fieldNumber: 4,
    },
    imgUrl: {
      dataType: "string",
      fieldNumber: 5,
    },
    ipfsUrl: {
      dataType: "string",
      fieldNumber: 6,
    },
    bucketKey: {
      dataType: "string",
      fieldNumber: 7,
    },
    accessKey: {
      dataType: "string",
      fieldNumber: 8,
    },
  },
};

export const createNFTToken = async ({
  name,
  initValue,
  minPurchaseMargin,
  passphrase,
  description,
  imgUrl,
  bucketKey,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } =
    cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const address = cryptography
    .getAddressFromPassphrase(passphrase)
    .toString("hex");

  const accountInfo = await fetchAccountInfo(address);
  console.log("info", accountInfo);

  const {
    sequence: { nonce },
  } = accountInfo;

  const { id, ...rest } = transactions.signTransaction(
    createNFTTokenSchema,
    {
      moduleID: 1024,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        description,
        bucketKey,
        imgUrl,
        accessKey: uuidv4(),
        initValue: BigInt(transactions.convertLSKToBeddows(initValue)),
        minPurchaseMargin: parseInt(minPurchaseMargin),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest),
    minFee: calcMinTxFee(createNFTTokenSchema, minFeePerByte, rest),
  };
};
