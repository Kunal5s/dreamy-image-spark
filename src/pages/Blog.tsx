
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedBlogPosts } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPublishedBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-6xl py-12">
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-4xl font-bold">ArtifyAI Blog</h1>
          <p className="text-muted-foreground">
            Learn about AI image generation and stay updated with the latest features
          </p>
          {isAdmin && (
            <div className="mt-4">
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col">
                {post.imageUrl && (
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {format(post.createdAt, 'MMMM dd, yyyy')} • {post.author.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Check back later for new content</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
