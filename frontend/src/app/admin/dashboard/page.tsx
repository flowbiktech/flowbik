'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [newBlog, setNewBlog] = useState({ title: '', summary: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.push('/admin');
    
    const fetchBlogs = () => {
      fetch('http://localhost:8000/api/blog')
        .then(res => res.json())
        .then(data => setBlogs(data))
        .catch(err => console.error(err));
    };

    fetchBlogs();
  }, [router]);

  const fetchBlogs = () => {
    fetch('http://localhost:8000/api/blog')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        setNewBlog({ title: '', summary: '', content: '' });
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`http://localhost:8000/api/blog/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#06060e] text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Dashboard</h1>
            <p className="text-[#6e6e96]">Manage your local blog posts</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1c32] hover:bg-[#ef4444]/20 hover:text-[#ef4444] transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#10101e] border border-[#1c1c32] rounded-[20px] p-8 sticky top-12">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-[#3b82f6]" /> New Post
              </h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-[13px] text-[#6e6e96] mb-2">Title</label>
                  <input 
                    className="w-full bg-[#0b0b16] border border-[#1c1c32] rounded-lg p-3 outline-none focus:border-[#3b82f6]"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#6e6e96] mb-2">Summary</label>
                  <textarea 
                    className="w-full bg-[#0b0b16] border border-[#1c1c32] rounded-lg p-3 outline-none focus:border-[#3b82f6] min-h-[80px]"
                    value={newBlog.summary}
                    onChange={(e) => setNewBlog({...newBlog, summary: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#6e6e96] mb-2">Content</label>
                  <textarea 
                    className="w-full bg-[#0b0b16] border border-[#1c1c32] rounded-lg p-3 outline-none focus:border-[#3b82f6] min-h-[150px]"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#3b82f6] rounded-lg font-bold hover:bg-[#2563eb] transition-all">
                  Publish Post
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-[#10101e] border border-[#1c1c32] rounded-[15px] p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
                    <p className="text-sm text-[#6e6e96] mb-2">{blog.date}</p>
                    <p className="text-sm text-[#d8d8ee] line-clamp-2">{blog.summary}</p>
                  </div>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 text-[#6e6e96] hover:text-[#ef4444] transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="text-center py-20 text-[#6e6e96] bg-[#10101e] border border-dashed border-[#1c1c32] rounded-[20px]">
                  No posts yet. Create your first one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
