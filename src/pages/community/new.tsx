import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { classNames } from "../../utils/classNames";
import { useRouter } from "next/router";
import StyledLink from "../../components/StyledLink";
import Button from "../../components/Button";

const newCommunitySchema = z.object({
  complexName: z
    .string()
    .min(1, { message: "Community or building complex name is required" }),
  buildingType: z.string().min(1, { message: "Building type is required" }),
  totalOccupancies: z.coerce.number().nonnegative(),
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  suburb: z.string().min(1, { message: "Suburb address is required" }),
  state: z.string().min(1, { message: "State address is required" }),
  postcode: z.string().min(1, { message: "Postcode address is required" }),
});

type NewCommunitySchema = z.infer<typeof newCommunitySchema>;

const NewUser: React.FC<NewCommunitySchema> = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: sessionData } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewCommunitySchema>({
    resolver: zodResolver(newCommunitySchema),
  });

  //   const updateMutation = trpc.user.updateUser.useMutation({
  //     onSuccess: (data) => {
  //       queryClient.setQueryData([["user"], data.id], data);
  //       queryClient.invalidateQueries();
  //     },
  //   });

  const onSubmit: SubmitHandler<NewCommunitySchema> = async (data) => {
    // const {
    //   complexName,
    //   buildingType,
    //   totalOccupancies,
    //   streetAddress,
    //   suburb,
    //   state,
    //   postcode,
    // } = data;

    console.log(data);

    // updateMutation.mutate({
    //   data: {
    //     complexName: complexName,
    //     buildingType: buildingType,
    //     totalOccupancies: totalOccupancies,
    //     streetAddress: streetAddress,
    //     suburb: suburb,
    //     state: state,
    //     postcode: postcode,
    //   },
    //   id: sessionData?.user?.id,
    // });

    // router.push("/noticeboard");
  };

  return (
    <div className="mx-4 mt-6 grid grid-cols-1 justify-items-center gap-6 sm:mx-auto sm:w-full sm:max-w-2xl sm:grid-cols-6">
      <div className="col-span-1 flex flex-col items-center sm:col-span-6">
        <h4 className="text-lg font-bold text-gray-900 sm:text-3xl">Brisby</h4>
        <h2 className="mt-3 text-center text-2xl font-extrabold text-gray-900 sm:mt-6 sm:max-w-2xl sm:text-4xl">
          Add a building complex that you notify
        </h2>
        <p className="mt-2 text-center text-base text-gray-900 sm:text-lg">
          You can change these later in your <b>notify settings.</b>
        </p>
      </div>
      <form
        className="col-span-1 grid w-full grid-cols-6 gap-4 sm:col-span-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Building information */}
        <div className="col-span-6">
          <p className="w-full text-lg font-bold">Building information</p>
        </div>

        {/* Complex name */}
        <label className="col-span-6 block text-left text-sm font-semibold text-gray-900">
          Building complex name
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:h-10 sm:text-sm",
              errors.complexName
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="complexName"
            {...register("complexName", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.complexName && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.complexName?.message}
              </p>
            )}
          </div>
        </label>

        {/* Residential or commercial */}
        <label className="col-span-6 mt-2 block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-2">
          Residential or commercial
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.buildingType
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="buildingType"
            {...register("buildingType", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.buildingType && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.buildingType?.message}
              </p>
            )}
          </div>
        </label>

        {/* No. of units or apartments */}
        <label className="col-span-6 mt-2 block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-2">
          No. of units or apartments
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.totalOccupancies
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="number"
            id="totalOccupancies"
            {...register("totalOccupancies", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.totalOccupancies && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.totalOccupancies?.message}
              </p>
            )}
          </div>
        </label>

        {/* Building address */}
        <div className="col-span-6 mt-6 border-t">
          <p className="w-full pt-10 text-lg font-bold">Building address</p>
        </div>
        {/* Street address */}
        <label className="col-span-6 block text-left text-sm font-semibold text-gray-900">
          Street address
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.streetAddress
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="streetAddress"
            {...register("streetAddress", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.streetAddress && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.streetAddress?.message}
              </p>
            )}
          </div>
        </label>

        {/* Suburb */}
        <label className="col-span-6 mt-2 block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-2">
          Suburb
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.suburb
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="suburb"
            {...register("suburb", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.suburb && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.suburb?.message}
              </p>
            )}
          </div>
        </label>

        {/* State/territory */}
        <label className="col-span-6 mt-2 block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-2">
          State/Territory
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.state
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="state"
            {...register("state", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.state && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.state?.message}
              </p>
            )}
          </div>
        </label>

        {/* Postcode */}
        <label className="col-span-6 mt-2 block w-full text-left text-sm font-semibold text-gray-900 sm:col-span-2">
          Postcode
          <input
            className={classNames(
              "mt-1 block h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 placeholder-gray-400 sm:text-sm",
              errors.postcode
                ? "bg-rose-50 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-blue-600 focus:ring-blue-600"
            )}
            type="text"
            id="postcode"
            {...register("postcode", { required: true })}
          />
          <div className="absolute max-w-xl">
            {errors.postcode && (
              <p className="mt-1 h-10 text-sm font-bold text-rose-500">
                {" "}
                {errors.postcode?.message}
              </p>
            )}
          </div>
        </label>

        {/* Submit form */}
        <div className="col-span-6 mt-6 flex items-center justify-end sm:col-span-2 sm:col-end-7">
          <StyledLink className="mr-6" href={"/noticeboard"} styleType="link">
            Cancel
          </StyledLink>
          <Button
            disabled={isSubmitting}
            type="submit"
            size="md"
            style="primary"
          >
            {isSubmitting ? <span>Creating...</span> : <span>Submit</span>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
