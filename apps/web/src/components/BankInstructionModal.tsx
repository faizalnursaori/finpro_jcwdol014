import React from 'react';
import Image from 'next/image';
import { paymentMethods } from '@/utils/paymentList';

interface BankInstructionsModalProps {
  bank: (typeof paymentMethods)[0] | null;
  isOpen: boolean;
  onClose: () => void;
}

const BankInstructionsModal: React.FC<BankInstructionsModalProps> = ({
  bank,
  isOpen,
  onClose,
}) => {
  if (!bank) return null;

  return (
    <dialog id="bank_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center">
          <Image
            src={bank.icon}
            alt={bank.name}
            width={32}
            height={32}
            className="mr-2"
          />
          <span>{bank.name} Transfer Instructions</span>
        </h3>
        <div className="mt-4">
          <ol className="list-decimal list-inside space-y-2">
            {bank.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default BankInstructionsModal;
