import React from 'react';
import { PaymentStatus } from '@/types/order';

interface StatusBadgeProps {
  status: PaymentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'PENDING') {
    return <span className="badge badge-warning">{status}</span>;
  } else if (
    status === 'PAID' ||
    status === 'SHIPPED' ||
    status === 'DELIVERED'
  ) {
    return <span className="badge badge-success">{status}</span>;
  } else if (status === 'FAILED' || status === 'CANCELED') {
    return <span className="badge badge-error">{status}</span>;
  } else {
    return <span className="badge">{status}</span>;
  }
};

export default StatusBadge;
