
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/services/blogService";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, ArrowLeft, Eye } from "lucide-react";

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const initialFormData: BlogPostFormData = {
    title: "",
    content: "",
    imageUrl: "",
    published: false,
    excerpt: "",
    tags: []
  };

  const [formData, setFormData] = useState<BlogPostFormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/blog");
    }
  }, [loading, isAdmin, navigate]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (isAdmin) {
        try {
          const fetchedPosts = await getAllBlogPosts();
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching blog posts:", error);
          toast("Failed to load blog posts");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch toggle for published state
  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  // Handle adding tags
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle form submission for creating/editing post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast("Please fill in all required fields");
      return;
    }

    try {
      if (selectedPost) {
        // Editing existing post
        await updateBlogPost(selectedPost.id, formData);
        toast("Blog post updated successfully");
        
        // Update the posts list
        setPosts(prev => prev.map(post => 
          post.id === selectedPost.id
            ? { ...post, ...formData, updatedAt: new Date() }
            : post
        ));
      } else {
        // Creating new post
        if (!user) {
          toast("You must be logged in to create a post");
          return;
        }
        
        const newPostId = await createBlogPost(formData, user);
        toast("Blog post created successfully");
        
        // Fetch updated posts list
        const updatedPosts = await getAllBlogPosts();
        setPosts(updatedPosts);
      }
      
      // Reset form and selected post
      setFormData(initialFormData);
      setSelectedPost(null);
      setActiveTab("posts");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast("Failed to save blog post");
    }
  };

  // Handle editing post
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || "",
      published: post.published,
      excerpt: post.excerpt,
      tags: [...post.tags]
    });
    setActiveTab("editor");
  };

  // Handle deleting post
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteBlogPost(postId);
      toast("Blog post deleted successfully");
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast("Failed to delete blog post");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedPost(null);
    setFormData(initialFormData);
    setActiveTab("posts");
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-6xl py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Blog Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </a>
            </Button>
            {activeTab === "posts" && (
              <Button onClick={() => setActiveTab("editor")}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="editor">{selectedPost ? "Edit Post" : "New Post"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-6">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md mb-2" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription>
                          {format(post.createdAt, 'MMMM dd, yyyy')} • {post.published ? 'Published' : 'Draft'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditPost(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the blog post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">Create your first blog post</p>
                <Button onClick={() => setActiveTab("editor")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="editor">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>{selectedPost ? "Edit Post" : "Create New Post"}</CardTitle>
                  <CardDescription>
                    {selectedPost ? "Update your blog post" : "Fill in the details for your new blog post"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      placeholder="Enter post title" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea 
                      id="excerpt" 
                      name="excerpt" 
                      value={formData.excerpt} 
                      onChange={handleInputChange} 
                      placeholder="Brief summary of your post" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      value={formData.content} 
                      onChange={handleInputChange} 
                      placeholder="Write your blog post content" 
                      required 
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Featured Image URL</Label>
                    <Input 
                      id="imageUrl" 
                      name="imageUrl" 
                      value={formData.imageUrl} 
                      onChange={handleInputChange} 
                      placeholder="Enter image URL" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                          {tag}
                          <button 
                            type="button" 
                            className="ml-1 text-primary hover:text-primary/70"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input 
                      id="tags" 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      onKeyDown={handleAddTag}
                      placeholder="Add tags (press Enter to add)" 
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="published" 
                      checked={formData.published} 
                      onCheckedChange={handlePublishedChange} 
                    />
                    <Label htmlFor="published">Publish post</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedPost ? "Update Post" : "Create Post"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
