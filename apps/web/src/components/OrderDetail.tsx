'use client';
import React, { useEffect, useState } from 'react';
import { Cart } from '@/types/cart';
import { formatRupiah } from '@/utils/currencyUtils';
import { getUserAddresses } from '@/api/address';
import { useSession } from 'next-auth/react';
import { getShippingCost } from '@/utils/shipping';

interface OrderDetailsProps {
  cart: Cart;
  warehouseId: number | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ cart, warehouseId }) => {
  const { data } = useSession();
  
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>();
  const [shippingData, setShippingData] = useState<any>({
    weight: 1500,
    origin: String(warehouseId),
  });
  const [addresses, setAddresses] = useState<any>();
  const [defaultAddress, setDefaultAddress] = useState<any>()
  const [selectedAddress, setSelectedAddress] = useState<any>(defaultAddress);
  const [selectedServiceCost, setSelectedServiceCost] = useState<any>(0);
  const [selectedService, setSelectedService] = useState<string>('Delivery Service');
  const [services, setServices] = useState<any>();

  const getUserAddress = async () => {
    try {
      const res = await getUserAddresses(data?.user?.id);
      setAddresses(res?.address);
      const filteredAddress = addresses?.filter((address: {isPrimary: boolean}) => {
        return address.isPrimary == true
      })
      console.log(filteredAddress[0]);
      
      setDefaultAddress(filteredAddress[0])
    } catch (error) {
      console.log(error);
    }
  };

  const shippingCostData = async () => {
    try {
      const data = await getShippingCost(shippingData);
      console.log(data);

      console.log(data.hasil[0]?.costs);
      setServices(data.hasil[0]?.costs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAddress = (address: any) => {
    setSelectedAddress(address);
    setShippingData({ ...shippingData, destination: String(address.cityId) });
  };

  const handleChangeMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShippingMethod(e.target.value);
    setShippingData({ ...shippingData, courier: e.target.value });
  };
  const handleService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cost = e.target.value.split(',');
    setSelectedService(cost[1]);
    setSelectedServiceCost(cost[0]);
    
    
  };

  useEffect(() => {
    setSelectedServiceCost(0);
    setSelectedShippingMethod('Delivery Method');
    setSelectedService('Delivery Service');
  }, [selectedAddress]);

  useEffect(() => {
    setSelectedService('Delivery Service');
  }, [selectedShippingMethod]);

  useEffect(() => {
    getUserAddress();
    shippingCostData();
  }, [data?.user, selectedAddress, selectedShippingMethod]);

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const total = Number(subtotal) + Number(selectedServiceCost);

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Order Details</h2>
      <div className="mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>{formatRupiah(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="divider"></div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p>Delivery Address:</p>
          <button
            className="btn btn-ghost hover:btn-link"
            onClick={() => document.getElementById('my_modal_1').showModal()}
          >
            {selectedAddress ? selectedAddress?.address : defaultAddress ? defaultAddress?.address : 'Select Address'}
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box max-w-[50vw]">
              <div className="modal-action">
                <form
                  method="dialog"
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3"
                >
                  {addresses?.map(
                    (
                      address: { name: string; address: string },
                      index: number,
                    ) => {
                      return (
                        <button
                          key={index}
                          className="card card-compact shadow-lg p-2 max-h-40 h-40 max-w-35"
                          onClick={() => handleChangeAddress(address)}
                        >
                          <p className="card-title">{address.name}</p>
                          <div className="card-body">
                            <p>{address.address}</p>
                          </div>
                        </button>
                      );
                    },
                  )}
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <div className="flex justify-between items-center">
          <p>Delivery Method:</p>
          <select
            name="delivMethod"
            id="delivMethod"
            className="select select-ghost"
            onChange={handleChangeMethod}
            value={selectedShippingMethod}
          >
            <option disabled selected>
              Delivery Method
            </option>
            <option value="jne">JNE</option>
            <option value="pos">POS</option>
            <option value="tiki">TIKI</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <p>Delivery Service:</p>
          <select
            // value={selectedService as string}
            name="delivService"
            id="deliveService"
            className="select"
            onChange={handleService}
            value={selectedService}
          >
            <option disabled selected>
              Delivery Service
            </option>
            {services?.map((service: any, index: number) => {
              return (
                <option
                  value={[service.cost[0]?.value, service.service]}
                  key={index}
                >
                  {service.service}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{formatRupiah(selectedServiceCost)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
