'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, TrendingUp, Star, Clock, ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';

interface Discussion {
  id: string;
  title: string;
  author: string;
  avatar: string;
  content: string;
  category: string;
  views: number;
  replies: number;
  likes: number;
  timestamp: string;
  tags: string[];
  animeImage?: string;
  animeTitle?: string;
}

const DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    title: 'Attack on Titan Final Season - Discussion Thread',
    author: 'AnimeReviewer',
    avatar: '/avatars/default-1.jpg',
    content: 'What did everyone think about the latest episode? The animation was incredible and the story development...',
    category: 'Episode Discussion',
    views: 1254,
    replies: 87,
    likes: 156,
    timestamp: '2 hours ago',
    tags: ['Attack on Titan', 'Final Season', 'Discussion'],
    animeImage: '/anime/aot.jpg',
    animeTitle: 'Attack on Titan'
  },
  {
    id: '2',
    title: 'Top 10 Anime of 2024 - Your Recommendations?',
    author: 'OtakuMaster',
    avatar: '/avatars/default-2.jpg',
    content: 'Looking for some great anime that came out this year. What are your top picks and why?',
    category: 'Recommendations',
    views: 892,
    replies: 43,
    likes: 89,
    timestamp: '5 hours ago',
    tags: ['2024', 'Recommendations', 'Top 10']
  },
  {
    id: '3',
    title: 'Demon Slayer Season 4 Announcement Reactions',
    author: 'DemonSlayerFan',
    avatar: '/avatars/default-3.jpg',
    content: 'Just saw the announcement for Season 4! I cannot contain my excitement. The trailer looks amazing...',
    category: 'News & Updates',
    views: 2103,
    replies: 134,
    likes: 278,
    timestamp: '1 day ago',
    tags: ['Demon Slayer', 'Season 4', 'News', 'Announcement'],
    animeImage: '/anime/demon-slayer.jpg',
    animeTitle: 'Demon Slayer'
  },
  {
    id: '4',
    title: 'Studio Ghibli Movies Ranked - Controversial Takes',
    author: 'GhibliFan2000',
    avatar: '/avatars/default-4.jpg',
    content: 'Here\'s my ranking of all Studio Ghibli movies. I know some of these might be controversial...',
    category: 'Reviews & Rankings',
    views: 756,
    replies: 62,
    likes: 94,
    timestamp: '2 days ago',
    tags: ['Studio Ghibli', 'Ranking', 'Movies']
  }
];

const CATEGORIES = [
  { name: 'Episode Discussion', count: 156, icon: MessageSquare },
  { name: 'Recommendations', count: 89, icon: Star },
  { name: 'News & Updates', count: 67, icon: TrendingUp },
  { name: 'Reviews & Rankings', count: 134, icon: Users },
  { name: 'Fan Art', count: 203, icon: Star },
  { name: 'General', count: 298, icon: MessageCircle }
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');

  const filteredDiscussions = selectedCategory === 'All' 
    ? DISCUSSIONS 
    : DISCUSSIONS.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Community
          </h1>
          <p className="text-gray-600 mb-6">
            Join discussions, share recommendations, and connect with fellow anime fans
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary-600">12.5K</div>
              <div className="text-sm text-gray-600">Members</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">947</div>
              <div className="text-sm text-gray-600">Discussions</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">3.2K</div>
              <div className="text-sm text-gray-600">Posts Today</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">845</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Start a Discussion</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Discussion title..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
                <Button className="w-full">
                  Create Post
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Discussions</span>
                    <span className="text-sm text-gray-500">{DISCUSSIONS.length}</span>
                  </div>
                </button>
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory === 'All' ? 'All Discussions' : selectedCategory}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Latest
                </Button>
              </div>
            </div>

            {/* Discussions */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                      {discussion.author[0].toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{discussion.author}</span>
                            <span>•</span>
                            <span>{discussion.timestamp}</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {discussion.category}
                            </span>
                          </div>
                        </div>
                        
                        {discussion.animeImage && (
                          <div className="w-16 h-20 relative rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={discussion.animeImage}
                              alt={discussion.animeTitle || ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {discussion.content}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {discussion.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{discussion.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">
                Load More Discussions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}