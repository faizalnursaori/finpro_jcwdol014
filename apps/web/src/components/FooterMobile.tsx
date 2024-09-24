import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function FooterMobile() {
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
    <div className="flex md:hidden flex-col">
      <div className="divider"></div>
      <div className="collapse collapse-arrow">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title font-medium">ABOUT US, HELP & FAQ</div>
        <div className="collapse-content flex flex-col ml-2 gap-2">
          <Link className="hover:underline" href="/about">
            About Us
          </Link>
          <a className="hover:underline" href="/faq">
            Frequently Asked Question
          </a>
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
      
      <div className="collapse collapse-arrow">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title font-medium">SUPPORT HOTLINE</div>
        <div className="collapse-content flex flex-col ml-2 gap-2">
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
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <p className="font-medium ml-4">SHIPPING PARTNER</p>
        <p className="ml-4">JNE, JNT. dll</p>
      </div>
      <div>
        <p className="font-medium ml-4 mt-4">FOLLOW US ON SOCIAL MEDIA</p>
        <div className="flex gap-2 py-2 ml-4">
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
  );
}
