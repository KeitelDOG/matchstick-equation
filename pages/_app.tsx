import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const title = 'Match Stick Equation Solver';
  const desc = 'Solve match stick Equation by moving, adding, removing some sticks.';
  const imageUrl = `${process.env.NEXT_PUBLIC_HOST}/match-stick-equation.png`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_HOST} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_HOST} />
      </Head>
      <Component {...pageProps} />
    </>
  );

}
export default MyApp
