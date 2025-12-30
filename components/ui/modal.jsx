"use client";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const Modal = ({ open, setOpen, children }) => {
  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-[999999] focus:outline-none"
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
