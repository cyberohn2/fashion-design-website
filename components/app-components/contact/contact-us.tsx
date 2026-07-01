"use client";
import { ChangeEvent, SubmitEvent, useEffect } from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconProps } from "../home-page/socials";
import { useRouter } from "next/navigation";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us - InnjoyTelcom";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const router = useRouter()

  const Icons = {
    whatsapp: (props: IconProps) => (
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title>WhatsApp</title>
        <path
          fill="black"
          d="M20.463,3.488C18.217,1.24,15.231,0.001,12.05,0    C5.495,0,0.16,5.334,0.157,11.892c-0.001,2.096,0.547,4.142,1.588,5.946L0.057,24l6.304-1.654    c1.737,0.948,3.693,1.447,5.683,1.448h0.005c6.554,0,11.89-5.335,11.893-11.893C23.944,8.724,22.708,5.735,20.463,3.488z     M12.05,21.785h-0.004c-1.774,0-3.513-0.477-5.031-1.378l-0.361-0.214l-3.741,0.981l0.999-3.648l-0.235-0.374    c-0.99-1.574-1.512-3.393-1.511-5.26c0.002-5.45,4.437-9.884,9.889-9.884c2.64,0,5.122,1.03,6.988,2.898    c1.866,1.869,2.893,4.352,2.892,6.993C21.932,17.351,17.498,21.785,12.05,21.785z M17.472,14.382    c-0.297-0.149-1.758-0.868-2.031-0.967c-0.272-0.099-0.47-0.149-0.669,0.148s-0.767,0.967-0.941,1.166    c-0.173,0.198-0.347,0.223-0.644,0.074c-0.297-0.149-1.255-0.462-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059    s-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.647    c0.099-0.198,0.05-0.372-0.025-0.521C9.919,8.978,9.325,7.515,9.078,6.92c-0.241-0.58-0.486-0.501-0.669-0.51    C8.236,6.401,8.038,6.4,7.839,6.4c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.298-1.04,1.017-1.04,2.479    c0,1.463,1.065,2.876,1.213,3.074c0.148,0.198,2.095,3.2,5.076,4.487c0.709,0.306,1.263,0.489,1.694,0.626    c0.712,0.226,1.36,0.194,1.872,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.29,0.173-1.413    C17.967,14.605,17.769,14.531,17.472,14.382z"
        />
      </svg>
    ),
    facebook: (props: IconProps) => (
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title>Facebook</title>
        <path
          fill="black"
          d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.793C0 19.506.494 20 1.104 20h9.58v-7.745H8.076V9.237h2.606V7.01c0-2.583 1.578-3.99 3.883-3.99 1.104 0 2.052.082 2.329.119v2.7h-1.598c-1.254 0-1.496.597-1.496 1.47v1.928h2.989l-.39 3.018h-2.6V20h5.098c.608 0 1.102-.494 1.102-1.104V1.104C20 .494 19.506 0 18.896 0z"
        />
      </svg>
    ),
    instagram: (props: IconProps) => (
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 32 32"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title>Instagram</title>
        <path d="M10 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.718-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.061 5.877.01 6.944 0 7.284 0 10s.012 3.057.06 4.123c.167 3.632 2.182 5.65 5.817 5.817 1.067.048 1.407.06 4.123.06s3.057-.012 4.123-.06c3.629-.167 5.652-2.182 5.816-5.817.05-1.066.061-1.407.061-4.123s-.012-3.056-.06-4.122C19.777 2.249 17.76.228 14.124.06 13.057.01 12.716 0 10 0zm0 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
      </svg>
    ),
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors: { [key: string]: string } = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.message) formErrors.message = "Message is required";
    return formErrors;
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("https://wa.me/09010817543?text=")
  };

  return (
    <section className="py-24 border-b">
      <div
        id="contact"
        className="flex flex-col sm:flex-row justify-between gap-4 max-w-270 mx-auto px-8 "
      >
        <div className="sm:w-125">
          <h2 className="mb-7 text-2xl font-semibold">Find us</h2>
          <div className="flex flex-col gap-5">
            <div className="p-3.75 rounded-[9px] bg-[#FBFBFB] border border-[#F3F3F3] flex items-center">
              <div>
                <h3 className="mb-1.5 text-[15px] font-semibold">Call Us</h3>
                <p className="text-[12px] text-[#666666]">
                  <a href="tel:+2348039631809">08039631809</a>
                </p>
              </div>
            </div>
            <div className="p-3.75 rounded-[9px] bg-[#FBFBFB] border border-[#F3F3F3] flex items-center">
              <div>
                <h3 className="mb-1.5 text-[15px] font-semibold">Email Now</h3>
                <p className="text-[12px] text-[#666666]">
                  <a href="mailto:georgedezzy@gmail.com">
                    georgedezzy@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="p-3.75 rounded-[9px] bg-[#FBFBFB] border border-[#F3F3F3] flex items-center">
              <div>
                <h3 className="mb-1.5 text-[15px] font-semibold">
                  Office Address
                </h3>
                <p className="text-[12px] text-[#666666]">
                  Km 45/46 Lekki-Epe Expressway
                  <br />
                  Ibeju-Lekki LGA
                  <br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-100">
          <div className="mb-7.5">
            <p className="text-[12px] mb-1.5">Contact info</p>
            <h2 className="text-[27px] font-semibold mb-3">Keep In Touch</h2>
            <p className="text-[12px] text-[#666666]">
              We prioritize responding to your inquiries promptly to ensure you
              receive the assistance you need in a timely manner
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="mb-5.5 flex flex-col gap-5.5">
              {/* Name field */}
              <div className="p-3.5 rounded-lg bg-white border border-[#F3F3F3] flex items-center">
                <label className="mr-2.25 block" htmlFor="name">
                  Name
                </label>
                <input
                  className="outline-none w-full"
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
              {/* Message field */}
              <div className="p-3.5 bg-white border border-[#F3F3F3] rounded-lg">
                <label className="mb-2.25 block" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="outline-none w-full"
                  cols={30}
                  rows={2}
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>
            {/* Submit Button */}
            <Button
              className="py-2.25 px-4.5 rounded-[4.5px] text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </form>
          {message && <p className="mt-4">{message}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contact;
