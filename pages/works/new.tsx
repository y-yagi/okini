import { useUser } from "../../lib/useUser";
import Container from "../../components/container";
import Layout from "../../components/layout";
import WorkForm from "../../components/work-form";
import Head from "next/head";
import Link from "next/link";

const New = () => {
  const { user, logout } = useUser();

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
          <WorkForm />
        </Container>
      </Layout>
    </>
  );
};

export default New;
