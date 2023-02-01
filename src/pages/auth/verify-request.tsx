import Link from "next/link";

const VerifyRequest = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="mx-4 mt-8 text-center sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>
          <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            Check your email
          </h2>
        </div>
        <div className="mt-8 py-8 px-4 sm:px-10">
          <p className="mb-4 text-xl font-medium">
            Please check your inbox for your sign in link.
          </p>
          Sometimes this can land in spam.
          <div className="mt-12 text-gray-400 underline hover:text-gray-900">
            <Link href={"http://localhost:3000/"}>
              <p>back to homepage</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRequest;
