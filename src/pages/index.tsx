import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
// eslint-disable-next-line import/order
import Head from 'next/head';

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
  // eslint-disable-next-line react/no-unused-prop-types
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  const [postsApi, setPostsApi] = useState<PostPagination>(postsPagination);

  useEffect(() => {
    fetch(postsPagination.next_page)
      .then(response => response.json())
      .then((data: PostPagination) =>
        setPostsApi({
          ...data,
          next_page: data.next_page,
          results: data.results,
        })
      );
    // console.log(postsPagination);
  }, []);

  // console.log(postsApi);
  // console.log(postsApi.next_page);
  // console.log(postsApi.results.map(post => post.data.title));
  // console.log(postsPagination.next_page);
  // console.log(postsPagination.results.map(post => post.data.title));

  return (
    <>
      <Head>
        <title>Desafio CMS</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {postsApi.results.map(post => (
            <a key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <time>
                <FiCalendar />
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
              </time>
            </a>
          ))}
          {/* <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <time>
              <FiCalendar />
              12 Mai 2021{' '}
              <span>
                <FiUser />
                Rafael Quartaroli
              </span>
            </time>
          </a> */}
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
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
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

  console.log(postsResponse);
  // console.log(postPagination);

  return {
    props: { postsPagination: postPagination },
  };
};
