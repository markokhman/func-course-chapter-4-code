import { address, toNano } from "ton-core";
import { MainContract } from "../wrappers/MainContract";
import { compile, NetworkProvider } from "@ton-community/blueprint";

export async function run(provider: NetworkProvider) {
  const myContract = MainContract.createFromConfig(
    {
      number: 0,
      address: address("kQDPKoik0b-fi0pGukkc3GjzLgtTmh0118kizMWh4nVo_GpG"),
      owner_address: address(
        "kQDPKoik0b-fi0pGukkc3GjzLgtTmh0118kizMWh4nVo_GpG"
      ),
    },
    await compile("MainContract")
  );

  const openedContract = provider.open(myContract);

  openedContract.sendDeploy(provider.sender(), toNano("0.05"));

  await provider.waitForDeploy(myContract.address);
}
