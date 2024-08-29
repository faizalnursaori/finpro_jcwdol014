import { Facebook, Instagram, Twitter } from "lucide-react";

export default function FooterMobile() {
  const categories = [
    "Rice & Flour",
    "Fruits & Vegetables",
    "Instan Food",
    "Beverages",
    "Snacks & Biscuits",
    "Frozen",
    "Dairy",
  ];
  return (
    <div className="flex md:hidden flex-col">
      <div className="divider"></div>
      <div className="collapse collapse-arrow">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title font-medium">ABOUT US, HELP & FAQ</div>
        <div className="collapse-content flex flex-col ml-2">
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
      <div className="collapse collapse-arrow ">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title font-medium">CATEGORIES</div>
        <div className="collapse-content flex flex-col ml-2">
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
      <div className="collapse collapse-arrow">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title font-medium">SUPPORT HOTLINE</div>
        <div className="collapse-content flex flex-col gap-2 ml-2">
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
  );
}
