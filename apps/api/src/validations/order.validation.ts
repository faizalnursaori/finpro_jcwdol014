import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

// Checkout Body Validation
export const validateCheckoutBody = z.object({
  name: z.string({ message: 'Name is required!' }).min(1),
  paymentStatus: z.enum([
    'UNPAID',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELED',
  ]),
  shippingCost: z.number({ message: 'ShippingCost is required!' }),
  total: z.number({ message: 'Total is required!' }),
  paymentMethod: z.string({ message: 'Payment Method is required!' }).min(1),
  warehouseId: z
    .number({ message: 'warehouseId is required!' })
    .int({ message: 'warehouseId must be Integer!' })
    .positive({ message: 'warehouseId must be Positive number!' }),
  cartId: z
    .number({ message: 'CartId is required!' })
    .int({ message: 'CartId must be Integer!' })
    .positive({ message: 'CartId must be Positive number!' }),
  addressId: z
    .number({ message: 'AddressId is required!' })
    .int({ message: 'AddressId must be Integer!' })
    .positive({ message: 'AddressId must be Positive number!' }),
  orderProducts: z.array(
    z.object({
      productId: z
        .number({ message: 'productId is required!' })
        .int({ message: 'productId must be Integer!' })
        .positive({ message: 'productId must be Positive number!' }),
      quantity: z
        .number({ message: 'quantity is required!' })
        .int({ message: 'quantity must be Integer!' })
        .positive({ message: 'quantity must be Positive number!' }),
      price: z.number({ message: 'price is required!' }).nonnegative(),
      total: z.number({ message: 'total is required!' }).nonnegative(),
    }),
  ),
});

// File Validation
export const validateFile = (file: Express.Multer.File) => {
  if (!file) throw new Error('Image is required!');

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be less than 1MB!');
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new Error('.jpg, .jpeg, and .png files are only accepted.');
  }

  return file;
};

// Order ID Validation
export const validateOrderId = z
  .number({ message: 'Order ID must be Number!' })
  .int()
  .positive({ message: 'Order ID must be a positive integer' });

// Warehouse ID Validation
export const validateWarehouseId = z
  .number({ message: 'Warehouse ID must be Number!' })
  .int()
  .positive({ message: 'Warehouse ID must be a positive integer' });
