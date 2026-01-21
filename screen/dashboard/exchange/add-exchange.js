"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Info, Copy } from "lucide-react";
import { IconExchange, IconTrashXFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import OTPModal from "../../../components/otp-modal";
import Dropdown from "../../../components/dropdown";
import { useMutation } from "@tanstack/react-query";
import Modal from "@/components/ui/modal";
import {
  addKeysExchange,
  deleteKeysExchange,
  sendOtpExchange,
  useGetKeysExchange,
} from "@/queries/exchange";
import { toast } from "sonner";
import ActivityIndicator from "@/components/activity-indicator";
import clsx from "clsx";
import SuccessModal from "../../../components/success-modal";
import { useUserProfile } from "@/queries/profile";

const exchangeOptions = [
  { label: "Mexc", value: "mexc", icon: "/assets/homepage/mexc.png" },
  { label: "Bybit", value: "bybit", icon: "/assets/homepage/bybit.webp" },
];

export default function AddExchange() {
  const router = useRouter();
  const [showSecret, setShowSecret] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState({});
  const [formData, setFormData] = useState({
    exchange: "",
    apiKey: "",
    secretKey: "",
  });
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [visibleKeys, setVisibleKeys] = useState({}); // per-row visibility
  const {
    data: exchangeKeyList,
    isLoading: exchangeKeyListLoading,
    refetch: exchangeKeyListRefetch,
  } = useGetKeysExchange();
  const { data: profileData } = useUserProfile();

  const { mutateAsync: sendOtp, isPending: sendOtpPending } = useMutation({
    mutationFn: () => {
      return sendOtpExchange();
    },
    onSuccess: (data) => {
      if (data?.responseCode == 200) {
        toast.success(data?.responseMessage);
      } else {
        toast.error(data?.responseMessage);
      }
    },
  });
  const {
    mutateAsync: addKeysExchangeMutate,
    isPending: addKeysExchangePending,
  } = useMutation({
    mutationFn: ({ otp }) => {
      return addKeysExchange({
        apiKey: formData?.apiKey,
        apiSecret: formData?.secretKey,
        exchange: formData?.exchange,
        otp: otp,
      });
    },
    onSuccess: (data) => {
      if (data?.responseCode == 200) {
        const msg = data?.responseMessage || "Exchange added successfully";
        setSuccessMessage(msg);
        setSuccessModalOpen(true);
      } else {
        toast.error(data?.responseMessage);
      }
      setIsOpen(false);
      resetForm();
      exchangeKeyListRefetch();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.responseMessage || "Something went wrong",
      );
      // setIsOpen(false);
      // resetForm();
      exchangeKeyListRefetch();
    },
  });

  const resetForm = () => {
    setFormData({
      exchange: "",
      apiKey: "",
      secretKey: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleOTPSubmit = (code) => {
    addKeysExchangeMutate({ otp: code });
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.exchange) newErrors.exchange = "Please select an exchange";
    if (!formData.apiKey) newErrors.apiKey = "API Key is required";
    if (!formData.secretKey) newErrors.secretKey = "Secret Key is required";
    else if (formData.secretKey.length < 8)
      newErrors.secretKey = "Secret Key must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await sendOtp();
      setIsOpen(true);
    }
  };

  // Helpers for table keys visibility/masking/copy
  const getRowKey = (item, idx) => item?.id ?? idx;
  const toggleVisibility = (rowKey, field) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [field]: !prev[rowKey]?.[field],
      },
    }));
  };
  const isVisible = (rowKey, field) => !!visibleKeys[rowKey]?.[field];

  const maskValue = (val) => {
    if (!val) return "*".repeat(6);
    return "*".repeat(val.length);
  };

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Unable to copy");
    }
  };
  console.log(profileData, "profileData>>>");

  const filteredExchangeOption = useMemo(() => {
    const activePlan = profileData?.subscriptionDetail?.find(
      (item) => item?.planStatus == "ACTIVE",
    );

    if (!activePlan) {
      return exchangeOptions?.filter((item) => item?.value != "mexc");
    }

    if (
      String(activePlan?.planStatus)?.toLowerCase() == "active" &&
      String(activePlan?.planName)?.toLowerCase() == "pro"
    ) {
      return exchangeOptions;
    }
    return exchangeOptions?.filter((item) => item?.value != "mexc");
  }, [profileData]);

  const handleSelect = (val) => {
    if (exchangeKeyList?.find((item) => item?.exchange == val)) {
      toast.error("Please Delete exchange credential before proccesing");
      return;
    }
    setFormData({ ...formData, exchange: val });
  };

  return (
    <div className="min-h-screen  ">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full  flex justify-center items-center p-8">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-semibold mb-2">Add Exchange</h2>
            <p className="text-sm text-gray-400 mb-8">
              Fill in your API details to connect your trading account.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <Dropdown
                  label="Select Exchange"
                  options={filteredExchangeOption}
                  value={formData.exchange || ""}
                  onSelect={handleSelect}
                  className="w-56"
                />
                {errors.exchange && (
                  <p className="text-red-500 text-sm mt-1">{errors.exchange}</p>
                )}
              </div>

              <div className="mb-5 relative">
                <input
                  type="text"
                  name="apiKey"
                  placeholder="Enter API Key"
                  value={formData.apiKey}
                  onChange={handleChange}
                  className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none ${
                    errors.apiKey ? "border border-red-500" : ""
                  }`}
                />
                {errors.apiKey && (
                  <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
                )}
              </div>

              <div className="mb-6 relative">
                <input
                  type={showSecret ? "text" : "password"}
                  name="secretKey"
                  placeholder="Enter Secret Key"
                  value={formData.secretKey}
                  onChange={handleChange}
                  className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none pr-10 ${
                    errors.secretKey ? "border border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  className={`absolute right-3 flex items-center text-gray-400 hover:text-white ${
                    errors.secretKey ? "bottom-10" : "bottom-3"
                  }`}
                  tabIndex={-1}
                >
                  {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.secretKey && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.secretKey}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#1A1A24] rounded-xl mb-8">
                <div className="w-12 h-12 flex items-center justify-center bg-[#2a2a38] rounded-full text-primary text-2xl">
                  ••••
                </div>
                <div>
                  <p className="text-base font-medium">
                    OTP Verification Required
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    A 4-digit code will be sent to your registered email. Please
                    verify before proceeding.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary font-semibold text-white py-3 rounded-[10px] hover:opacity-90 transition-opacity"
                disabled={sendOtpPending}
              >
                {sendOtpPending ? `Processing...` : `Connect Exchange`}
              </button>
            </form>

            <div className="mt-10 bg-[#13131E] p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">
                Whitelist These Server IPs
              </h3>
              {["139.59.42.213", "157.245.99.231"]?.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between bg-[#1a1a25] px-4 py-2 rounded-lg mb-2 text-gray-300"
                >
                  <span>{ip}</span>
                  <Copy
                    onClick={() => handleCopy(ip)}
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white"
                  />
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-3">
                Please whitelist these IPs in your exchange before connecting.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#13131e] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            Recently Connected Exchanges
          </h2>

          <div
            className={clsx(
              "flex flex-col items-center text-center  border border-dashed border-gray-700 rounded-xl mb-6",
              !exchangeKeyListLoading && exchangeKeyList?.length > 0
                ? "py-0"
                : "py-16",
            )}
          >
            {exchangeKeyListLoading ? (
              <>
                <ActivityIndicator className="h-10 w-10" isLoading />
                <p className="text-gray-400 mt-2">Getting exchange data...</p>
              </>
            ) : exchangeKeyList?.length === 0 ? (
              <>
                <IconExchange size={60} className="text-primary mb-4" />
                <p className="text-gray-400">
                  No exchanges have been added yet!
                </p>
              </>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-700 w-full">
                <table className="min-w-full text-sm text-gray-300">
                  <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">Exchange Name</th>
                      <th className="px-6 py-3 text-left">Api Key</th>
                      <th className="px-6 py-3 text-left">API secret key</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangeKeyList.map((item, idx) => {
                      const rowKey = getRowKey(item, idx);
                      return (
                        <tr
                          key={rowKey}
                          className={`${
                            idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                          } border-b border-gray-700 hover:bg-gray-700/50 transition`}
                        >
                          <td className="px-6 py-3 capitalize text-left">
                            <div className="flex flex-row items-center gap-1">
                              <img
                                src={item?.icon}
                                className="h-6 object-contain"
                              />
                              {item?.exchange || "-"}
                            </div>
                          </td>

                          {/* API Key with eye + copy */}
                          <td className="px-6 py-3 text-left">
                            <div className="flex items-center gap-2">
                              <span className="">
                                {isVisible(rowKey, "apiKey")
                                  ? item?.apiKey
                                  : maskValue(item?.apiKey)}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVisibility(rowKey, "apiKey");
                                }}
                                className="p-1"
                                aria-label={
                                  isVisible(rowKey, "apiKey")
                                    ? "Hide API Key"
                                    : "Show API Key"
                                }
                              >
                                {isVisible(rowKey, "apiKey") ? (
                                  <EyeOff
                                    size={16}
                                    className="text-gray-400 hover:text-gray-200"
                                  />
                                ) : (
                                  <Eye
                                    size={16}
                                    className="text-gray-400 hover:text-gray-200"
                                  />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item?.apiKey);
                                }}
                                className="p-1"
                                aria-label="Copy API Key"
                              >
                                <Copy
                                  size={16}
                                  className="text-gray-400 hover:text-gray-200"
                                />
                              </button>
                            </div>
                          </td>

                          {/* API Secret Key with eye + copy */}
                          <td className="px-6 py-3 text-left">
                            <div className="flex items-center gap-2">
                              <span className="">
                                {isVisible(rowKey, "apiSecret")
                                  ? item?.apiSecret
                                  : maskValue(item?.apiSecret)}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVisibility(rowKey, "apiSecret");
                                }}
                                className="p-1"
                                aria-label={
                                  isVisible(rowKey, "apiSecret")
                                    ? "Hide Secret Key"
                                    : "Show Secret Key"
                                }
                              >
                                {isVisible(rowKey, "apiSecret") ? (
                                  <EyeOff
                                    size={16}
                                    className="text-gray-400 hover:text-gray-200"
                                  />
                                ) : (
                                  <Eye
                                    size={16}
                                    className="text-gray-400 hover:text-gray-200"
                                  />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item?.apiSecret);
                                }}
                                className="p-1"
                                aria-label="Copy Secret Key"
                              >
                                <Copy
                                  size={16}
                                  className="text-gray-400 hover:text-gray-200"
                                />
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-3 text-left">
                            {item?.active ? "Active" : "Inactive"}
                          </td>
                          <td className="px-6 py-3 capitalize text-left">
                            <IconTrashXFilled
                              onClick={() => {
                                setCurrentSelectedItem(item);
                                setDeleteModalState(true);
                              }}
                              color="red"
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-[#1a1a25] p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Information</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-3">
              <li>
                <strong className="text-white">Select exchange:</strong> Choose
                the exchange where your assistant will trade. If you don&apos;t
                have an account, create one first.
              </li>
              <li>
                <strong className="text-white">API key:</strong> Obtain an API
                key and secret key from your exchange and ensure "read balance"
                and "place order" permissions are enabled.
              </li>
              <li>
                <strong className="text-white">API secret key:</strong> Find
                this in your exchange settings and paste it.
              </li>
            </ul>
          </div>
          <div className="bg-red-600 p-5 rounded-xl mt-6">
            <p className="text-white">
              <strong> Important:</strong> Leave withdrawal permissions turned
              off when creating your API key. Our bot never needs withdrawal
              access, and enabling it may put your funds at risk.
            </p>
          </div>
        </div>
      </div>

      <OTPModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleOTPSubmit}
        onResend={sendOtp} // <-- pass sendOtp so modal can call it on resend
        isLoading={addKeysExchangePending}
        resendEnable={true} // <-- allow resend button to show
      />

      <SuccessModal
        open={successModalOpen}
        setOpen={setSuccessModalOpen}
        title="Exchange Added"
        message={"All set! Your API Key and Secret Key are now saved."}
        autoClose={true}
        duration={5}
        onOk={() => {
          // optional: any post-success action (e.g., refresh, navigate)
          exchangeKeyListRefetch();
        }}
      />

      {deleteModalState && (
        <DeleteModal
          open={deleteModalState}
          setOpen={setDeleteModalState}
          data={currentSelectedItem}
          refetch={exchangeKeyListRefetch}
        />
      )}
    </div>
  );
}

const DeleteModal = ({ open, setOpen, data, refetch }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      return deleteKeysExchange({ id: data?.id });
    },
    onSuccess: (data) => {
      if (data?.responseCode == 200) {
        toast.success(data?.responseMessage);
      } else {
        toast.error(data?.responseMessage);
      }
      setOpen(false);
      if (refetch) {
        refetch();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.responseMessage);
      setOpen(false);
      if (refetch) {
        refetch();
      }
    },
  });

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex items-center justify-center flex-col">
        <p className="font-semibold text-2xl">Confirmation</p>
        <p className="mt-6">Are you sure you want to delete this?</p>

        {/* warning text */}
        <p className="mt-2 text-sm text-red-500 font-medium">
          Please stop the bot before deleting the key.
        </p>

        <div className="w-full mt-4 flex flex-row gap-4 ">
          <button
            className="bg-gray-300 w-full flex justify-center items-center h-10 rounded text-black"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 w-full flex justify-center items-center h-10 rounded"
            onClick={mutateAsync}
            disabled={isPending}
          >
            {isPending ? `Processing...` : `Confirm`}
          </button>
        </div>
      </div>
    </Modal>
  );
};
