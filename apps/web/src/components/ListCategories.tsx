const categoriesData = [
    {
      category: "Rice & Flour",
      path: "/Rice.jpg",
    },
    {
      category: "Fruit & Vegetables",
      path: "/fruitsandvegetavles.jpg",
    },
    {
      category: "Instan Foods",
      path: "/readytoeat.jpg",
    },
    {
      category: "Beverages",
      path: "/Beverages.jpg",
    },
    {
      category: "Snacks & Biscuits",
      path: "/Snacksandsweets.jpg",
    },
    {
      category: "Frozen",
      path: "/Frozen.jpg",
    },
  ];
  
  export default function ListCategories() {
    return (
      <>
      <div className="max-w-[80%] m-auto">
      <h2 className="text-xl font-bold my-5">Discover our categories!</h2>
      <div className="grid lg:grid-cols-6 grid-cols-3 gap-5  md:w-full">
        {categoriesData.map((item, index) => {
          return (
            <div
              key={index}
              className="card card-compact bg-pinky shadow-xl "
            >
              <a className="card-body" href="/">
                <h2 className="card-title">{item.category}</h2>
                <figure>
                  <img
                    className="w-[110px]"
                    src={`${item.path}`}
                    alt={item.category}
                  />
                </figure>
              </a>
            </div>
          );
        })}
      </div>
      </div>
      </>
    );
  }
  