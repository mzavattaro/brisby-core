const ToolBar = () => {
  return (
    <div className="fixed left-0 right-0 top-20 z-10 mx-auto max-w-screen-2xl bg-white px-6 pt-4">
      <div className="max-w-max rounded bg-slate-100 py-1.5 px-1">
        <div className="flex items-center px-1">
          <div className="flex items-center">
            <button
              type="button"
              className="text-md mr-2 inline-flex h-8 items-center rounded bg-white px-2 font-bold text-gray-900 hover:bg-slate-200 hover:text-slate-500"
            >
              Current
              <div className="ml-2 rounded-full bg-slate-200 px-1.5 text-sm text-gray-500">
                <span>34</span>
              </div>
            </button>
          </div>
          <button
            type="button"
            className="text-md inline-flex h-8 items-center border-transparent px-2 font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
