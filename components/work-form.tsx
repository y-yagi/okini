import Work from "../types/work";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useUser } from "../lib/useUser";

interface Props {
  work: Work;
  action: Function;
}

const WorkForm: NextPage<Props> = ({ work, action }) => {
  const router = useRouter();

  return (
    <section>
      <h3 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Works
      </h3>
      <Formik
        initialValues={{
          name: work.name,
          content: work.content,
          artistname: work.artistName,
          collection: work.collection || "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          action(
            values["name"].trim(),
            values["content"].trim(),
            values["artistname"].trim(),
            values["collection"].trim(),
          );
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
                  value={values.content}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Artist Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  placeholder="artist name"
                  name="artistname"
                  required
                  onChange={handleChange}
                  value={values.artistname}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Collection
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  placeholder="Collection"
                  name="collection"
                  value={values.collection}
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
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default WorkForm;
