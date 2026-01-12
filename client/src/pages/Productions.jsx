import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ShareIcon,
  MusicalNoteIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { trackAPI } from "../services/api";
import Button3D from "../components/ui/Button3D";
import AudioPlayer from "../components/threejs/AudioPlayer";
import toast from "react-hot-toast";

const genres = [
  "All",
  "Gospel",
  "Afropop",
  "Hip Hop",
  "R&B",
  "Electronic",
  "Pop",
  "Rock",
];

const moods = [
  "All",
  "Chill",
  "Energetic",
  "Melancholic",
  "Uplifting",
  "Dark",
  "Romantic",
];

export default function Productions() {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: "All",
    mood: "All",
    sortBy: "newest",
    search: "",
  });

  // Responsive pagination limit
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const itemsPerPage = isLargeScreen ? 12 : 8;

  const { loadTrack, togglePlay, isPlaying, currentTrack } = useAudioPlayer();

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [currentPage, filters, itemsPerPage]);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort:
          filters.sortBy === "newest"
            ? "-createdAt"
            : filters.sortBy === "popular"
            ? "-plays"
            : "title",
      };

      if (filters.genre !== "All") params.genre = filters.genre;
      if (filters.mood !== "All") params.mood = filters.mood;
      if (filters.search) params.search = filters.search;

      const response = await trackAPI.getAll(params);

      // Use API data
      const tracksData = response.data.tracks || [];
      setTracks(tracksData);
      setFilteredTracks(tracksData);

      // Calculate total pages from API response
      // Check if API provides pages field, otherwise calculate from total count
      let calculatedPages = 1;
      if (response.data.pages) {
        calculatedPages = response.data.pages;
      } else if (response.data.total) {
        calculatedPages = Math.ceil(response.data.total / itemsPerPage);
      } else if (tracksData.length === itemsPerPage) {
        // If we got a full page, assume there might be more
        calculatedPages = currentPage + 1;
      }

      setTotalPages(calculatedPages);

      // Debug logging
      console.log("Pagination Debug:", {
        currentPage,
        itemsPerPage,
        tracksReceived: tracksData.length,
        apiPages: response.data.pages,
        apiTotal: response.data.total,
        calculatedPages,
      });
    } catch (error) {
      console.error("Error fetching tracks:", error.message);
      toast.error("Failed to load tracks");

      // Set empty state on error
      setTracks([]);
      setFilteredTracks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    loadTrack({
      ...track,
      audioUrl:
        track.audioFile || `https://www.youtube.com/watch?v=${track.youtubeId}`,
    });
  };

  const handleLike = async (trackId) => {
    try {
      // Try to call API, but continue even if it fails
      try {
        await trackAPI.like(trackId);
      } catch (apiError) {
        console.log("Like API call failed, updating local state only");
      }

      // Always update local state
      setTracks(
        tracks.map((track) =>
          track._id === trackId
            ? {
                ...track,
                likes: (track.likes || 0) + (track.isLiked ? 0 : 1),
                isLiked: !track.isLiked,
              }
            : track
        )
      );
      setFilteredTracks(
        filteredTracks.map((track) =>
          track._id === trackId
            ? {
                ...track,
                likes: (track.likes || 0) + (track.isLiked ? 0 : 1),
                isLiked: !track.isLiked,
              }
            : track
        )
      );
      toast.success(
        tracks.find((t) => t._id === trackId)?.isLiked
          ? "Removed from favorites"
          : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = (track) => {
    const shareUrl = `${window.location.origin}/track/${track._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      genre: "All",
      mood: "All",
      sortBy: "newest",
      search: "",
    });
    setCurrentPage(1);
  };

  const TrackCard = ({ track }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-3d group"
    >
      <div className="glass-effect rounded-2xl p-6 h-full flex flex-col">
        {/* Cover Image with Play Button */}
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={
              track.coverArt ||
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
            }
            alt={track.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={() => handleTrackSelect(track)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
          >
            {currentTrack?._id === track._id && isPlaying ? (
              <PauseIcon className="h-8 w-8 text-white" />
            ) : (
              <PlayIcon className="h-8 w-8 text-white ml-1" />
            )}
          </button>

          {/* Play Count */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
            {track.plays || 0} plays
          </div>

          {/* Like Button */}
          <button
            onClick={() => handleLike(track._id)}
            className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform"
          >
            {track.isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-grow">
          <h3 className="font-heading text-xl font-bold mb-2 truncate">
            {track.title}
          </h3>
          <p className="text-text-secondary mb-3">
            {track.artist?.name || "Unknown Artist"}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {track.genre?.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
              >
                {g}
              </span>
            ))}
            {track.mood && (
              <span className="text-xs bg-accent-pink/20 text-accent-pink px-2 py-1 rounded-full">
                {track.mood[0]}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              {track.duration
                ? `${Math.floor(track.duration / 60)}:${(track.duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "3:45"}
            </span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1" />
                {track.likes || 0}
              </span>
              <button
                onClick={() => handleShare(track)}
                className="hover:text-primary transition-colors"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading && tracks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Productions</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore our catalog of professionally produced tracks. From hip-hop
            to ambient, discover the Lobodo sound.
          </p>
        </motion.div>
      </div>

      {/* Interactive Audio Sphere */}
      <div className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AudioPlayer
            tracks={tracks.slice(0, 20)}
            onTrackSelect={handleTrackSelect}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-effect rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search tracks, artists..."
                  className="input-3d w-full pl-12"
                />
                <MusicalNoteIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-3d-primary flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
              {Object.values(filters).some(
                (v) => v !== "All" && v !== "newest" && v !== ""
              ) && (
                <span className="ml-2 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Genre Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Genre
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => handleFilterChange("genre", genre)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            filters.genre === genre
                              ? "bg-primary text-white"
                              : "glass-effect hover:bg-white/5"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Mood
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood}
                          onClick={() => handleFilterChange("mood", mood)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            filters.mood === mood
                              ? "bg-accent-pink text-white"
                              : "glass-effect hover:bg-white/5"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Sort By
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "newest", label: "Newest" },
                        { value: "popular", label: "Most Popular" },
                        { value: "name", label: "A-Z" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleFilterChange("sortBy", option.value)
                          }
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            filters.sortBy === option.value
                              ? "bg-secondary text-gray-900"
                              : "glass-effect hover:bg-white/5"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <AnimatePresence>
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TrackCard track={track} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTracks.length === 0 && !loading && (
          <div className="text-center py-20">
            <MusicalNoteIcon className="h-24 w-24 text-text-secondary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">No tracks found</h3>
            <p className="text-text-secondary mb-8">
              Try adjusting your filters or search term
            </p>
            <Button3D onClick={clearFilters}>Clear Filters</Button3D>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg glass-effect disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "glass-effect hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <span className="text-text-secondary">...</span>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg glass-effect disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Now Playing Bar */}
      {selectedTrack && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-20 left-0 right-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="glass-effect rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedTrack.coverArt}
                  alt={selectedTrack.title}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{selectedTrack.title}</h4>
                  <p className="text-sm text-text-secondary">
                    {selectedTrack.artist?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(selectedTrack._id)}
                  className="p-2 hover:text-red-500 transition-colors"
                >
                  {selectedTrack.isLiked ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5 text-white" />
                  ) : (
                    <PlayIcon className="h-5 w-5 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleShare(selectedTrack)}
                  className="p-2 hover:text-primary transition-colors"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
