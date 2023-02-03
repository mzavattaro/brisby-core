import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "../utils/classNames";
import StyledLink from "../components/StyledLink";
import Home from "../../public/Home";
import Cog from "../../public/Cog";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { asPath } = router;

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="relative flex h-16 justify-between">
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
                <h4 className="block w-auto text-sm font-bold lg:hidden">
                  Kimberly Court
                </h4>

                <div className="hidden h-8 w-auto lg:block">
                  <div className="flex h-8 items-center">
                    <Home />
                    <h4 className="text-md ml-2 font-bold ">Kimberly Court</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* tabs */}
            <div className="hidden space-x-4 sm:flex md:space-x-8">
              {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              <Link
                href="/noticeboard"
                className={classNames(
                  "inline-flex items-center px-1 pt-1 text-xs md:text-sm",
                  asPath.match("/noticeboard$")
                    ? "font-bold text-indigo-600"
                    : "font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm"
                )}
              >
                All notices
              </Link>
              <Link
                href="/noticeboard/published"
                className={classNames(
                  "inline-flex items-center px-1 pt-1 text-xs md:text-sm",
                  asPath.includes("/published")
                    ? "font-bold text-indigo-600"
                    : "font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm"
                )}
              >
                Published
              </Link>
              <Link
                href="/noticeboard/drafts"
                className={classNames(
                  "inline-flex items-center px-1 pt-1 text-xs md:text-sm",
                  asPath.includes("/drafts")
                    ? "font-bold text-indigo-600"
                    : "font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm"
                )}
              >
                Drafts
              </Link>
              <Link
                href="/noticeboard/archived"
                className={classNames(
                  "inline-flex items-center px-1 pt-1 text-xs md:text-sm",
                  asPath.includes("/archived")
                    ? "font-bold text-indigo-600"
                    : "font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700 md:text-sm"
                )}
              >
                Archived
              </Link>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <StyledLink
                className="hidden px-4 text-xs sm:block md:text-sm"
                styleType="button"
                href="/noticeboard/new"
              >
                Upload notice
              </StyledLink>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <Cog />
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
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                          )}
                          onClick={
                            sessionData
                              ? () => signOut({ callbackUrl: "/" })
                              : () =>
                                  signIn("email", {
                                    callbackUrl: "/noticeboard",
                                  })
                          }
                        >
                          {sessionData ? "Sign out" : "Sign in"}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      <div className="mt-4 flex justify-center border-slate-200 pb-4 md:hidden">
                        <StyledLink
                          className="px-2 text-xs sm:block md:text-sm"
                          styleType="button"
                          href="/noticeboard/new"
                        >
                          Upload notice
                        </StyledLink>
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <Disclosure.Panel className="absolute z-10 w-full rounded-b-lg bg-white shadow-md sm:hidden">
            <div className="space-y-1 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Link className="w-full" href="/noticeboard">
                <Disclosure.Button className="block w-full border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-left text-base font-medium text-indigo-700">
                  All notices
                </Disclosure.Button>
              </Link>
              <Link href="/noticeboard/published">
                <Disclosure.Button className="block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-left text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                  Published
                </Disclosure.Button>
              </Link>

              <Link href="/noticeboard/drafts">
                <Disclosure.Button className="block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-left text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                  Drafts
                </Disclosure.Button>
              </Link>
              <Link href="/noticeboard/archived">
                <Disclosure.Button className="block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-left text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                  Archived
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
