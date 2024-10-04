import Link from 'next/link';
import Image from 'next/image';

const categoriesData = [
  {
    category: 'Rice and Flour',
    path: '/Rice.jpg',
  },
  {
    category: 'Fruit and Vegetables',
    path: '/fruitsandvegetables.jpg',
  },
  {
    category: 'Instant Foods',
    path: '/readytoeat.jpg',
  },
  {
    category: 'Beverages',
    path: '/Beverages.jpg',
  },
  {
    category: 'Snacks and Biscuits',
    path: '/Snacksandsweets.jpg',
  },
  {
    category: 'Frozen',
    path: '/Frozen.jpg',
  },
];

export default function ListCategories() {
  return (
    <>
      <div className="max-w-[80%] m-auto">
        <h2 className="text-xl font-bold my-5">Discover our categories!</h2>
        <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5 md:w-full overflow-x-auto">
          {categoriesData.map((item, index) => {
            return (
              <div
                key={index}
                className="card card-compact bg-pinky shadow-xl justify-center"
              >
                <Link
                  className="card-body"
                  href={`/search?query=${item.category}`}
                >
                  <h2 className="card-title">{item.category}</h2>
                  <figure>
                    <Image
                      className="max-w-[90px]"
                      src={`${item.path}`}
                      alt={item.category}
                      width={150}
                      height={150}
                    />
                  </figure>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
