"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-gray-800 font-bold text-2xl">
                Looks like you have found the doorway to the great nothing
              </h1>
              <p className="my-2 text-gray-800">
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>
              <Button onClick={handleClick} variant={"default"}>
                Take me there
              </Button>
            </div>
          </div>
          <div>
            <Image src="https://i.ibb.co/G9DC8S0/404-2.png" alt="Error 404" />
          </div>
        </div>
      </div>
      <div>
        <Image src="https://i.ibb.co/ck1SGFJ/Group.png" alt="Error 404" />
      </div>
    </div>
  );
}
