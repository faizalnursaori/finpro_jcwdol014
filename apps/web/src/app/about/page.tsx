import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
export default function About() {
  return (
    <div className="w-[80vw] m-auto">
      <h1 className="text-4xl  mb-4 font-bold">About Us</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Welcome to Hemart</h2>
        <p className="mb-3">
          At Hemart, we believe that grocery shopping should be convenient,
          affordable, and enjoyable. Serving our community with a wide range of
          high-quality products, we are committed to being your one-stop
          destination for all your daily needs.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2 to-base-content">Why Choose Hemart?</h2>
        <div className="flex justify-center  gap-2">
          <p className='font-bold'>-</p>
          <p>
            <span className='font-semibold'>Quality You Can Trust:</span> We handpick our products to
            ensure only the freshest and best items make it to our shelves.
            Whether it's fresh produce, pantry staples, or specialty goods, you
            can trust Hemart for superior quality every time.
          </p>
        </div>
        <div className="flex gap-2">
        <p className='font-bold'>-</p>
          <p>
            <span className='font-semibold'>Affordable Prices:</span> We believe that healthy, delicious
            food should be accessible to everyone. That's why we offer
            competitive pricing without compromising on quality.
          </p>
        </div>
        <div className="flex gap-2">
        <p className='font-bold'>-</p>
          <p className="mb-3">
            <span className='font-semibold'>Customer-Focused Service:</span> Our team is dedicated to
            providing friendly and efficient service to ensure your shopping
            experience is seamless. If you need assistance, we're here to help!
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="mb-3">
          Hemart was founded with a mission to enrich the lives of our customers
          by offering exceptional grocery shopping experiences. We strive to
          create a welcoming environment where families can find the products
          they love and discover new ones along the way.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Join Our Comumnity</h2>
        <p className="mb-3">
          At Hemart, we're more than just a grocery store—we're a part of your
          community. Stay connected with us through our social media channels
          for the latest deals, recipe ideas, and more. Thank you for choosing
          Hemart, where fresh meets friendly!
        </p>
      </div>
    </div>
  );
}
