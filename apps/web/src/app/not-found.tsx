import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-[16px] sm:p-[24px] pt-[136px] flex flex-row justify-center items-center flex-grow min-h-screen">
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-gradient -z-10" />

      <div className="flex flex-col gap-[36px] items-center w-[600px] justify-center">
        <div className="flex flex-col gap-[12px]">
          <span className="font-brand text-stone-800 text-5xl leading-[55px] text-center">
            This page has become one with <span className="italic">Aether</span>{" "}
            - a bit too literally.
          </span>
          <span className="text-center text-stone-600">
            Let's guide you back to more tangible realms.
          </span>
        </div>
        <Link href={"/"}>
          <Button size={"lg"}>Go home</Button>
        </Link>
      </div>
    </div>
  );
}
