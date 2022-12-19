import type { ReactNode } from "react";
import Image from "next/image";
import Button from "./Button";
import strataLogo from "../assets/stratalogo.jpg";
import Arrow from "../../public/Arrow";

const ColumnLayout = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <div className="z-1 relative top-36 grid grid-cols-12 gap-6">
      <main className="col-span-12 md:col-span-4">{children}</main>
      <aside className="hidden px-8 md:col-span-8 md:block">
        <div className="sticky top-36 rounded border border-slate-200">
          <div className="border-b border-slate-200">
            <div className="flex place-content-between items-center px-4 py-2 lg:px-8">
              <div className="flex">
                <Button className="mr-1" buttonSize="xs" buttonType="tertiary">
                  <Arrow />
                </Button>
                <Button
                  className="origin-center rotate-180"
                  buttonSize="xs"
                  buttonType="tertiary"
                >
                  <Arrow />
                </Button>
              </div>
              <div className="text-sm font-bold text-gray-500 lg:text-base">
                Monday 23 June, 1:22pm
              </div>
              <Button buttonSize="xs" buttonType="tertiary">
                Download
              </Button>
            </div>
          </div>
          <div className="border-b border-slate-200">
            <div className="flex place-content-between px-4 py-4 lg:px-8">
              <span className="text-md font-semibold lg:text-xl">
                Annual fire safety inspection notice
              </span>

              <Image src={strataLogo} alt="logo" />
            </div>
          </div>
          <div>div 3</div>
        </div>
      </aside>
    </div>
  );
};

export default ColumnLayout;
