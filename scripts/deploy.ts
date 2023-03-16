import { hex } from "../build/main.compiled.json";
import {
  beginCell,
  Cell,
  contractAddress,
  StateInit,
  storeStateInit,
  toNano,
} from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";

import dotenv from "dotenv";
dotenv.config();

async function deployScript() {
  console.log(
    "================================================================="
  );
  console.log("Deploy script is running, let's deploy our main.fc contract...");

  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const stateInit: StateInit = {
    code: codeCell,
    data: dataCell,
  };

  const stateInitBuilder = beginCell();
  storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  // const stateInitCell = beginCell()
  //   .storeBit(false) // split_depth - Parameter for the highload contracts, defines behaviour of splitting into multiple instances in different shards. Currently StateInit used without it.
  //   .storeBit(false) // special - Used for invoking smart contracts in every new block of the blockchain. Available only in the masterchain. Regular user's contracts used without it.
  //   .storeMaybeRef(codeCell) // code - Contract's serialized code.
  //   .storeMaybeRef(dataCell) // data - Contract initial data.
  //   .storeUint(0, 1) // library - Currently used StateInit without libs
  //   .endCell();

  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

  console.log(
    `The address of the contract is following: ${address.toString()}`
  );
  console.log(`Please scan the QR code below to deploy the contract:`);

  let link =
    `https://${process.env.TESTNET ? "test." : ""}.tonhub.com/transfer/` +
    address.toString({
      testOnly: process.env.TESTNET ? true : false,
    }) +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: stateInitCell.toBoc({ idx: false }).toString("base64"),
    });

  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
}

deployScript();
