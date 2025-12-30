"use client";
import { PayPalButtons } from "@paypal/react-paypal-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  capturOrderPaypal,
  createPayPalOrder,
  useGenerateInvoice,
} from "../../queries/payment";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSubscription } from "@/queries/pricing";
import { formatCurrency } from "@/utils";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import Modal from "@/components/ui/modal";
import { Button, DialogTitle } from "@headlessui/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { encodeBytes32String, parseEther } from "ethers";
import { IconX } from "@tabler/icons-react";
import { useTimer } from "react-timer-hook";
import moment from "moment";
import { config } from "@/const";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "sonner";
import PaymentProcessing from "./component/payment-processing";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { invoiceAtom } from "@/const/atoms";
import { X } from "lucide-react";
import ActivityIndicator from "@/components/activity-indicator";
const ConfirmPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subId = searchParams.get("subId");
  const [open, setOpen] = useState(false);
  const [finalInvoiceData, setFinalInvoiceData] = useState({});
  const [statusModalState, setStatusModalState] = useState(false);
  const [invoiceModalState, setInvoiceModalState] = useState(false);
  const { isConnected, isConnecting } = useAccount();
  const [_, setInvoiceAtom] = useAtom(invoiceAtom);
  const { data: subscriptionData, isPending: subscriptionDataPending } =
    useGetSubscription({ id: subId });
  const [shouldUseApiCalling, setShouldUseApiCalling] = useState(false);

  const { mutateAsync: onApprovalMutate, isPending: onMutatePending } =
    useMutation({
      mutationFn: async ({ orderID }) => {
        return capturOrderPaypal({
          subscriptionId: subId,
          orderID: orderID,
        });
      },
      onSuccess: (data) => {
        if (data?.status == "COMPLETED") {
          toast.success("Purchase successfully");
          console.log(subscriptionData, "finalInvoiceData>>");
          setInvoiceAtom({ ...subscriptionData, invoiceData: data });
          router.replace("/dashboard/pricing/success-payment");
        } else {
          toast.error("Something went wrong, Please try again later");
        }
        setStatusModalState(false);
      },
      onError: (data) => {
        console.log("error in capture>", data);

        setStatusModalState(false);
      },
    });

  if (subscriptionDataPending) {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center gap-4">
        <ActivityIndicator isLoading className={"h-12 w-12"} />
        <p className="text-2xl font-semibold">Getting Data...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto flex items-center justify-center mt-20">
      <div className="flex flex-col ">
        <h3 className="font-bold text-3xl">Review & Pay</h3>
        <div className="flex flex-col lg:flex-row  mt-6 gap-4">
          <div className="flex flex-col bg-primary/10 lg:min-w-sm rounded-2xl p-4 gap-4 py-6 border border-primary/20">
            <p className="font-semibold text-xl">Your Plan</p>
            <div className="p-4 flex gap-2 flex-col border border-primary/30 rounded-2xl bg-primary/10 ">
              <p className="font-semibold text-xl capitalize">
                {subscriptionData?.name || "--"} Plan
              </p>
              <div className="flex font-medium text-lg flex-col">
                <div>
                  {subscriptionData?.permission?.map((item, idx) => {
                    return (
                      <div className="flex flex-row" key={idx}>
                        <p>{item}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-row">
  <p>Price:</p>
  <p className="ml-1">
    {formatCurrency({
      amount: subscriptionData?.amount,
      currency: subscriptionData?.currency,
    })}
  </p>
</div>

              </div>
              <p
                className="text-primary pt-6 hover:underline cursor-pointer"
                onClick={() => {
                  router.replace("/dashboard/pricing");
                }}
              >
                {" "}
                Change Plan
              </p>
            </div>
          </div>
          <div className="flex border-primary/10 border flex-col lg:max-w-sm rounded-2xl  p-4 gap-4 py-6 h-fit">
            <p className="font-semibold text-xl">Pay via PayPal</p>

            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={() => {
                return createPayPalOrder({
                  amount: subscriptionData?.amount,
                  currency: subscriptionData?.currency,
                });
              }}
              onApprove={(d) => {
                setShouldUseApiCalling(false);
                setStatusModalState(true);
                onApprovalMutate({ orderID: d?.orderID });
              }}
            />

            <p>
              You'll be securely redirected to PayPal to complete your payment
            </p>
            <div className="w-full h-1 bg-primary"></div>
            <p className="font-semibold text-xl">Pay via QIE <span className="text-primary">(50% off)</span></p>
            <button
              className="bg-primary h-10 font-normal text-lg rounded"
              onClick={() => {
                if (isConnecting) {
                  retun;
                }
                if (isConnected) {
                  setInvoiceModalState(true);
                } else {
                  setOpen(true);
                }
              }}
            >
              {isConnecting ? `Loading...` : `Buy in $${subscriptionData?.amount/2}`}
            </button>
          </div>
        </div>
        {/* <div className="w-full flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-0 lg:items-end justify-between mt-10">
          <p className="text-primary cursor-pointer">Back to payment options</p>
         
        </div> */}
      </div>
      {open && (
        <WalletConnectModal
          open={open}
          setOpen={setOpen}
          setInvoiceModalState={setInvoiceModalState}
        />
      )}
      {invoiceModalState && isConnected && (
        <InvoiceModal
          open={invoiceModalState}
          setOpen={setInvoiceModalState}
          subscriptionData={subscriptionData}
          setStatusModalState={setStatusModalState}
          setFinalInvoiceData={setFinalInvoiceData}
          setShouldUseApiCalling={setShouldUseApiCalling}
        />
      )}
      {(statusModalState || onMutatePending) && (
        <PaymentProcessing
          invoiceData={finalInvoiceData}
          setOpen={setStatusModalState}
          open={statusModalState || onMutatePending}
          enableApiCalling={shouldUseApiCalling}
          subscriptionData={subscriptionData}
        />
      )}
    </div>
  );
};

export default ConfirmPayment;

const WalletConnectModal = ({ open, setOpen, setInvoiceModalState }) => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (isConnected) {
      setInvoiceModalState(true);
      setOpen(false);
    }
  }, [isConnected]);

  return (
    <Modal open={open} setOpen={setOpen}>
    <div className="relative flex items-center justify-center gap-8 flex-col p-6">
      {/* Close Button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-0 right-0 text-gray-400 hover:text-white transition"
      >
        <X className="w-7 h-7" />
      </button>
  
      {/* Modal Content */}
      <DialogTitle as="h3" className="text-white text-2xl font-semibold">
        Please Connect Wallet
      </DialogTitle>
  
      <button
        className="bg-primary min-w-xs h-10 rounded hover:opacity-90 transition"
        onClick={() => openConnectModal()}
      >
        Connect Wallet
      </button>
    </div>
  </Modal>
  );
};

