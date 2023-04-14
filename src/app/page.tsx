import supabase, { type Site } from '@/lib/supabase';
import { NextAnchor } from '@/ui/anchor';
import Card from '@/ui/card';
import Datetime from '@/ui/datetime';
import Number from '@/ui/number';
import { ArrowRight, User } from 'lucide-react';

async function getRoot() {
  const { data, error } = await supabase.rpc('get_root_summary').single();
  if (error) throw new Error(error.message);
  return data;
}

async function getRecentPosts() {
  const { data, error } = await supabase
    .from('post')
    .select('slug, title, pub_date, site(slug, name)')
    .order('pub_date', { ascending: false })
    .limit(6);
  if (error) throw new Error(error.message);
  return data.map((post) => ({ ...post, site: post.site as Site }));
}

export default async function Home() {
  const { totalposts, totalsites, postweek } = await getRoot();
  const recentPosts = await getRecentPosts();

  return (
    <div className="mx-auto my-fluid-4 flex max-w-screen-md flex-col gap-fluid-3">
      <section>
        <h1 className="mb-2 font-fancy -tracking-[0.1em] text-6xl">feedjoy</h1>
        <p className="mb-fluid-4 text-2 text-lg">
          a minimal rss feed congregator
        </p>
        <ul className="flex max-w-max items-center gap-fluid-4 overflow-x-auto pb-1">
          <li className="flex shrink-0 flex-col gap-x-3 sm:flex-row sm:items-center">
            <span className="text-2">total posts:</span>
            <Number>{totalposts}</Number>
          </li>
          <li className="flex shrink-0 flex-col gap-x-3 sm:flex-row sm:items-center">
            <span className="text-2">total sites:</span>
            <Number>{totalsites}</Number>
          </li>
          <li className="flex shrink-0 flex-col gap-x-3 sm:flex-row sm:items-center">
            <span className="text-2">posts this week:</span>
            <Number>{postweek}</Number>
          </li>
        </ul>
      </section>
      <div className="h-1.5 w-full self-center rounded bg-2"></div>
      <section className="flex flex-col gap-2">
        <h2 className="text-2 text-lg">recent posts</h2>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Card
                href={`/sites/${post.site.slug}/${post.slug}`}
                title={post.title}
              >
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{post.site.name}</span>
                </p>
                <Datetime>{post.pub_date}</Datetime>
              </Card>
            </li>
          ))}
        </ul>
        <NextAnchor className="mt-4 self-end" href="/page/1">
          read all posts
          <ArrowRight className="h-5 w-5" aria-hidden />
        </NextAnchor>
      </section>
    </div>
  );
}
