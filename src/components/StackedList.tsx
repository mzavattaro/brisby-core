import Image from "next/image";
import Link from "next/link";
import strataLogo from "../../public/strata-logo.jpg";

type communityNoticeProps = {
  id: string;
  created_at: string;
  flag?: string;
  title: string;
  description: string;
  active?: boolean;
  activated_at?: string;
  archived: boolean;
};

type communityNoticesProps = {
  communityNotices: communityNoticeProps[];
};

const StackedList = (props: communityNoticesProps) => {
  const { communityNotices } = props;

  return (
    <ul role="list" className="relative overflow-hidden">
      {communityNotices.map((communityNotice) => (
        <li
          key={communityNotice.id}
          className="mb-6 rounded border border-slate-200 bg-white"
        >
          <Link href="#" className="block hover:bg-gray-50">
            <div className="h-26 relative flex overflow-hidden">
              <div className="h-18 w-12.5 absolute top-4 left-4 border border-red-500">
                .pdf
              </div>
              <div className="pl-21 min-w-0 py-5 pr-5">
                <div className="mb-2 flex place-content-between items-center">
                  <Image src={strataLogo} alt="logo" />
                  <div className="leading-tight text-gray-500">27 Jul</div>
                </div>
                <div className="md:font- line-clamp-2 text-sm leading-tight text-gray-900">
                  Tailwind includes an expertly-crafted default color palette
                  out-of-the-box that is a great starting point if you don’t
                  have your own specific branding in mind.
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default StackedList;
