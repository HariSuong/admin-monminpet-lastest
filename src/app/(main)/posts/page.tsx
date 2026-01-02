import PostList from '@/components/posts/list'
import postApiRequest from '@/services/apiPosts'
import { cookies } from 'next/headers'
import React from 'react'

const PostsPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: posts } = await postApiRequest.getPosts(sessionToken)

    return (
      <div>
        <PostList initialPosts={posts} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }
}

export default PostsPage
