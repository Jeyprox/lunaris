import Head from "next/head";
import FooterNav from "./FooterNav";

const PageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Lunari Empire</title>
        <meta
          name="description"
          content="Discover all the great cities of the Lunari Empire or apply for your Lunarian citizenship and become a glorious member of Lunaris!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-x-hidden">{children}</main>
      <footer>
        <FooterNav />
      </footer>
    </>
  );
};

export default PageLayout;
