import { ProfileUserInfo } from "./components/ProfileUserInfo";
import { getServerQueryClient } from "@/app/query/server_query_client";
import { SidePanel } from "@/components/timeline/SidePanel";
import { Timeline } from "@/components/timeline/Timeline";
import { getPbPaginatedPosts } from "@/state/models/posts/custom_posts";

import { server_component_pb } from "@/state/pb/server_component_pb";
import { PBUserRecord } from "@/state/user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import dayjs from "dayjs";

interface pageProps {}

export const revalidate = 60;
export default async function ProfilePage({}: pageProps) {
  const { pb } = await server_component_pb();
  const loggedInUser = pb.authStore.model as unknown as PBUserRecord;

  const queryClient = getServerQueryClient();
  const currentdate = dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const user = pb.authStore.model as unknown as PBUserRecord;
  const key = ["custom_posts", loggedInUser.id] as const;
  await queryClient.prefetchInfiniteQuery({
    queryKey: key,
    queryFn: ({ queryKey, pageParam }) =>
      getPbPaginatedPosts(
        pb,
        {
          depth: 0,
          post_id: "",
          profile: "general",
          user_id: user?.id ?? "",
          key: queryKey[0],
        },
        pageParam
      ),
    defaultPageParam: {
      created: currentdate,
      id: "",
    },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <section className="w-full h-full min-h-screen flex flex-col items-center">
      <ProfileUserInfo data={loggedInUser} logged_in_user={loggedInUser} />
      <div className="w-full md:w-[90%] flex items-center justify-center">
        <HydrationBoundary state={dehydratedState}>
          <Timeline
            user={pb.authStore.model as unknown as PBUserRecord}
            main_key={key[0]}
            extra_keys={key.slice(1)}
            is_replies={false}
          />
        </HydrationBoundary>
        <div className="hidden lg:flex h-full w-[50%]">
          <SidePanel />
        </div>
      </div>
    </section>
  );
}
