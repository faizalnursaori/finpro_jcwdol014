'use client';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getProvince, getCity } from '@/utils/getLocation';
import { editWarehouse } from '@/api/warehouse';
import { getAdminOnly } from '@/utils/getAdminOnly';

export default function New() {
  const { data } = useSession();
  const [warehouse, setWarehouse] = useState<any>();
  const [province, setProvince] = useState([]);
  const [provinceId, setProvinceId] = useState<number>(0);
  const [city, setCity] = useState([]);
  const [admins, setAdmins] = useState([])
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

  const getAdmin = async () =>{
      const data = await getAdminOnly()
      setAdmins(data.data.user);
      console.log(data.data.user);
      
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleChangeSelectProvince = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setProvinceId(e.target.selectedIndex);
    console.log(e.target.selectedIndex);
    setWarehouse({ ...warehouse, provinceId: e.target.selectedIndex });
  };

  const handleChangeSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWarehouse({ ...warehouse, cityId: city[e.target.selectedIndex]?.city_id });
  };

  const handleChangeSelectAdmin = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAdmin: any = admins.filter((admin: {name: string}) => {
      return admin.name === e.target.value
    })
    console.log(selectedAdmin[0]);
    
    setWarehouse({ ...warehouse, userId: selectedAdmin[0].id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await editWarehouse({ ...warehouse }, id as string);
      toast.success('Store data updated!');
      router.push('/dashboard/store-management');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProv();
    getCit(provinceId);
    getAdmin()
  }, [provinceId]);

  return (
    <>
      <Toaster />
      <div>
      <h3 className='font-medium text-xl mb-5 ml-2'>Edit Store Data</h3>
        <div className="card card-compact bg-base-100 shadow-xl h-fit w-[40vw] p-5">
          <div>
            <form
              className="form-control gap-4 grid grid-cols-2"
              onSubmit={handleSubmit}
            >
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
                  <span className="bg-base-100 px-1">Name</span>
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
                  <span className="bg-base-100 px-1">Address</span>
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
                  htmlFor="province"
                  className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  <span className="bg-base-100 px-1">Province</span>
                </label>
              </div>
              <div className="form-control relative focus-within:border-white">
                <select
                  className="peer text-md select select-bordered relative z-0 w-full focus:outline-none"
                  name="city"
                  id="city"
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
                  htmlFor="city"
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
              <div className="form-control relative focus-within:border-white">
                <input
                  onChange={handleChange}
                  type="text"
                  name="latitude"
                  id="latitude"
                  placeholder=" "
                  className="peer input input-bordered relative z-0 w-full focus:outline-none"
                />
                <label
                  htmlFor="latitude"
                  className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  <span className="bg-base-100 px-1">Latitude</span>
                </label>
              </div>
              <div className="form-control relative focus-within:border-white">
                <input
                  onChange={handleChange}
                  type="text"
                  name="longitude"
                  id="longitude"
                  placeholder=" "
                  className="peer input input-bordered relative z-0 w-full focus:outline-none"
                />
                <label
                  htmlFor="longitude"
                  className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  <span className="bg-base-100 px-1">Longitude</span>
                </label>
              </div>
              <div className="form-control relative focus-within:border-white">
                <input
                  onChange={handleChange}
                  type="text"
                  name="storeRadius"
                  id="storeRadius"
                  placeholder=" "
                  className="peer input input-bordered relative z-0 w-full focus:outline-none"
                />
                <label
                  htmlFor="storeRadius"
                  className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  <span className="bg-base-100 px-1">Store Radius</span>
                </label>
              </div>
              <div className="form-control relative focus-within:border-white">
                <select
                  className="peer text-md select select-bordered relative z-0 w-full focus:outline-none"
                  name="user"
                  id="user"
                  onChange={handleChangeSelectAdmin}
                >
                  <option disabled>Admin</option>
                  {admins?.map((admin: {id: number, name: string, warehouse: {} | null}) => {
                    if(admin.warehouse === null){
                      return (
                        <option key={admin.id}>
                          {admin.name}
                        </option>
                      );
                    }
                    
                  })}
                </select>
                <label
                  htmlFor="user"
                  className="label pointer-events-none absolute left-3 top-1 select-none px-1 transition-all duration-300 peer-focus:-translate-y-[21px] peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-[21px] peer-[:not(:placeholder-shown)]:text-xs"
                >
                  <span className="bg-base-100 px-1">Assign Store Admin</span>
                </label>
              </div>
              <div className="form-control">
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
      </div>
    </>
  );
}
