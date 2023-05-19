import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const title = 'Match Stick Equation Solver';
  const desc = 'Solve match stick Equation by moving, adding, removing some sticks.';
  const imageUrl = '/match-stick-equation.png';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} key="description" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content={title} />;
        <meta property="og:description" content={desc} key="og:description" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content="/" key="og:url" />;
        <link rel="canonical" href="/" />;
      </Head>
      <Component {...pageProps} />
    </>
  );

}
export default MyApp
