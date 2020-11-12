import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDocument } from "@nandorojo/swr-firestore";
import * as firebase from "firebase/app";
import Work from "../../types/work";
import { useUser } from "../../lib/useUser";
import Container from "../../components/container";
import Layout from "../../components/layout";
import WorkForm from "../../components/work-form";

const Edit = () => {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const { data, update, error } = useDocument<Work>(`okini-works/${id}`);

  function submit(name: string, content: string, artistName: string) {
    update({
      name: name,
      content: content,
      artistName: artistName,
    });
  }

  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  if (!user) {
    return (
      <>
        <p>
          Please signed in.{" "}
          <Link href={"/auth"}>
            <a>Sign in</a>
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Okini</title>
        </Head>
        <Container>
          <WorkForm work={data} action={submit} />
        </Container>
      </Layout>
    </>
  );
};

export default Edit;
