import Link from "next/link";
import Heading from "./Heading";
import ButtonLink from "./ButtonLink";

const Header = () => {
  return (
    <div className="fixed left-0 right-0 z-20 mx-auto flex h-20 max-w-screen-2xl place-content-between items-center gap-y-0 border-b border-slate-200 bg-white px-6">
      <div className="flex flex-col">
        <span>KIMBERLY COURT</span>
        <Heading className="font-medium" headingSize="h4">
          Community notices
        </Heading>
      </div>
      <ButtonLink fontSize="xs">
        <Link href="/noticeboard/settings">Account settings</Link>
      </ButtonLink>
    </div>
  );
};

export default Header;
