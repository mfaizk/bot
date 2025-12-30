import { Wallet, getWalletConnectConnector } from "@rainbow-me/rainbowkit";
import PaymentAbi from "@/abi/paymentABI.json";
export const qieChain = {
  id: 1990,
  name: "QIE Blockchain",
  network: "qie",
  nativeCurrency: {
    decimals: 18,
    name: "QIE",
    symbol: "QIE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc1mainnet.qie.digital"],
    },
    public: {
      http: ["https://rpc1mainnet.qie.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "QIE Explorer",
      url: "https://mainnet.qie.digital",
    },
  },
  testnet: false,
  iconUrl: "/brand/qiLogo.svg",
};

export const QieCustomWallet = ({ projectId }) => ({
  id: "qie-walle",
  name: "QIE Wallet",
  iconUrl:
    "https://lh3.googleusercontent.com/RmBk7DO3Qz_EjJGTi5eMhmm9X62_2M_vXdHHtR-Nzv5XVQ-mfOhoPThPPB1j3K7teRcLLzBpY6HizEC-FrYsgbADFQ=s60",
  iconBackground: "#0c2f78",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=com.qiewallet&hl=en_IN&pli=1",
    ios: "https://apps.apple.com/us/app/qie-wallet/id6445826746",
    chrome:
      "https://chromewebstore.google.com/detail/qie-wallet-and-web3-domai/oljchdcgmibnjbbopolafbjncfhdacjb?pli=1",
    qrCode: "https://my-wallet/qr",
  },
  mobile: {
    getUri: (uri) => uri,
  },
  qrCode: {
    getUri: (uri) => uri,
    instructions: {
      learnMoreUrl: "https://my-wallet/learn-more",
      steps: [
        {
          description:
            "We recommend putting My Wallet on your home screen for faster access to your wallet.",
          step: "install",
          title: "Open the My Wallet app",
        },
        {
          description:
            "After you scan, a connection prompt will appear for you to connect your wallet.",
          step: "scan",
          title: "Tap the scan button",
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: "https://my-wallet/learn-more",
      steps: [
        {
          description:
            "We recommend pinning My Wallet to your taskbar for quicker access to your wallet.",
          step: "install",
          title: "Install the My Wallet extension",
        },
        {
          description:
            "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          step: "create",
          title: "Create or Import a Wallet",
        },
        {
          description:
            "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          step: "refresh",
          title: "Refresh your browser",
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});

export const config = {
  paymentAbi: PaymentAbi,
  paymentContractAddress: "0x870f6337A296b9D5524C2eE095bA7cEB6c54D9AA",
};
