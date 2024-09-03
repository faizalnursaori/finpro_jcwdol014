import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const categories = [
    'Rice & Flour',
    'Fruits & Vegetables',
    'Instan Food',
    'Beverages',
    'Snacks & Biscuits',
    'Frozen',
  ];

  return (
    <>
      <div className="divider"></div>
      <footer className=" m-auto max-w-[80%] hidden md:block">
        <div className="flex flex-row gap-12 justify-between my-7">
          <div className="flex flex-col gap-6">
            <p className="font-bold text-xs">ABOUT US, HELP & FAQ</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="hover:underline" href="/about">
                About Us
              </Link>
              <Link className="hover:underline" href="/faq">
                Frequently Asked Question
              </Link>
              <Link className="hover:underline" href="/profile">
                My Profile
              </Link>
              <Link className="hover:underline" href="/policie/privacy">
                Privacy Policy
              </Link>
              <Link className="hover:underline" href="/policie/term">
                Term & Conditions
              </Link>
              <Link className="hover:underline" href=""></Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-bold text-xs">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm">
              <p></p>
              {categories.map((category, index) => {
                return (
                  <Link
                    className="hover:underline"
                    href={`/category/${category}`}
                    key={index}
                  >
                    {category}
                  </Link>
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
                <Link className="btn btn-ghost" href="/">
                  <Facebook />
                </Link>
                <Link className="btn btn-ghost" href="/">
                  <Instagram />
                </Link>
                <Link className="btn btn-ghost" href="/">
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
