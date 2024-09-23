import { z } from 'zod';

// Validation schema for adding to cart
export const ADD_TO_CART_BODY = z.object({
  productId: z
    .number({
      message: 'Product ID must be a number!',
    })
    .int({
      message: 'Product ID must be a positive integer!',
    })
    .positive({
      message: 'Product ID must be a positive number!',
    }),
  quantity: z
    .number({
      message: 'Quantity must be a number!',
    })
    .int({
      message: 'Quantity must be an integer!',
    })
    .positive({
      message: 'Quantity must be a positive number!',
    }),
});

// Validation schema for updating cart
export const UPDATE_BODY = z.object({
  productId: z
    .number({
      message: 'Product ID must be a number!',
    })
    .int({
      message: 'Product ID must be a positive integer!',
    })
    .positive({
      message: 'Product ID must be a positive number!',
    }),
  quantity: z
    .number({
      message: 'Quantity must be a number!',
    })
    .int({
      message: 'Quantity must be an integer!',
    })
    .positive({
      message: 'Quantity must be a positive number!',
    }),
});

// Validation schema for deleting cart
export const DELETE_CART_BODY = z
  .number({
    message: 'Product ID must be a number!',
  })
  .int({
    message: 'Product ID must be a positive integer!',
  })
  .positive({
    message: 'Product ID must be a positive number!',
  });
