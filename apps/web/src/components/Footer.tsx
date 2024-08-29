import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const categories = [
    'Rice & Flour',
    'Fruits & Vegetables',
    'Instan Food',
    'Beverages',
    'Snacks & Biscuits',
    'Frozen',
    'Dairy',
  ];

  return (
    <>
      <div className="divider"></div>
      <footer className=" m-auto max-w-[80%] hidden md:block">
        <div className="flex flex-row gap-12 justify-between my-7">
          <div className="flex flex-col gap-6">
            <p className="font-bold text-xs">ABOUT US, HELP & FAQ</p>
            <div className="flex flex-col gap-2 text-sm">
              <a className="hover:underline" href="/about">
                About Us
              </a>
              <a className="hover:underline" href="/faq">
                Frequently Asked Question
              </a>
              <a className="hover:underline" href="/profile">
                My Profile
              </a>
              <a className="hover:underline" href="/policie/privacy">
                Privacy Policy
              </a>
              <a className="hover:underline" href="/policie/term">
                Term & Conditions
              </a>
              <a className="hover:underline" href=""></a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-bold text-xs">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm">
              <p></p>
              {categories.map((category, index) => {
                return (
                  <a
                    className="hover:underline"
                    href={`/category/${category}`}
                    key={index}
                  >
                    {category}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-bold text-xs">SUPPORT HOTLINE</p>
            <div>
              <p className="font-bold text-sm">Hotline:</p>
              <p>Monday - Friday 9:00am - 5:00pm</p>
              <p>+62 123456789</p>
            </div>
            <div>
              <p className="text-sm">
                <span className="font-bold">Email: </span>info@hemart.com
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <p className="font-bold text-xs">SHIPPING PARTNER</p>
              <p>JNE, JNT. dll</p>
            </div>
            <div>
              <p className="font-bold text-xs">FOLLOW US ON SOCIAL MEDIA</p>
              <div className="flex gap-2 py-2">
                <a className="btn btn-ghost" href="/">
                  <Facebook />
                </a>
                <a className="btn btn-ghost" href="/">
                  <Instagram />
                </a>
                <a className="btn btn-ghost" href="/">
                  <Twitter />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
