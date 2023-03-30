import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

type CommunityNoticeProps = {
  id: string;
  created_at: string;
  flag?: string;
  title: string;
  description: string;
  active?: boolean;
  activated_at?: string;
  archived: boolean;
};

type StackedListProps = {
  communityNotices: CommunityNoticeProps[];
};

const StackedList: FC<StackedListProps> = (props) => {
  const { communityNotices } = props;

  return (
    <ul className="relative overflow-hidden">
      {communityNotices.map((communityNotice) => (
        <li
          key={communityNotice.id}
          className="mb-6 rounded border border-slate-200 bg-white"
        >
          <Link href="#" className="block hover:bg-gray-50">
            <div className="relative flex h-26 overflow-hidden">
              <div className="absolute top-4 left-4 h-18 w-12.5 border border-red-500">
                .pdf
              </div>
              <div className="min-w-0 py-5 pl-21 pr-5">
                <div className="mb-2 flex place-content-between items-center">
                  <Image src="/stratalogo.jpg" alt="logo" />
                  <div className="leading-tight text-gray-500">27 Jul</div>
                </div>
                <div className="md:font- text-sm leading-tight text-gray-900 line-clamp-2">
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
