
import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { BlogPost, BlogPostFormData } from "@/types/blog";

const COLLECTION_NAME = "blog_posts";
const blogsCollection = collection(db, COLLECTION_NAME);

// Get all published blog posts
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const q = query(
    blogsCollection, 
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as BlogPost;
  });
};

// Get all blog posts (for admin)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const q = query(blogsCollection, orderBy("createdAt", "desc"));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as BlogPost;
  });
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as BlogPost;
  }
  
  return null;
};

// Create a new blog post
export const createBlogPost = async (postData: BlogPostFormData, author: any): Promise<string> => {
  const slug = generateSlug(postData.title);
  
  const newPost = {
    ...postData,
    author: {
      name: author.displayName || "Anonymous",
      email: author.email,
      photoURL: author.photoURL || null
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    slug
  };
  
  const docRef = await addDoc(blogsCollection, newPost);
  return docRef.id;
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: Partial<BlogPostFormData>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  
  // If title is being updated, regenerate the slug
  const updates: any = {
    ...postData,
    updatedAt: serverTimestamp()
  };
  
  if (postData.title) {
    updates.slug = generateSlug(postData.title);
  }
  
  await updateDoc(docRef, updates);
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim();
};
