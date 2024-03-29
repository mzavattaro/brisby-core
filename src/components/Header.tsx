import { signIn, signOut, useSession } from 'next-auth/react';
import type { FC } from 'react';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '../utils/classNames';
import StyledLink from '../components/StyledLink';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MagnifyingGlass from '../../icons/MagnifyingGlass';

type HeaderProps = {
  toggle: () => void;
  toggleSearch: () => void;
};

const Header: FC<HeaderProps> = ({ toggle, toggleSearch }) => {
  const router = useRouter();
  const id = router.query.buildingId as string;
  const { data: sessionData } = useSession();

  const { asPath } = router;

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="relative flex h-12 justify-between md:h-14">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:flex-none sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <h2 className="text-md block w-auto font-semibold lg:hidden">
                  Brisby
                </h2>

                <div className="hidden h-8 w-auto lg:block">
                  <div className="flex h-8 items-center">
                    <h2 className="text-xl font-semibold">Brisby</h2>
                  </div>
                </div>
              </div>
            </div>
            {/* tabs */}
            <div className="hidden space-x-4 sm:flex md:space-x-8">
              <Link
                href={{
                  pathname: '/[buildingId]/noticeboard/',
                  query: { buildingId: id },
                }}
                className={classNames(
                  'inline-flex items-center px-1 pt-1 text-xs md:text-sm',
                  /\/noticeboard$/u.exec(asPath)
                    ? '-mb-0.5 border-b-2 border-indigo-600 text-indigo-600'
                    : 'font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm'
                )}
              >
                All notices
              </Link>
              <Link
                href={{
                  pathname: '/[buildingId]/noticeboard/archive',
                  query: { buildingId: id },
                }}
                className={classNames(
                  'inline-flex items-center px-1 pt-1 text-xs md:text-sm',
                  asPath.includes('/archive')
                    ? '-mb-0.5 border-b-2 border-indigo-600 text-indigo-600'
                    : 'font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm'
                )}
              >
                Archive
              </Link>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button className="sm:mr-4" type="button" onClick={toggleSearch}>
                <MagnifyingGlass
                  className="text-gray-400"
                  height="28"
                  width="28"
                />
              </button>
              <StyledLink
                className="hidden px-4 text-xs sm:block md:text-sm"
                type="button"
                href={{
                  pathname: '/[buildingId]/noticeboard/notice/new',
                  query: { buildingId: id },
                }}
              >
                Create notice
              </StyledLink>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <Cog6ToothIcon className="block h-6 w-6 text-gray-400" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="border-b">
                      <p className="block px-4 pt-2 text-sm text-gray-700">
                        Signed in as
                      </p>
                      <p className="block truncate px-4 pb-4 text-sm font-bold text-gray-700">
                        {sessionData?.user.name ?? sessionData?.user.email}
                      </p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={{
                            pathname: '/[buildingId]/noticeboard/archive',
                            query: { buildingId: id },
                          }}
                          className={classNames(
                            'block border-b px-4 py-2 text-sm text-gray-700',
                            active ? 'bg-gray-100' : ''
                          )}
                        >
                          Archive
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={toggle}
                          className={classNames(
                            'block w-full px-4 py-2 text-left text-sm text-gray-700',
                            active ? 'bg-gray-100' : ''
                          )}
                        >
                          Strata Titles
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/settings/account"
                          className={classNames(
                            'block border-b px-4 py-2 text-sm text-gray-700',
                            active ? 'bg-gray-100' : ''
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            'block w-full px-4 py-2 text-left text-sm text-gray-700',
                            active ? 'bg-gray-100' : ''
                          )}
                          onClick={
                            sessionData
                              ? async () => signOut({ callbackUrl: '/' })
                              : async () =>
                                  signIn('email', {
                                    callbackUrl:
                                      '/authentication/check-credentials',
                                  })
                          }
                        >
                          {sessionData ? 'Sign out' : 'Sign in'}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      <div className="mt-4 flex justify-center border-slate-200 pb-4 md:hidden">
                        <StyledLink
                          className="px-2 text-xs sm:block md:text-sm"
                          type="button"
                          href={{
                            pathname: '/[buildingId]/noticeboard/notice/new',
                            query: { buildingId: id },
                          }}
                        >
                          Create notice
                        </StyledLink>
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <Disclosure.Panel className="absolute left-0 z-10 w-full rounded-b-lg bg-white shadow-md sm:hidden">
            <div className="space-y-1 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Link
                className="w-full"
                href={{
                  pathname: '/[buildingId]/noticeboard/',
                  query: { buildingId: id },
                }}
              >
                <Disclosure.Button
                  className={classNames(
                    'block w-full border-l-4 px-3 py-2 text-left text-base font-medium',
                    /\/noticeboard$/u.exec(asPath)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  )}
                >
                  All notices
                </Disclosure.Button>
              </Link>
              <Link
                href={{
                  pathname: '/[buildingId]/noticeboard/archive',
                  query: { buildingId: id },
                }}
              >
                <Disclosure.Button
                  className={classNames(
                    'block w-full border-l-4 px-3 py-2 text-left text-base font-medium',
                    /\/noticeboard\/archive$/u.exec(asPath)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  )}
                >
                  Archive
                </Disclosure.Button>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
