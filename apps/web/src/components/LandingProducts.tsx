import { Plus } from "lucide-react";

export default function LandingProducts() {
  const productsDummy = [
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
    {
      title: "Indomie",
      description: "Mie Goreng Original Insant",
      price: 3000,
    },
  ];

  return (
    <div className="max-w-[80%] m-auto">
      <div className="flex justify-between mt-5 items-center">
        <h2 className="text-xl font-bold ">Product List Dummy</h2>
        <button className="btn btn-ghost hover:btn-link">View All</button>
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {productsDummy.map((product, index) => {
          return (
            <div key={index} className="card card-compact ">
                <div className="card-body">
                    <figure className="bg-base-200 rounded-md">
                        <img src="/newMie.png" alt="Mie" />
                    </figure>
                    <h2 className="card-title">{product.title}</h2>
                    <p className="hover:underline">{product.description}</p>
                    <div className="flex justify-between items-center">
                    <p className="font-bold text-success">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>
                    <button className="btn btn-ghost"><Plus/></button>
                    </div>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
