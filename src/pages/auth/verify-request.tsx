export default function VerifyRequest() {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="mx-4 mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="mt-24 text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Sent
          </h2>
        </div>
        <div className="mt-8 rounded-lg bg-white py-8 px-4 shadow-lg sm:px-10">
          <p className="mb-4 text-xl font-medium">
            Please check your inbox for your sign in link.
          </p>
          Sometimes this can land in SPAM! While we hope that isn't the case if
          it doesn't arrive in a minute or three, please check.
        </div>
      </div>
    </div>
  );
}
