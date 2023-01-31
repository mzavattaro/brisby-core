import { getCsrfToken } from "next-auth/react";

type SignInProps = {
  csrfToken: string;
};

const SignIn: React.FC<SignInProps> = ({ csrfToken }) => {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="mx-4 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mt-24 text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <div className="mt-8 rounded-lg bg-white py-8 px-4 shadow-lg sm:px-10">
          <form method="post" action="/api/auth/signin/email">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label className="block text-sm font-semibold text-gray-900">
              Email address
              <input
                className="mt-2 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                type="text"
                id="email"
                name="email"
                placeholder="you@company.com"
              />
            </label>
            <button
              className="mt-2 flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
            >
              Sign in with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
