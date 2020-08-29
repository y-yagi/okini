import { Formik } from "formik";
import { useCollection, deleteDocument } from "@nandorojo/swr-firestore";
import * as firebase from "firebase/app";
import { useRouter } from "next/router";
import { useUser } from "../lib/useUser";

const ArtistForm = () => {
  const collection = "okini-artists";
  const { user } = useUser();
  const { add } = useCollection(collection);
  const timestamp = () => firebase.firestore.FieldValue.serverTimestamp();
  const router = useRouter();

  return (
    <section>
      <h3 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Add Artists
      </h3>
      <Formik
        initialValues={{ name: "", content: "" }}
        onSubmit={(values, { setSubmitting }) => {
          add({
            name: values["name"],
            content: values["content"],
            userId: user?.id,
            createdAt: timestamp(),
            updatdAt: timestamp(),
          });
          router.push("/");
        }}
        enableReinitialize={true}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  placeholder="name"
                  required
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Content
                </label>
              </div>
              <div className="md:w-2/3">
                <textarea
                  name="content"
                  placeholder="Content"
                  required
                  value={values.content}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="md:flex md:items-center">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default ArtistForm;
