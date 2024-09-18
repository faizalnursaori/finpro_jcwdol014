'use client';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getProvince, getCity } from '@/utils/getLocation';
import { editAddress } from '@/api/address';

export default function New() {
  const { data } = useSession();
  const [address, setAddress] = useState<any>();
  const [province, setProvince] = useState([]);
  const [provinceId, setProvinceId] = useState<number>(0);
  const [city, setCity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {id} = useParams()
  

  const getProv = async () => {
    const { data } = await getProvince();
    setProvince(data.rajaongkir.results);
  };

  const getCit = async (provinceId: number) => {
    const { data } = await getCity(provinceId);
    setCity(data?.rajaongkir?.results);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleChangeSelectProvince = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setProvinceId(e.target.selectedIndex);
    setAddress({ ...address, provinceId: e.target.selectedIndex });
  };
  const handleChangeSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(city[e.target.selectedIndex]?.city_id);
    
    setAddress({ ...address, cityId: city[e.target.selectedIndex]?.city_id});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(`ini id provinsi ${address.provinceId} dan ini id city ${address.cityId}`);
    
    e.preventDefault();
    setIsLoading(true)
    try {
      await editAddress(address, id as string);
      toast.success('Address Updated!');
      router.push('/profile/addresses');
    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getProv();
    getCit(provinceId);
  }, [provinceId]);

  return (
    <>
      <Toaster />
      <div className="card card-compact bg-base-100 shadow-xl h-fit w-[40vw] p-5">
        <div>
          <form className="form-control gap-4" onSubmit={handleSubmit}>
            <div className="form-control relative focus-within:border-white">
              <input
                onChange={handleChange}
                type="text"
                name="name"
                id="name"
                placeholder=""
                className="peer input input-bordered relative z-0 w-full focus:outline-none"
              />
              <label
                htmlFor="name"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">New Name</span>
              </label>
            </div>
            <div className="form-control relative focus-within:border-white">
              <input
                onChange={handleChange}
                type="text"
                name="address"
                id="address"
                placeholder=""
                className="peer input input-bordered relative z-0 w-full focus:outline-none"
              />
              <label
                htmlFor="name"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">New Address</span>
              </label>
            </div>
            <div className="form-control relative focus-within:border-white">
              <select
                className="peer text-md select select-bordered relative z-0 w-full focus:outline-none"
                name="province"
                id="province"
                onChange={handleChangeSelectProvince}
              >
                <option className="text-md" disabled selected>
                  Province
                </option>
                {province.map(
                  (prov: { province: string; province_id: string }) => {
                    return (
                      <option key={prov.province_id} id={prov.province_id}>
                        {prov.province}
                      </option>
                    );
                  },
                )}
              </select>
              <label
                htmlFor="gender"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">Province</span>
              </label>
            </div>
            <div className="form-control relative focus-within:border-white">
              <select
                className="peer text-md select select-bordered relative z-0 w-full focus:outline-none"
                name="province"
                id="province"
                onChange={handleChangeSelectCity}
              >
                {city?.map((cit: { city_name: string; city_id: string }) => {
                  return (
                    <option key={cit.city_id} id={cit.city_id}>
                      {cit.city_name}
                    </option>
                  );
                })}
              </select>
              <label
                htmlFor="gender"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">City</span>
              </label>
            </div>
            <div className="form-control relative focus-within:border-white">
              <input
                onChange={handleChange}
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder=" "
                className="peer input input-bordered relative z-0 w-full focus:outline-none"
              />
              <label
                htmlFor="postalCode"
                className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
              >
                <span className="bg-base-100 px-1">Postal Code</span>
              </label>
            </div>

            <div className="form-control mt-4">
              <button
                className="btn btn-success mb-4 text-base-100"
                disabled={isLoading}
              >
                {isLoading ? 'Submiting' : 'Submit'}
              </button>

              <div className="mt-4 flex w-80 flex-col items-center justify-center gap-8"></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
