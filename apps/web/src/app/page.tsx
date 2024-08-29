"use client";
import ListCategories from "@/components/ListCategories";
import LandingProducts from "@/components/LandingProducts";
import { useState, useEffect } from "react";
export default function Home() {
  //getting lan and long, still need the method to get the closest store
  const [lan, setLan] = useState("");
  const [lon, setLon] = useState("");

  const success = (res: any) => {
    console.log(res);

    setLan(res.coords.latitude);
    setLon(res.coords.longitude);
  };

  const fail = (res: any) => {
    console.log(res);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  }, []);

  return (
    <main>
      <div className="hero max-w-[80%] bg-pinky m-auto p-5 rounded-lg">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="">
            <p className="text-xs font-bold">Welcome to Hemart</p>
            <h1 className="text-3xl font-bold">
              Your One-Stop Shop for Fresh & Affordable Groceries
            </h1>
            <p className="py-6">
              At Hemart, we believe that everyone deserves access to fresh,
              high-quality groceries at prices that wont break the bank. Explore
              our wide selection of fresh produce, pantry staples, and household
              essentials. Shop smart, live healthy—only at Hemart.
            </p>
            <button className="btn btn-primary">Start Shopping!</button>
          </div>
        </div>
      </div>
      <section>
        <ListCategories/>
      </section>
      <section>
        <LandingProducts/>
        <LandingProducts/>
        <LandingProducts/>
      </section>
    </main>
  );
}