const InvoiceModal = ({
  open,
  setOpen,
  subscriptionData,
  setStatusModalState,
  setFinalInvoiceData,
  setShouldUseApiCalling,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: invoiceData, isPending: invoiceDataPending } =
    useGenerateInvoice({
      amount: subscriptionData?.amount,
      // amount: (subscriptionData?.amount * 0.5).toFixed(2),
      currency: subscriptionData?.currency,
      subscriptionId: subscriptionData?.id,
    });
  const { writeContractAsync } = useWriteContract();
  const chainConfig = useConfig();
  const { totalSeconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      setOpen(false);
      console.warn("onExpire called");
    },
    autoStart: false,
  });
  const totalDuration = useMemo(() => {
    if (!invoiceData?.expiresAt) return 0;
    const now = new Date(invoiceData?.createdAt);
    const expiry = new Date(invoiceData.expiresAt);
    return (totalSeconds / Math.floor((expiry - now) / 1000)) * 100;
  }, [invoiceData?.expiresAt, totalSeconds]);

  useEffect(() => {
    if (invoiceData?.expiresAt) {
      const expiry = moment(invoiceData.expiresAt).toDate();
      if (expiry > new Date()) {
        restart(expiry);
      } else {
        console.warn("Expiry date is in the past!");
      }
    }
  }, [invoiceData?.expiresAt, restart]);

  const paymentHanlder = async () => {
    try {
      setIsLoading(true);
      // const parsedValue = parseEther(String(Math.ceil(Number(1))));
      const parsedValue = parseEther(
        String(Number(invoiceData?.qieAmount))
      );


      const hash = await writeContractAsync({
        abi: config.paymentAbi,
        address: config.paymentContractAddress,
        functionName: "payInvoice",
        args: [invoiceData?.invoiceId ,invoiceData?.subscriptionId],
        value: parsedValue,
      });
      setIsLoading(false);
      setShouldUseApiCalling(true);
      setFinalInvoiceData(invoiceData);
      setStatusModalState(true);
      setOpen(false);
      toast.success("Payment initiated.");
    } catch (error) {
      console.log(error, "error in payment");
      toast.success(error?.shortMessage || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      {invoiceDataPending ? (
        <div className="min-h-52 flex items-center justify-center">
          <p>Getting Data...</p>
        </div>
      ) : (
        <>
          {!invoiceData?.invoiceId ? (
            <div className="min-h-52 flex items-center justify-center flex-col">
              <p>Unable to generate invoice</p>
              <p>Please try again later</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10">
                  <CircularProgressbar
                    minValue={0}
                    value={totalDuration}
                    text={totalSeconds}
                    strokeWidth={12}
                    styles={buildStyles({
                      rotation: 0.25,

                      textSize: "34px",

                      pathTransitionDuration: 0.5,

                      textColor: "#f88",
                      trailColor: "gray",
                      pathColor: `oklch(0.68 0.23 341.45)`,
                    })}
                  />
                </div>
                {console.log(invoiceData, subscriptionData, "invoiceData>>")}
                <DialogTitle
                  as="h3"
                  className="text-white text-2xl font-semibold"
                >
                  Invoice
                </DialogTitle>
                <IconX
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              </div>
              <div className="flex items-center justify-center gap-2 flex-col relative mt-8">
                <div className="flex flex-row justify-between w-full">
                  <p className="font-semibold">Actual Amount</p>
                  <p>
                    {formatCurrency({
                      amount: subscriptionData?.amount,
                      currency: subscriptionData?.currency,
                    })}
                  </p>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <p className="font-semibold">Discount Applied</p>
                  <p>50%</p>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <p className="font-semibold">Payable Amount</p>
                  <p>
                    {formatCurrency({
                      amount: invoiceData?.amountUsd,
                      currency: "USD",
                    })}
                  </p>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <p className="font-semibold">Equivalent Payable QIE</p>
                  <p>
                    {formatCurrency({
                      amount: Math.ceil(invoiceData?.qieAmount),
                      currency: "QIE",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center w-full gap-4 mt-14">
                  {/* <div className="flex flex-row">
            <p>Expires In: </p>
            <p>Expires In: </p>
          </div> */}
                  <button
                    className="flex w-full bg-primary h-10 rounded justify-center items-center"
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }
                      paymentHanlder();
                    }}
                  >
                    {isLoading ? `Processing...` : `Confirm`}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
};
