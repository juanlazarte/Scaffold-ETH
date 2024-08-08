"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";
import { IntegerInput } from "~~/components/scaffold-eth";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Token: NextPage = () => {
  const [address, setAddress] = useState("");
  const [amountToMint, setAmountToMint] = useState<string | bigint>("");
  const account = useAccount();

  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "ScaffoldETHToken",
    functionName: "balanceOf",
    args: [account?.address ?? ""],
  });

  const { writeContractAsync: mintTokens } = useScaffoldWriteContract("ScaffoldETHToken");

  const handleMint = async () => {
    try {
      await mintTokens({
        functionName: "mint",
        args: [address, BigInt(amountToMint)],
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col mt-8 p-10">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Buy ScaffoldETH token</h2>
            <label>Actual amount</label>
            <InputBase
              name="actualAmount"
              disabled
              placeholder="Actual amount"
              value={formatEther(tokenBalance || BigInt(0))}
              onChange={() => {
                console.log("on change");
              }}
            />
            <label>Amount to mint</label>
            <IntegerInput
              value={amountToMint}
              onChange={updatedAmount => {
                setAmountToMint(updatedAmount);
              }}
              placeholder="value (wei)"
            />
            <label>To</label>
            <AddressInput onChange={setAddress} value={address} placeholder="Input your address" />
            <div className="card-actions justify-end">
              <button className="btn btn-primary w-full mt-2 " onClick={handleMint}>
                <CurrencyDollarIcon className="h-4 w-4" />
                Mint Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Token;
