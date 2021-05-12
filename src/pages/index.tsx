import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from "react-icons/fi";
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
// eslint-disable-next-line import/order
import Head from 'next/head';

import {useState, useEffect} from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home(  postsPagination  : HomeProps) {
  const [postsApi, setPostsApi] = useState([]);

  // useEffect(() => {
  //   fetch(postsPagination.next_page)
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //   // console.log(postsPagination);
  // }, []);

  console.log(postsPagination);
  // console.log(postsPagination.next_page);

  return (
    <>
      <Head>
        <title>Desafio CMS</title>
      </Head>

        {/* {postsPagination.results.map(post => (
          <h1>{post.data.title}</h1>
        ))} */}
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <time><FiCalendar />12 Mai 2021 <span><FiUser />Rafael Quartaroli</span></time>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'repeatable')],
    {
      fetch: ['repeatable.title', 'repeatable.subtitle', 'repeatable.author'],
      pageSize: 20,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data:
        {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
    };
  });

  const postPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  // const postHome = { postsPagination: postPagination, };

  console.log(postPagination);

  return {
    props: { postPagination },
  };
};
