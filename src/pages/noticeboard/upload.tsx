import axios from "axios";
// import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { registerClass } from "superjson";

// async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
//   const formData = new FormData(e.target);
//   const file = formData.get("file");
//   console.log("file", file);
//   if (!file) {
//     return null;
//   }
//   // @ts-ignore
//   const fileType = encodeURIComponent(file.type);
//   console.log("fileType", fileType);
//   const { data } = await axios.get(`/api/document?fileType=${fileType}`);
//   console.log("data", data);
//   const { uploadUrl, key } = data;
//   await axios.put(uploadUrl, file);
//   console.log("uploadUrl", uploadUrl);
//   console.log("key", key);
//   return key;
// }

async function uploadToS3(data: any) {
  const file = data.file[0];

  if (!file) {
    return null;
  }

  const fileType = encodeURIComponent(file.type);
  const fileData = await axios.get(`/api/document?fileType=${fileType}`);
  const { uploadUrl, key } = fileData.data;
  await axios.put(uploadUrl, file);
  return key;
}

function Upload() {
  //   async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
  //     e.preventDefault();
  //     console.log("e", e);
  //     await uploadToS3(e);
  //   }
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // const file = data.file[0];

    // if (!file) {
    //   return null;
    // }

    // const fileType = encodeURIComponent(file.type);
    // const fileData = await axios.get(`/api/document?fileType=${fileType}`);
    // const { uploadUrl, key } = fileData.data;
    // await axios.put(uploadUrl, file);
    // return key;
    const key = await uploadToS3(data);
    console.log("key", key);
  };

  return (
    <>
      <p>Please select file to upload</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("file")} accept="application/pdf" />
        {/* <input type="file" name="file" accept="application/pdf" /> */}
        <button type="submit">Upload</button>
      </form>
    </>
  );
}

export default Upload;
