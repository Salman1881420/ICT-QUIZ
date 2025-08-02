'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings, MessageSquare, Star, ThumbsUp, Share2, Download } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Input } from '@/components/ui/Input';
import { AnimeInfo, IAnimeEpisode, IVideoResult } from '@/types/anime';
import { getAnimeTitle, formatEpisodeNumber } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<IAnimeEpisode | null>(null);
  const [videoSources, setVideoSources] = useState<IVideoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'AnimeViewer123',
      avatar: '/avatars/default-1.jpg',
      content: 'This episode was absolutely amazing! The animation quality is top-notch.',
      timestamp: '2 hours ago',
      likes: 24,
      replies: [
        {
          id: '1-1',
          user: 'OtakuMaster',
          avatar: '/avatars/default-2.jpg',
          content: 'I totally agree! The studio outdid themselves.',
          timestamp: '1 hour ago',
          likes: 8,
        }
      ]
    },
    {
      id: '2',
      user: 'AnimeExpert',
      avatar: '/avatars/default-3.jpg',
      content: 'The character development in this arc is phenomenal. Can\'t wait for the next episode!',
      timestamp: '3 hours ago',
      likes: 18,
    }
  ]);

  const animeId = params?.animeId as string;
  const episodeId = params?.episodeId as string;

  useEffect(() => {
    if (!animeId) return;

    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/anime/${animeId}`);
        const data = await response.json();
        setAnime(data);

        if (data.episodes && episodeId) {
          const episode = data.episodes.find((ep: IAnimeEpisode) => ep.id === episodeId);
          if (episode) {
            setCurrentEpisode(episode);
            await fetchVideoSources(episodeId);
          }
        }
      } catch (error) {
        console.error('Error fetching anime details:', error);
        toast.error('Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId, episodeId]);

  const fetchVideoSources = async (epId: string) => {
    setVideoLoading(true);
    try {
      const response = await fetch(`/api/episode/${epId}`);
      const data = await response.json();
      setVideoSources(data);
    } catch (error) {
      console.error('Error fetching video sources:', error);
      toast.error('Failed to load video sources');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleEpisodeChange = (episode: IAnimeEpisode) => {
    setCurrentEpisode(episode);
    router.push(`/watch/${animeId}/${episode.id}`);
  };

  const handleNextEpisode = () => {
    if (!anime?.episodes || !currentEpisode) return;
    
    const currentIndex = anime.episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < anime.episodes.length - 1) {
      handleEpisodeChange(anime.episodes[currentIndex + 1]);
    }
  };

  const handlePrevEpisode = () => {
    if (!anime?.episodes || !currentEpisode) return;
    
    const currentIndex = anime.episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      handleEpisodeChange(anime.episodes[currentIndex - 1]);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '/avatars/user.jpg',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added successfully!');
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    toast.success(`Rated ${rating}/5 stars!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!anime || !currentEpisode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Episode not found</h1>
          <p className="text-gray-600 mb-4">The episode you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const title = getAnimeTitle(anime.title);
  const currentEpisodeIndex = anime.episodes?.findIndex(ep => ep.id === currentEpisode.id) || 0;
  const hasNextEpisode = anime.episodes && currentEpisodeIndex < anime.episodes.length - 1;
  const hasPrevEpisode = currentEpisodeIndex > 0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          {videoLoading ? (
            <div className="aspect-video flex items-center justify-center bg-black">
              <LoadingSpinner size="lg" className="text-white" />
            </div>
          ) : videoSources ? (
            <VideoPlayer
              sources={videoSources.sources}
              title={`${title} - ${formatEpisodeNumber(currentEpisode.number)}`}
              onEnded={hasNextEpisode ? handleNextEpisode : undefined}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-black text-white">
              <div className="text-center">
                <p className="text-lg mb-4">Video sources not available</p>
                <Button variant="outline" onClick={() => fetchVideoSources(episodeId)}>
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Episode Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {title}
                  </h1>
                  <h2 className="text-xl text-gray-300 mb-2">
                    {formatEpisodeNumber(currentEpisode.number)}
                    {currentEpisode.title && `: ${currentEpisode.title}`}
                  </h2>
                  {currentEpisode.description && (
                    <p className="text-gray-400 leading-relaxed">
                      {currentEpisode.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  
                  {videoSources?.download && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(videoSources.download, '_blank')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Episode Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevEpisode}
                  disabled={!hasPrevEpisode}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Rate:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`w-5 h-5 ${
                            star <= userRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-500'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                    className="text-gray-400 hover:text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comments ({comments.length})
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextEpisode}
                  disabled={!hasNextEpisode}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Comments Section */}
            {showComments && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {comment.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{comment.user}</span>
                          <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm">
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likes}
                          </button>
                          <button className="text-gray-400 hover:text-white text-sm">
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {reply.user[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">{reply.user}</span>
                                    <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Anime Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-4 mb-6"
            >
              <Link href={`/anime/${animeId}`} className="block">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={anime.image}
                    alt={title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white hover:text-primary-400 transition-colors">
                  {title}
                </h3>
              </Link>
              {anime.rating && (
                <div className="flex items-center gap-1 mt-2 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{(anime.rating / 10).toFixed(1)}</span>
                </div>
              )}
            </motion.div>

            {/* Episodes List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <h3 className="font-semibold text-white mb-4">Episodes</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {anime.episodes?.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeChange(episode)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      episode.id === currentEpisode.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">
                      Episode {episode.number}
                    </div>
                    {episode.title && (
                      <div className="text-sm opacity-80 truncate">
                        {episode.title}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}